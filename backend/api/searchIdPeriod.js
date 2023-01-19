const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ id, left, right }) => {
    const connection = await oracledb.getConnection();
    
    const result = await connection.execute(
        `SELECT * FROM weather WHERE id_place = :1 AND id_period BETWEEN :2 AND :3`,
        [id, left, right],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result
}