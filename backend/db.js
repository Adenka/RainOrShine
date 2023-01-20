const oracledb = require('oracledb');
const { throwError } = require('./utils/throwFunctions');

const dbConfig = {
    user          : "jb438249",
    password      : "Gusia8413",
    connectString : "localhost/LABS"
};

const startPool = async () => {
    try {
        await oracledb.createPool({
            user: dbConfig.user,
            password: dbConfig.password,
            connectionString: dbConfig.connectString
        });

        console.log("Connection pool started");
    }
    catch (err) {
        console.error(err,message);
    }
}

const closePool = async () => {
    try {
        await oracledb.getPool().close(10);
        console.log(0);
        process.exit(0);
    }
    catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

const query = async (sql, params) => {
    let connection = null;
    try {
        connection = await oracledb.getConnection()
        
        const result = await connection.execute(
            sql,
            params,
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows
    }
    catch(err) {
        console.error("SQL Error", err);
        throwError(500, "SQL Error");
    }
    finally {
        (connection) ? await connection.close() : {}
    }
}

module.exports = {
    startPool,
    closePool,
    query
}