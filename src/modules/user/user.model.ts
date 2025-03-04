import { model, Document } from 'mongoose';
import mongoose from 'mongoose';
import { UserTask } from './user.types';

interface CompletedTask {
    partnerId: mongoose.Types.ObjectId;
    completedAt: Date;
    pointsEarned: number;
    status: 'pending' | 'approved' | 'rejected';
}

interface ITwitterConnection {
    twitterId: string;
    username: string;
    accessToken: string;
    connectedAt: Date;
    isConnected: boolean;
}

interface IDiscordConnection {
    discordId: string;
    username: string;
    email?: string;
    accessToken: string;
    refreshToken: string;
    connectedAt: Date;
    isConnected: boolean;
}

interface ITelegramConnection {
    telegramId: number;
    username?: string;
    firstName: string;
    lastName?: string;
    photoUrl?: string;
    authDate: Date;
    isConnected: boolean;
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    isEmailVerified: boolean;
    verificationCode?: {
        code: string;
        expiresAt: Date;
    };
    lastLoginAt?: Date;
    completedTasks: CompletedTask[];
    totalPoints: number;
    createdTasks: UserTask[];
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    bio?: string;
    profilePicture?: string;
    dateOfBirth?: Date;
    country?: string;
    city?: string;
    twitterConnection?: ITwitterConnection;
    discordConnection?: IDiscordConnection;
    telegramConnection?: ITelegramConnection;
}

const userTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    taskType: { 
        type: String, 
        enum: ['Online', 'Offline'], 
        required: true 
    },
    taskCategory: { 
        type: String, 
        enum: ['Social Media', 'Content Creation', 'Review', 'Other'], 
        required: true 
    },
    deadline: { type: Date, required: true },
    verificationMethod: { type: String, required: true },
    targetLink: { type: String },
    budget: { type: Number, required: true },
    bio: { type: String },
    image: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['active', 'completed', 'expired'], 
        default: 'active' 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationCode: {
        code: String,
        expiresAt: Date
    },
    lastLoginAt: Date,
    completedTasks: [{
        partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
        completedAt: Date,
        pointsEarned: Number,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    }],
    totalPoints: { type: Number, default: 0 },
    createdTasks: [userTaskSchema],
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    bio: { type: String },
    profilePicture: { type: String },
    dateOfBirth: { type: Date },
    country: { type: String },
    city: { type: String },
    twitterConnection: {
        twitterId: String,
        username: String,
        accessToken: String,
        connectedAt: Date,
        isConnected: Boolean
    },
    discordConnection: {
        discordId: String,
        username: String,
        email: String,
        accessToken: String,
        refreshToken: String,
        connectedAt: Date,
        isConnected: Boolean
    },
    telegramConnection: {
        telegramId: Number,
        username: String,
        firstName: String,
        lastName: String,
        photoUrl: String,
        authDate: Date,
        isConnected: Boolean
    }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);