const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ id }) => {
    const connection = await oracledb.getConnection();
    
    const result = await connection.execute(
        `SELECT * FROM place WHERE id_place = :1`,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result
}