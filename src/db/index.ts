import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDB = async (): Promise<void> => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        } as mongoose.ConnectOptions;

        await mongoose.connect(env.MONGODB_URI, options);
        console.log('Connected to MongoDB Atlas successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};