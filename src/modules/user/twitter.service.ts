import axios from 'axios';
import { env } from '../../config/env';

interface TwitterTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

interface TwitterUserResponse {
  data: {
    id: string;
    name: string;
    username: string;
  };
}

export class TwitterService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    if (!env.TWITTER_CLIENT_ID || !env.TWITTER_CLIENT_SECRET) {
      throw new Error('Twitter credentials not configured');
    }

    this.clientId = env.TWITTER_CLIENT_ID;
    this.clientSecret = env.TWITTER_CLIENT_SECRET;
    this.redirectUri = env.TWITTER_CALLBACK_URL;

    // Log configuration (remove in production)
    console.log('Twitter Service Configuration:');
    console.log('Redirect URI:', this.redirectUri);
    console.log('Client ID:', this.clientId.substring(0, 10) + '...');
  }

  async getAuthUrl(userId: string): Promise<string> {
    const scope = 'tweet.read users.read offline.access';
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    const state = Buffer.from(JSON.stringify({
        verifier: codeVerifier,
        userId: userId,
        timestamp: Date.now()
    })).toString('base64');
    
    const url = new URL('https://twitter.com/i/oauth2/authorize');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.redirectUri);
    url.searchParams.append('scope', scope);
    url.searchParams.append('state', state);
    url.searchParams.append('code_challenge_method', 'S256');
    url.searchParams.append('code_challenge', codeChallenge);

    console.log('Generated Twitter Auth URL:', {
        url: url.toString(),
        userId,
        timestamp: new Date().toISOString()
    });
    return url.toString();
  }

  private generateCodeVerifier(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const length = 128;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Buffer.from(hash).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async getAccessToken(code: string, verifier: string): Promise<TwitterTokenResponse> {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', this.redirectUri);
    params.append('client_id', this.clientId);
    params.append('code_verifier', verifier);

    console.log('Twitter Token Request:', {
        url: 'https://api.twitter.com/2/oauth2/token',
        params: Object.fromEntries(params),
        clientId: this.clientId.substring(0, 10) + '...'
    });

    try {
        const response = await axios.post<TwitterTokenResponse>(
            'https://api.twitter.com/2/oauth2/token',
            params,
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('Twitter Token Response:', {
            status: response.status,
            data: response.data
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Twitter getAccessToken error:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
        }
        throw new Error('Failed to get Twitter access token');
    }
  }

  async getUserInfo(accessToken: string): Promise<TwitterUserResponse> {
    try {
      const response = await axios.get<TwitterUserResponse>(
        'https://api.twitter.com/2/users/me',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Twitter getUserInfo error:', error);
      throw new Error('Failed to get Twitter user info');
    }
  }
} 