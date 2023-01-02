const tunnel = require("./tunnel");
const database = require("./db");
const server = require("./server");

const main = async () => {
    try {
        const tnl = await tunnel.startTunnel()
        const db = await database.startPool()
        const srv = await server.startExpress()
    }
    catch(err) {
        console.log(err)
    }
}

main();