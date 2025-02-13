import { model } from 'mongoose';
import { UserSchema, PostSchema } from './user.schema';
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    username: string;
    password: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
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