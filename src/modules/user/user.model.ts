import { model } from 'mongoose';
import { UserSchema } from './user.schema';
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    isEmailVerified: boolean;
    verificationCode?: {
        code: string;
        expiresAt: Date;
    };
    lastLoginAt?: Date;
}

export const User = model<IUser>('User', UserSchema);