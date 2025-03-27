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

  generateCallbackHTML(data: { success: boolean; message: string; data?: any }): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tazkora - Connection Status</title>
            <meta name="theme-color" content="${env.HTML_TEMPLATE.THEME_COLOR}">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    background: ${env.HTML_TEMPLATE.PRIMARY_COLOR};
                    color: ${env.HTML_TEMPLATE.TEXT_COLOR};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .container {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    backdrop-filter: blur(10px);
                }
                .status-icon {
                    font-size: 48px;
                    margin: 1rem 0;
                }
                .title {
                    font-size: 1.5rem;
                    color: ${env.HTML_TEMPLATE.TEXT_COLOR};
                    margin: 1rem 0;
                    font-weight: 600;
                }
                .message {
                    color: rgba(255, 255, 255, 0.8);
                    margin: 1rem 0;
                    line-height: 1.5;
                }
                .loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid ${env.HTML_TEMPLATE.SECONDARY_COLOR};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .status-container {
                    background: ${data.success ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)'};
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status-container">
                    <div class="status-icon">${data.success ? '✅' : '❌'}</div>
                    <h1 class="title">${data.success ? 'Connection Successful' : 'Connection Failed'}</h1>
                    <p class="message">${data.message}</p>
                </div>
                <div class="loading"></div>
                <p class="message">This window will close automatically...</p>
            </div>
            <script>
                const data = ${JSON.stringify(data)};
                window.opener.postMessage({
                    type: '${data.success ? 'OAUTH_SUCCESS' : 'OAUTH_ERROR'}',
                    provider: 'discord',
                    data: data
                }, '${env.FRONTEND_URL}');
                setTimeout(() => {
                    window.close();
                }, 2000);
            </script>
        </body>
        </html>
    `;
  }
} 