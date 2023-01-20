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

        countries = set()

        for city in citiesObject:
            if len(city) == 2:
                cityParams, data = city
                countryName = cityParams["country"]
                countries.add(countryName)

        countriesList = list(enumerate(countries, 0))
        countriesDict = dict(countriesList)
        countriesDictInv = {v: k for k, v in countriesDict.items()}
        countriesToCountries = [[val[0]] for val in countriesList]

        cursor.executemany("insert into place(id_place, place_name) values (:1, :2)", countriesList)
        cursor.executemany("insert into country(id_place) values (:1)", countriesToCountries)

        connection.commit()