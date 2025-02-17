import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface JwtAdminPayload {
    userId: string;
    email: string;
    role: 'admin';
}

// Extend the base Request type
declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: string;
                email: string;
                role: 'admin';
            };
        }
    }
}

export interface AuthenticatedAdminRequest extends Request {
    admin: {
        id: string;
        email: string;
        role: 'admin';
    };
}

export const adminMiddleware = async (
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
            const decoded = jwt.verify(token, env.JWT_SECRET) as JwtAdminPayload;

            if (decoded.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
                return;
            }

            req.admin = {
                id: decoded.userId,
                email: decoded.email,
                role: 'admin'
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
        console.error('Admin Auth Middleware Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
}; 