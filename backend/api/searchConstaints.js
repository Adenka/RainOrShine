const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({
    left, right,
    tempMax, tempAvgMax, tempAvg, tempAvgMin, tempMin, avgRain, avgRainDays, avgSunHours,
    center, radius
}) => {
    const connection = await oracledb.getConnection();

    const result = await connection.execute(
        `SELECT * FROM (
            SELECT DISTINCT place.id_place, place.place_name, city.latitude, city.longitude
            FROM place JOIN city ON place.id_place = city.id_place JOIN weather ON place.id_place = weather.id_place
            WHERE weather.id_period BETWEEN :1 AND :2
            AND weather.temp_max BETWEEN :3 AND :4
            AND weather.temp_avg_max BETWEEN :5 AND :6
            AND weather.temp_avg BETWEEN :7 AND :8
            AND weather.temp_avg_min BETWEEN :9 AND :10
            AND weather.temp_min BETWEEN :11 AND :12
            AND weather.rain_avg BETWEEN :13 AND :14
            AND weather.rain_days_avg BETWEEN :15 AND :16
            AND sun_hours_avg BETWEEN :17 AND :18
            AND POWER(city.latitude - :19, 2) + POWER(city.longitude - :20, 2) <= (:21)*(:21)
            ORDER BY place.place_name
        ) WHERE ROWNUM <= 1000
        `,
        [
            left, right,
            tempMax[0], tempMax[1],
            tempAvgMax[0], tempAvgMax[1],
            tempAvg[0], tempAvg[1],
            tempAvgMin[0], tempAvgMin[1],
            tempMin[0], tempMin[1],
            avgRain[0], avgRain[1],
            avgRainDays[0], avgRainDays[1],
            avgSunHours[0], avgSunHours[1],
            center[0], center[1],
            radius
        ],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close()

    return result.rows
}