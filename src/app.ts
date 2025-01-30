import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRouter from './modules/user/user.router';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
    });
});

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ 
        success: false,
        message: 'Route not found' 
    });
});

export default app;