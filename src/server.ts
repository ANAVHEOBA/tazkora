import app from './app';
import { connectDB } from './db';
import { env } from './config/env';

const PORT = env.PORT;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();
        
        // Start the server only after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`MongoDB URI: ${env.MONGODB_URI.split('@')[1]}`); // Log only the host part
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

// Add graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

startServer();