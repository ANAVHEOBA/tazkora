import app from './app';
import { connectDB, disconnectDB } from './db';
import { env } from './config/env';

const PORT = env.PORT;
let retries = 0;
const MAX_RETRIES = 3;

const startServer = async () => {
    try {
        while (retries < MAX_RETRIES) {
            try {
                await connectDB();
                break; // If connection successful, break the retry loop
            } catch (error) {
                retries++;
                console.error(`Failed to connect to MongoDB (attempt ${retries}/${MAX_RETRIES}):`, error);
                if (retries === MAX_RETRIES) throw error;
                // Wait for 5 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            // Only log the host part of the MongoDB URI for security
            const uriParts = env.MONGODB_URI.split('@');
            console.log(`MongoDB URI: ${uriParts.length > 1 ? uriParts[1] : 'localhost'}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

// Update graceful shutdown handlers
const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    try {
        await disconnectDB();
        console.log('Server closed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();