const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ ids, left, right }) => {
    if (ids.length === 0) {
        return [];
    }
    console.log("xd");
    const connection = await oracledb.getConnection();
    console.log("xdd");
    let sql = `SELECT place.id_place, place.place_name, weather.*
                FROM place JOIN weather ON place.id_place = weather.id_place
                WHERE id_period BETWEEN :0 AND :1
                AND place.id_place
                IN (`;
                console.log("xddd");
    for (let i = 0; i < ids.length; ++i) {
        sql += (i > 0) ? `, :` + i+2 : `:` + i+2;
    }
    sql += `)`;
    console.log("xdddd");
    const result = await connection.execute(
        sql,
        [left, right, ...ids],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log("xddddd");
    await connection.close()
    console.log("xdddddd");
    return result.rows
}