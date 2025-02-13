import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRouter from './modules/user/user.router';
import adminRouter from './modules/admin/admin.router';
import partnerRouter from './modules/partner/partner.router';
import notificationRouter from './modules/notifications/notification.router';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ 
        success: true,
        message: 'Welcome to Tazkora API',
        version: '1.0.0',
        documentation: '/api-docs', // If you add Swagger/OpenAPI docs later
        healthCheck: '/health'
    });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ 
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/users', userRouter);

app.use('/api/admin', adminRouter);

app.use('/api/admin/partners', partnerRouter);

app.use('/api/notifications', notificationRouter);

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
        message: 'Route not found',
        availableRoutes: {
            root: '/',
            health: '/health',
            api: {
                users: '/api/users/*'
            }
        }
    });
});

export default app;