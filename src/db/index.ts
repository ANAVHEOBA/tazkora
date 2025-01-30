import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};