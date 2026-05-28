const express = require('express');
const router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const NodeCache = require("node-cache");

const msgRetryCounterCache = new NodeCache();

// Allowed repository for TKT-CYBER-XMD only
const ALLOWED_REPO = "https://github.com/TKTTECH1/TKT-CYBER-XMD";
const BOT_NAME = "TKT-CYBER-XMD";

router.get('/', async (req, res) => {
    let num = req.query.number;
    const repo = req.query.repo || ALLOWED_REPO;

    // Validate that only TKT-CYBER-XMD is being used
    if (repo !== ALLOWED_REPO) {
        return res.status(403).json({ 
            error: "Unauthorized", 
            message: `Only ${BOT_NAME} is supported. Repo: ${ALLOWED_REPO}` 
        });
    }

    async function TKT_PAIR() {
        const { state, saveCreds } = await useMultiFileAuthState(`./session/${num}`);
        try {
            let socket = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!socket.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await socket.requestPairingCode(num);
                if (!res.headersSent) {
                    res.send({ code });
                }
            }

            socket.ev.on('creds.update', saveCreds);
            socket.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    await delay(5000);
                    
                    // Read the creds.json file
                    let session_id = fs.readFileSync(path.join(__dirname, `./session/${num}/creds.json`));
                    let session_b64 = Buffer.from(session_id).toString("base64");
                    let final_session = `${BOT_NAME}~` + session_b64;

                    // Send both creds.json and session at the same time
                    try {
                        // Send creds.json file as a document
                        await socket.sendMessage(socket.user.id, {
                            document: fs.readFileSync(path.join(__dirname, `./session/${num}/creds.json`)),
                            mimetype: "application/json",
                            fileName: "creds.json"
                        });

                        // Send session string and warning message simultaneously
                        await socket.sendMessage(socket.user.id, { text: final_session });
                        await socket.sendMessage(socket.user.id, { 
                            text: `⚠️ *DO NOT SHARE THIS SESSION ID WITH ANYONE!* ⚠️\n\n*${BOT_NAME}* Bot is now connected successfully.\n\n*Owner:* Tafadzwa Kureya\n*Repo:* ${ALLOWED_REPO}\n\n*Supported Bot:* ${BOT_NAME} Only` 
                        });

                    } catch (sendErr) {
                        console.error("Error sending credentials:", sendErr);
                    }

                    await delay(2000);
                    try {
                        fs.rmSync(path.join(__dirname, `./session/${num}`), { recursive: true, force: true });
                    } catch (e) {}
                }

                if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    TKT_PAIR();
                }
            });
        } catch (err) {
            console.log(err);
            if (!res.headersSent) {
                res.status(500).send({ error: "Service Unavailable" });
            }
        }
    }
    TKT_PAIR();
});

module.exports = router;
