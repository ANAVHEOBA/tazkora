import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email?: string;
                name?: string;
                // Add other user properties you might need
            }
        }
    }
}