import { model } from 'mongoose';
import { UserSchema, PostSchema } from './user.schema';
import mongoose from 'mongoose';

export interface IUser {
    name: string;  
    email: string;
    isEmailVerified: boolean;
    verificationCode?: {
        code: string;
        expiresAt: Date;
    };
}

export interface IPost extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    userId: string;
    bio: string;
    taskType: 'Online' | 'Offline';
    title: string;
    description: string;
    taskCategory: string;
    deadline: Date;
    verificationMethod: string;
    targetLink?: string;
    budget: {
        amount: number;
        currency: string;
    };
    createdAt: Date;
    status: 'active' | 'completed' | 'expired';
}

export const User = model<IUser>('User', UserSchema);
export const Post = model<IPost>('Post', PostSchema);