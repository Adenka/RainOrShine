const oracledb = require('oracledb');
const { query } = require('../db');

module.exports = async ({
    left, right,
    tempMax, tempAvgMax, tempAvg, tempAvgMin, tempMin, avgRain, avgRainDays, avgSunHours,
    center, radius
}) => {
    console.log(tempMax, tempAvgMax, tempAvg, tempAvgMin, tempMin, avgRain, avgRainDays, avgSunHours, center, radius)

    function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

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
            AND (select sdo_geom.sdo_distance(
                sdo_geometry(2001, 4326, sdo_point_type(city.latitude, city.longitude, null), null, null),
                sdo_geometry(2001, 4326, sdo_point_type(:19, :20, null), null, null),
                0.01,
                'unit=KM'
              ) as distance
              from dual) <= ((:21)*(:21))
            ORDER BY place.place_name
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