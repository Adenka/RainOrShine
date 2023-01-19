const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ ids, left, right }) => {
    const connection = await oracledb.getConnection();
    
    let sql = `SELECT place.id_place, place.place_name
                FROM place JOIN weather ON place.id_place = weather.id_place
                WHERE id_period BETWEEN :0 AND :1
                AND place.id_place
                IN (`;

    for (let i = 0; i < ids.length; ++i) {
        sql += (i > 0) ? `, :` + i+2 : `:` + i+2;
    }
    sql += `)`;

    const result = await connection.execute(
        sql,
        [left, right, ...ids],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result
}