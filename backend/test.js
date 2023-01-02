const oracledb = require('oracledb');
const tunnel = require('tunnel-ssh');

const config = {
    keepAlive: true,
    host: "students.mimuw.edu.pl",
    port: 22,
    username:'jb438249',
    password:'Gusia8413',
    dstHost: "labora.mimuw.edu.pl",
    dstPort: 1521,
    localHost:'127.0.0.1',
    localPort: 1521
};

const dbConfig = {
    user          : "jb438249",
    password      : "Gusia8413",
    connectString : "localhost/LABS"
};

var tnl = tunnel(config, async (error, tnl) => {
    
    tnl.close();
});

setTimeout(async () => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
        `SELECT *
        FROM place
        where id_place = :id`,
        [0],
        {
            maxRows: 1
        });

        console.log(result.metaData); // [ { name: 'FARMER' }, { name: 'PICKED' }, { name: 'RIPENESS' } ]
        console.log(result.rows);     // [ [ 'Mindy', 2019-07-16T03:30:00.000Z, 'More Yellow than Green' ] ]

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                // Connections should always be released when not needed
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}, 1000);