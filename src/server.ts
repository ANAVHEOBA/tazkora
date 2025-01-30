import app from './app';
import { connectDB } from './db';
import { env } from './config/env';

const PORT = env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();