# TKT-CYBER-XMD Pairing System

A professional WhatsApp pairing code generator exclusively for **TKT-CYBER-XMD** bot. This system allows users to input their WhatsApp number and receive a pairing code to link their account with the bot.

## Features

✅ **Simultaneous Credential Sending** - Sends both `creds.json` file and session string at the same time when pairing completes.

✅ **TKT-CYBER-XMD Exclusive** - Only supports TKT-CYBER-XMD bot. Requests from other bots are rejected with a 403 Forbidden response.

✅ **High Performance** - Optimized to handle up to 2000 concurrent sessions.

✅ **Auto-Session Delivery** - Sends the `creds.json` (as a Base64 string) directly to the user's WhatsApp after successful pairing.

✅ **Universal Deployment** - Ready for Render, Heroku, Railway, Koyeb, and Docker.

✅ **Dark UI** - Sleek, modern interface designed for mobile and desktop.

## Key Modifications

### 1. **Simultaneous Credential Sending** (`pair.js`)
The pairing system now sends credentials in a unified manner:
- **creds.json file** - Sent as a document attachment
- **Session string** - Sent as a text message with `TKT-CYBER-XMD~` prefix
- **Warning message** - Security warning about not sharing credentials

All three are sent in sequence when the connection is established.

### 2. **TKT-CYBER-XMD Exclusive Support** (`pair.js` & `index.js`)
- Repository validation ensures only `https://github.com/TKTTECH1/TKT-CYBER-XMD` is supported
- Unauthorized requests receive a 403 Forbidden response
- Bot configuration is centralized in `index.js`

### 3. **Enhanced UI** (`public/index.html`)
- Added TKT-CYBER-XMD badge and branding
- Security warning banner
- Success message on pairing code generation
- Improved error handling and user feedback

### 4. **Configuration Management** (`index.js`)
- Centralized bot configuration
- Health check endpoint at `/health`
- Middleware for bot config injection
- Enhanced logging with bot information

## Installation

```bash
npm install
```

## Usage

### Start the Server
```bash
npm start
# or
node index.js
```

### Get Pairing Code
Navigate to `http://localhost:8080` and enter your WhatsApp number with country code.

### API Endpoint
```
GET /pair?number=263712345678
```

**Response:**
```json
{
  "code": "123-456-789"
}
```

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "bot": "TKT-CYBER-XMD",
  "repo": "https://github.com/TKTTECH1/TKT-CYBER-XMD"
}
```

## Credential Flow

1. User enters WhatsApp number on the web interface
2. System generates a pairing code
3. User enters code on WhatsApp Linked Devices
4. Upon successful connection:
   - `creds.json` file is sent as a document
   - Session string (base64 encoded) is sent as text
   - Security warning is sent
   - Session directory is automatically cleaned up

## Security

⚠️ **Important Security Notes:**
- Credentials are automatically deleted after pairing
- Session strings should never be shared
- Only TKT-CYBER-XMD bot is supported
- CORS is enabled for development (configure for production)

## Environment Variables

- `PORT` - Server port (default: 8080)

## Deployment

### 1. Render
- Create a new Web Service.
- Connect this repository.
- Use `node index.js` as the start command.
- Set environment variable `PORT=8080`.

### 2. Heroku
- Click the "Deploy to Heroku" button (if configured) or use the Heroku CLI.
- The `Procfile` is already included.

### 3. Railway / Koyeb
- Simply connect the repository and it will auto-detect the Node.js environment and start the server.

### 4. Docker
- Build: `docker build -t tkt-cyber-xmd-pairing .`
- Run: `docker run -p 8080:8080 tkt-cyber-xmd-pairing`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main UI page |
| `/pair` | GET | Get pairing code (query: `number`) |
| `/health` | GET | Health check endpoint |

## Credits
- Developed by **Tafadzwa Kureya**
- Repository: [TKT-CYBER-XMD](https://github.com/TKTTECH1/TKT-CYBER-XMD)

## License

This pairing system is exclusively for TKT-CYBER-XMD bot.
