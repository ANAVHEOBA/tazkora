import axios from 'axios';
import { env } from '../../config/env';

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUserResponse {
  id: string;
  username: string;
  discriminator: string;
  email?: string;
  avatar?: string;
}

export class DiscordService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
      throw new Error('Discord credentials not configured');
    }

    this.clientId = env.DISCORD_CLIENT_ID;
    this.clientSecret = env.DISCORD_CLIENT_SECRET;
    this.redirectUri = env.DISCORD_REDIRECT_URI;
  }

  async getAuthUrl(userId: string): Promise<string> {
    const scope = 'identify email';
    const state = Buffer.from(JSON.stringify({
        userId,
        timestamp: new Date().toISOString()
    })).toString('base64');

    return `https://discord.com/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
  }

  async getAccessToken(code: string): Promise<DiscordTokenResponse> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri
    });

    try {
      const response = await axios.post<DiscordTokenResponse>(
        'https://discord.com/api/oauth2/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Discord getAccessToken error:', error);
      throw new Error('Failed to get Discord access token');
    }
  }

  async getUserInfo(accessToken: string): Promise<DiscordUserResponse> {
    try {
      const response = await axios.get<DiscordUserResponse>(
        'https://discord.com/api/users/@me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Discord getUserInfo error:', error);
      throw new Error('Failed to get Discord user info');
    }
  }
} 