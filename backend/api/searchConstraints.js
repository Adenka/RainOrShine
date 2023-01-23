const oracledb = require('oracledb');
const { query } = require('../db');

module.exports = async ({
    left, right,
    tempMax, tempAvgMax, tempAvg, tempAvgMin, tempMin, avgRain, avgRainDays, avgSunHours,
    center, radius
}) => {
    console.log(left, right, tempMax, tempAvgMax, tempAvg, tempAvgMin, tempMin, avgRain, avgRainDays, avgSunHours, center, radius)

    /*AND (
                sdo_geom.sdo_distance(
                sdo_geometry(2001, 4326, sdo_point_type(city.latitude, city.longitude, null), null, null),
                sdo_geometry(2001, 4326, sdo_point_type(:21, :22, null), null, null),
                0.01,
                'unit=KM'
              )) <= :23 */

    return await query(
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
            AND POWER(city.latitude - :19, 2) + POWER(city.longitude - :20, 2) <= POWER(:21 / 100, 2)
            
        ) WHERE ROWNUM <= 1000`,
        [
            left,           right,
            tempMax[0],     tempMax[1],
            tempAvgMax[0],  tempAvgMax[1],
            tempAvg[0],     tempAvg[1],
            tempAvgMin[0],  tempAvgMin[1],
            tempMin[0],     tempMin[1],
            avgRain[0],     avgRain[1],
            avgRainDays[0], avgRainDays[1],
            avgSunHours[0], avgSunHours[1],
            center[0],      center[1],
            radius
        ]
    )
}