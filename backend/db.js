const oracledb = require('oracledb');

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

module.exports = {
    startPool,
    closePool
}