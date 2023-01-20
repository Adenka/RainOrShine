import oracledb
import json
import ijson
import math

user = "jb438249"
password = "Gusia8413"
url = "LABS"

with oracledb.connect(user=user, password=password, dsn=url) as connection:
    with connection.cursor() as cursor:
        f = open('countries_data.json', newline='')
        countriesObject = ijson.items(f, 'item')
    
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        monthsNumbered = list(enumerate(months))
        monthsDict = dict(monthsNumbered)
        monthsDictInv = {v: k for k, v in monthsDict.items()}

        idsList = list(cursor.execute(
            "select place.id_place, place_name from place join country on place.id_place = country.id_place"
        ))
        #print(idsList[0])
        idsDict = dict(idsList)
        #print(idsDict[1465])
        idsDictRev = {v: k for k, v in idsDict.items()}

        weatherIdFake = list(cursor.execute(
            "select count(*) from weather"
        ))
        weatherId = weatherIdFake[0][0]
        weatherId = int(weatherId)
        
        weather = []

        for country in countriesObject:
            if len(country) == 2:
                countryParams, data = country
                #print(countryParams["country"])

                if countryParams["country"] in idsDictRev.keys():
                    countryId = idsDictRev[countryParams["country"]]
                    #print(countryParams["country"])
                    
                    for monthName in months:
                        oks = [False] * 8
                        oks[2] = (0 < data[monthName]["2"] and data[monthName]["2"] < 100)
                        oks[1] = (0 < data[monthName]["1"] and data[monthName]["1"] < 100)
                        oks[0] = (0 < data[monthName]["0"] and data[monthName]["0"] < 100)
                        oks[3] = (0 < data[monthName]["3"] and data[monthName]["3"] < 100)
                        oks[4] = (0 < data[monthName]["4"] and data[monthName]["4"] < 100)
                        oks[5] = (0 < data[monthName]["5"] and data[monthName]["5"] < 1000)
                        oks[6] = (0 < data[monthName]["6"] and data[monthName]["6"] < 31)
                        oks[7] = (0 < data[monthName]["8"] and data[monthName]["8"] < 24)
                        
                        if oks[6] and oks[7] and oks[0] and oks[1] and oks[2] and oks[3] and oks[4] and oks[5]:
                            data[monthName]["2"] = math.floor(data[monthName]["2"] * 100) / 100
                            data[monthName]["1"] = math.floor(data[monthName]["1"] * 100) / 100
                            data[monthName]["0"] = math.floor(data[monthName]["0"] * 100) / 100
                            data[monthName]["3"] = math.floor(data[monthName]["3"] * 100) / 100
                            data[monthName]["4"] = math.floor(data[monthName]["4"] * 100) / 100
                            data[monthName]["5"] = math.floor(data[monthName]["5"] * 100) / 100
                            data[monthName]["6"] = math.floor(data[monthName]["6"] * 100) / 100
                            data[monthName]["8"] = math.floor(data[monthName]["8"] * 100) / 100

                            weather.append((
                                weatherId,
                                countryId,
                                monthsDictInv[monthName],
                                data[monthName]["2"], # temp_avg
                                data[monthName]["1"], # temp_avg_max
                                data[monthName]["0"], # temp_max
                                data[monthName]["3"], # temp_avg_min,
                                data[monthName]["4"], # temp_min
                                data[monthName]["5"], # rain_avg
                                data[monthName]["6"], # rain_days_avg
                                data[monthName]["8"]  # sun_hours_avg
                            ))
                            weatherId += 1
                else:
                    print(countryParams["country"])

        cursor.executemany(
            "insert into weather(\
                id_weather, id_place, id_period,\
                temp_avg, temp_avg_max, temp_max, temp_avg_min, temp_min,\
                rain_avg, rain_days_avg, sun_hours_avg\
            ) values (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11)", weather)
        
        connection.commit()