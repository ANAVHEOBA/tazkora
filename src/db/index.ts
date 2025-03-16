import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDB = async () => {
    try {
        const options = {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            retryReads: true,
        };

        mongoose.connection.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        await mongoose.connect(env.MONGODB_URI, options);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
        throw error;
    }
};