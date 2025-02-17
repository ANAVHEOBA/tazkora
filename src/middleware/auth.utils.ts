import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface TokenPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
    name?: string;
}

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '24h'
    });
}; 