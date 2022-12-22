import oracledb
import json

user = "jb438249"
password = "Gusia8413"
url = "LABS"

with oracledb.connect(user=user, password=password, dsn=url) as connection:
    with connection.cursor() as cursor:
        with open('cities_data.json', newline='') as jsonfile:
            citiesObject = json.load(jsonfile)
            
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            monthsNumbered = list(enumerate(months))
            monthsDict = dict(monthsNumbered)
            monthsDictInv = {v: k for k, v in monthsDict.items()}

            idsList = list(cursor.execute(
                "select place.id_place, place_name from place join city on place.id_place = city.id_place"
            ))
            #print(idsList[0])
            idsDict = dict(idsList)
            #print(idsDict[1465])
            idsDictRev = {v: k for k, v in idsDict.items()}
            #print(idsDictRev[idsDict[1465]])

            weatherId = 0
            weather = []

            for city in citiesObject:
                if len(city) == 2:
                    cityParams, data = city
                    cityId = idsDictRev[cityParams["city"]]
                    
                    for monthName in months:
                        weather.append((
                            weatherId,
                            cityId,
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
                    #print(cityId)
                    # Sanity check.
                    #if weatherId < 13:
                    #    print(weather)
                    #    print(cityId)
                    #    print(idsDict[cityId])
        #print(weather)       
        cursor.executemany("insert into period(id_period, period_name) values (:1, :2)", monthsNumbered)
        cursor.executemany(
            "insert into weather(\
                id_weather, id_place, id_period,\
                temp_avg, temp_avg_max, temp_max, temp_avg_min, temp_min,\
                rain_avg, rain_days_avg, sun_hours_avg\
            ) values (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11)", weather)
            
        connection.commit()
