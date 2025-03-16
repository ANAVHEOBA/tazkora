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

  async getAuthUrl(): Promise<string> {
    const scope = 'tweet.read users.read offline.access';
    // Include userId and token in state
    const state = Buffer.from(JSON.stringify({
        verifier: Math.random().toString(36).substring(7),
        timestamp: Date.now()
    })).toString('base64');
    
    const url = new URL('https://twitter.com/i/oauth2/authorize');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.redirectUri);
    url.searchParams.append('scope', scope);
    url.searchParams.append('state', state);
    url.searchParams.append('code_challenge_method', 'plain');
    url.searchParams.append('code_challenge', 'challenge');

    // Debug log
    console.log('Generated Twitter Auth URL:', url.toString());

    return url.toString();
  }

  async getAccessToken(code: string): Promise<TwitterTokenResponse> {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', this.redirectUri);
    params.append('client_id', this.clientId);
    params.append('code_verifier', 'challenge');

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

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Twitter getAccessToken error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
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