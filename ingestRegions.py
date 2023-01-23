import oracledb
import json
import ijson
from tqdm import tqdm

user = "jb438249"
password = "Gusia8413"
url = "LABS"

with oracledb.connect(user=user, password=password, dsn=url) as connection:
    with connection.cursor() as cursor:
        f = open('regions_data.json', newline='')
        citiesObject = ijson.items(f, 'item')

        regions = set()

        for city in tqdm(citiesObject):
            if len(city) == 2:
                cityParams, data = city
                countryName = cityParams["country"]
                regionName = cityParams["region"]
                coords = cityParams["coords"]
                regions.add((regionName, countryName, coords[0], coords[1]))

        countriesList = list(cursor.execute(
            "select place.id_place, place_name from place join country on place.id_place = country.id_place"
        ))

        countriesLen = len(countriesList)

        countriesDict = dict(countriesList)
        # Reversing the dictionary (country name -> id).
        countriesDictInv = {v: k for k, v in countriesDict.items()}

        # Data to insert to the place table.
        regionsToPlaces = []
        # Data to insert to the region table.
        regionsToRegions = []

        regionsList = list(enumerate(regions, 300000))

        for region in regionsList:
            print(region)
            # To the place table we want to add the region's id and its name.
            regionsToPlaces.append((region[0], region[1][0]))
            # To the regions table we want to add the region's is and its country's id.
            
            if region[1][1] in countriesDictInv:
                regionsToRegions.append((region[0], countriesDictInv[region[1][1]], region[1][2], region[1][3]))

        #print(regionsToPlaces)

        cursor.executemany("insert into place(id_place, place_name) values (:1, :2)", regionsToPlaces)
        cursor.executemany("insert into region(id_place, id_country, latitude, longitude) values (:1, :2, :3, :4)", regionsToRegions)
        
        connection.commit()