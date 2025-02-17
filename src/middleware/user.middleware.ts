import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import mongoose from 'mongoose';

interface JwtUserPayload {
    userId: string;
    email: string;
    role: 'user';
}

// Extend the base Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: 'user';
                _id: mongoose.Types.ObjectId;
            };
        }
    }
}

export interface AuthenticatedUserRequest extends Request {
    user: {
        id: string;
        email: string;
        role: 'user';
        _id: mongoose.Types.ObjectId;
    };
}

export const userMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ 
                success: false,
                message: 'Authorization header must start with Bearer' 
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ 
                success: false,
                message: 'No token, authorization denied' 
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;

            if (decoded.role !== 'user') {
                res.status(403).json({
                    success: false,
                    message: 'Invalid user role'
                });
                return;
            }

            req.user = {
                id: decoded.userId,
                email: decoded.email,
                role: 'user',
                _id: new mongoose.Types.ObjectId(decoded.userId)
            };

            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ 
                    success: false,
                    message: 'Token has expired' 
                });
                return;
            }

            res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }
    } catch (error) {
        console.error('User Auth Middleware Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
}; 