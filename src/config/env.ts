import * as dotenv from 'dotenv';
dotenv.config();

// Helper function to construct MongoDB URI
const constructMongoDBURI = () => {
    const defaultURI = 'mongodb://localhost:27017/tazkora';
    
    if (!process.env.MONGODB_URI) return defaultURI;

    try {
        const uri = new URL(process.env.MONGODB_URI);
        // Ensure required query parameters
        uri.searchParams.set('retryWrites', 'true');
        uri.searchParams.set('w', 'majority');
        return uri.toString();
    } catch (error) {
        console.warn('Invalid MongoDB URI format, using default');
        return defaultURI;
    }
};

export const env = {
    MONGODB_URI: constructMongoDBURI(),
    PORT: process.env.PORT || 5000,
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER || 'wisdomvolt@gmail.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'wisdomvolt@gmail.com',
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID || '',
    TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET || '',
    TWITTER_CALLBACK_URL: 'https://tazkora-3.onrender.com/api/users/twitter/callback',
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || '',
    DISCORD_REDIRECT_URI: 'https://tazkora-production.up.railway.app/api/auth/discord/callback',
    TELEGRAM_APP_ID: process.env.TELEGRAM_APP_ID || '',
    TELEGRAM_APP_HASH: process.env.TELEGRAM_APP_HASH || '',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || '',
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || '',
} as const;