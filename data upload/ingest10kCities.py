import oracledb
import json

user = "jb438249"
password = "Gusia8413"
url = "LABS"

with oracledb.connect(user=user, password=password, dsn=url) as connection:
    with connection.cursor() as cursor:
        with open('cities_data.json', newline='') as jsonfile:
            citiesObject = json.load(jsonfile)

            # We want to avoid duplicates, so data will be gathered in sets.
            countries = set()
            regions = set()
            cities = set()

            for city in citiesObject:
                # The city was read correctly and has two params - its data and its weather.
                if len(city) == 2:
                    cityParams, data = city
                    countryName = cityParams["country"]
                    # Added country name to the set.
                    countries.add(countryName)

                    regionName = cityParams["region"]
                    # To avoid collisions between two regions having the same name,
                    # we add it together with its country name.
                    regions.add((regionName, countryName))

                    cityName = cityParams["city"]
                    coords = cityParams["coords"]
                    # Avoiding collisions in a similar manner.
                    cities.add((cityName, regionName, countryName, coords[0], coords[1]))

                    # Data sanity check.
                    if cityName is None:
                        print("NIE MA NAZWY")
        
        # Changing the countries list to a list of numbered pairs
        # (each country gets a unique index).
        countriesList = list(enumerate(countries, 0))
        # Change the list to a dictionary (id -> country name).
        countriesDict = dict(countriesList)
        # Reversing the dictionary (country name -> id).
        countriesDictInv = {v: k for k, v in countriesDict.items()}
        
        # The countries' ids will be inserted into the country table.
        countriesToCountries = [[val[0]] for val in countriesList]
        print(countriesToCountries)

        # Indexing the regions staring from the last index from the country table + 1
        # (we want a unique id for each place).
        regionsList = list(enumerate(regions, len(countriesList)))
        # Dictionary out of the list (id -> (region name, country name)).
        regionsDict = dict(regionsList)
        # Reversing the dictionary ((region name, country name) -> id).
        regionsDictInv = {v: k for k, v in regionsDict.items()}

        # Data to insert to the place table.
        regionsToPlaces = []
        # Data to insert to the region table.
        regionsToRegions = []

        for region in regionsList:
            # To the place table we want to add the region's id and its name.
            regionsToPlaces.append((region[0], region[1][0]))
            # To the regions table we want to add the region's is and its country's id.
            regionsToRegions.append((region[0], countriesDictInv[region[1][1]]))

        # Sanity check.
        #print(regionsToPlaces)
        #print(regionsToRegions)

        # Cities handled similarly as regions.
        citiesList = list(enumerate(cities, len(countriesList) + len(regionsList)))
        print(citiesList[0])
        citiesDict = dict(citiesList)
        citiesDictInv = {v: k for k, v in citiesDict.items()}

        citiesToPlaces = []
        citiesToCities = []

        for city in citiesList:
            citiesToPlaces.append((city[0], city[1][0]))
            # Adding city's id, its region as well as its latitude and longitude.
            citiesToCities.append((city[0], regionsDictInv[(city[1][1], city[1][2])], city[1][4], city[1][3]))

        # Another sanity check.
        #print(citiesToPlaces[0])
        #print(citiesToCities[0])

        # Inserting data to the tables.
        cursor.executemany("insert into place(id_place, place_name) values (:1, :2)", countriesList)
        cursor.executemany("insert into country(id_place) values (:1)", countriesToCountries)
        cursor.executemany("insert into place(id_place, place_name) values (:1, :2)", regionsToPlaces)
        cursor.executemany("insert into region(id_place, id_country) values (:1, :2)", regionsToRegions)
        cursor.executemany("insert into place(id_place, place_name) values (:1, :2)", citiesToPlaces)
        cursor.executemany("insert into city(id_place, id_region, latitude, longitude) values (:1, :2, :3, :4)", citiesToCities)

        # Commit.
        connection.commit()
