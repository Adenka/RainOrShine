const oracledb = require('oracledb')
const { throwError, throwIf } = require('../utils/throwFunctions')

module.exports = async ({ prefix }) => {
    const connection = await oracledb.getConnection();
    
    const xd = `${prefix}%`
    const result = await connection.execute(
        `SELECT * FROM (SELECT id_place, place_name FROM place WHERE place_name LIKE :1) WHERE ROWNUM <= 10`,
        [xd],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close()

    return result.rows
}