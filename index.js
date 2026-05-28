const express = require('express');
const cors = require('cors');
const path = require('path');
const pair = require('./pair');

const app = express();
const PORT = process.env.PORT || 8080;

// TKT-CYBER-XMD Configuration
const BOT_CONFIG = {
    name: "TKT-CYBER-XMD",
    repo: "https://github.com/TKTTECH1/TKT-CYBER-XMD",
    owner: "Tafadzwa Kureya"
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to validate TKT-CYBER-XMD requests
app.use((req, res, next) => {
    // Add bot config to request for use in routes
    req.botConfig = BOT_CONFIG;
    next();
});

app.use('/pair', pair);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        bot: BOT_CONFIG.name,
        repo: BOT_CONFIG.repo
    });
});

app.listen(PORT, () => {
    console.log(`🚀 ${BOT_CONFIG.name} Pairing Server is running on port ${PORT}`);
    console.log(`📦 Repository: ${BOT_CONFIG.repo}`);
    console.log(`👤 Owner: ${BOT_CONFIG.owner}`);
});
