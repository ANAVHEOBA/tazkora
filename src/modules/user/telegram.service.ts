import axios from 'axios';
import { env } from '../../config/env';
import crypto from 'crypto';

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export class TelegramService {
  private botToken: string;
  private appId: string;
  private appHash: string;

  constructor() {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_APP_ID || !env.TELEGRAM_APP_HASH) {
      throw new Error('Telegram credentials not configured');
    }

    this.botToken = env.TELEGRAM_BOT_TOKEN;
    this.appId = env.TELEGRAM_APP_ID;
    this.appHash = env.TELEGRAM_APP_HASH;
  }

  validateAuthData(authData: TelegramUserData): boolean {
    const { hash, ...data } = authData;
    
    // Sort object keys alphabetically
    const dataCheckString = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key as keyof typeof data]}`)
      .join('\n');

    // Create a secret key using SHA256
    const secretKey = crypto
      .createHash('sha256')
      .update(this.botToken)
      .digest();

    // Calculate HMAC-SHA256
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return calculatedHash === hash;
  }

  async sendMessage(chatId: number, text: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          chat_id: chatId,
          text: text
        }
      );
      return response.data.ok;
    } catch (error) {
      console.error('Telegram sendMessage error:', error);
      throw new Error('Failed to send Telegram message');
    }
  }
} 