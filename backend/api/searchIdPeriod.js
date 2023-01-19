const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ id, left, right }) => {
    const connection = await oracledb.getConnection();
    
    const result = await connection.execute(
        `SELECT * FROM weather JOIN place ON weather.id_place = place.id_place
        WHERE place.id_place = :1 AND id_period BETWEEN :2 AND :3`,
        [id, left, right],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close()

    return result.rows
}