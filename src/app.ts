import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRouter from './modules/user/user.router';
import adminRouter from './modules/admin/admin.router';
import partnerRouter from './modules/partner/partner.router';
import walletRouter from './modules/wallet/wallet.router';


const app = express();

// Middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ 
        success: true,
        message: 'Welcome to Tazkora API',
        version: '1.0.0',
        documentation: '/api-docs',
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
app.use('/api/admin', adminRouter);  // This will now handle admin/partners routes
app.use('/api/partners', partnerRouter); // This will handle both public and admin routes
app.use('/api/wallet', walletRouter);
app.use('/uploads', express.static('uploads'));

// Notifications


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
                users: '/api/users/*',
                partners: '/api/partners/*',
                admin: '/api/admin/*'
            }
        }
    });
});

export default app;