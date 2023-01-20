import oracledb
import json
import ijson

user = "jb438249"
password = "Gusia8413"
url = "LABS"

with oracledb.connect(user=user, password=password, dsn=url) as connection:
    with connection.cursor() as cursor:
        f = open('cities_data.json', newline='')
        citiesObject = ijson.items(f, 'item')

        cities = set()

        for city in citiesObject:
            if len(city) == 2:
                cityParams, data = city
                countryName = cityParams["country"]
                regionName = cityParams["region"]
                cityName = cityParams["city"]
                coords = cityParams["coords"]

                cities.add((cityName, regionName, countryName, coords[0], coords[1]))

        countriesList = list(cursor.execute(
            "select place.id_place, place_name from place join country on place.id_place = country.id_place"
        ))

        countriesLen = len(countriesList)

        countriesDict = dict(countriesList)
        # Reversing the dictionary (country name -> id).
        countriesDictInv = {v: k for k, v in countriesDict.items()}

        regionsList = list(cursor.execute(
            "select place.id_place, place_name from place join region on place.id_place = region.id_place"
        ))

        regionsLen = len(regionsList)

        regionsDict = dict(regionsList)
        # Reversing the dictionary ((region name, country name) -> id).
        regionsDictInv = {v: k for k, v in regionsDict.items()}

        #print(regionsDictInv)

        citiesList = list(enumerate(cities, countriesLen + regionsLen))
        #print(citiesList[0])
        citiesDict = dict(citiesList)
        citiesDictInv = {v: k for k, v in citiesDict.items()}

        citiesToPlaces = []
        citiesToCities = []

        miasto = citiesList[0]

        for city in citiesList:
            citiesToPlaces.append((city[0], city[1][0]))
            # Adding city's id, its region as well as its latitude and longitude.
            citiesToCities.append((city[0], regionsDictInv[city[1][1]], city[1][4], city[1][3]))

        print(countriesLen)
        print(regionsLen)
        print(len(cities))

        cursor.executemany("insert into place(id_place, place_name) values (:1, :2)", citiesToPlaces)
        cursor.executemany("insert into city(id_place, id_region, latitude, longitude) values (:1, :2, :3, :4)", citiesToCities)

        connection.commit()
