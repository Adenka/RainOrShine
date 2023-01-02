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

const startTunnel = () => new Promise((resolve, reject) => {
    let tnl = tunnel(config, function(error, tnl) {
        if (error) {
            reject(error);
        }
        else {
            resolve(tnl);
        }
    });

    tnl.on('error', function(err) {
        console.log("Sth went erong", err);
    });
})

const closeTunnel = (tnl) => {
    tnl.close();
}

module.exports = {
    startTunnel,
    closeTunnel
}