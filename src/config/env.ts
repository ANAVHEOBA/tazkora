import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tazkora',
    PORT: process.env.PORT || 5000,
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER || 'wisdomvolt@gmail.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'wisdomvolt@gmail.com',
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d'
} as const;