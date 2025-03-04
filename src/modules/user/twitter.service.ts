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
  }

  async getAuthUrl(): Promise<string> {
    const scope = 'tweet.read users.read';
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${scope}&state=state`;
  }

  async getAccessToken(code: string): Promise<TwitterTokenResponse> {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', this.redirectUri);
    params.append('client_id', this.clientId);

    try {
      const response = await axios.post<TwitterTokenResponse>(
        'https://api.twitter.com/2/oauth2/token',
        params,
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Twitter getAccessToken error:', error);
      throw new Error('Failed to get Twitter access token');
    }
  }

  async getUserInfo(accessToken: string): Promise<TwitterUserResponse> {
    try {
      const response = await axios.get<TwitterUserResponse>(
        'https://api.twitter.com/2/users/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
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