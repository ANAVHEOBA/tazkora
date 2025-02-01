import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../modules/user/user.model';

interface JwtPayload {
    userId: string;
    email: string;
    name?: string;
    role: string; 
}

export const authMiddleware = async (
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
            const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

            req.user = {
                id: decoded.userId,
                email: decoded.email,
                name: decoded.name
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

            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ 
                    success: false,
                    message: 'Invalid token' 
                });
                return;
            }

            res.status(401).json({ 
                success: false,
                message: 'Token verification failed' 
            });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

export const isVerifiedMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ 
                success: false,
                message: 'Unauthorized' 
            });
            return;
        }

        const user = await User.findById(req.user.id);

        if (!user?.isEmailVerified) {
            res.status(403).json({ 
                success: false,
                message: 'Email not verified' 
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Verification Middleware Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

export const generateToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: 86400 
    };

    try {
        return jwt.sign(
            payload,
            env.JWT_SECRET,
            options
        );
    } catch (error) {
        console.error('Token Generation Error:', error);
        throw new Error('Failed to generate token');
    }
};