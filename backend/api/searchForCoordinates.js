const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ ids }) => {
    const connection = await oracledb.getConnection();
    
    let sql = `SELECT place.id_place, place.place_name, city.latitude, city.longitude
                FROM place JOIN city ON place.id_place = city.id_place
                WHERE city.id_place
                IN (`;

    for (let i = 0; i < ids.length; ++i) {
        sql += (i > 0) ? `, :` + i : `:` + i;
    }
    sql += `)`;

    const result = await connection.execute(
        sql,
        [...ids],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result
}