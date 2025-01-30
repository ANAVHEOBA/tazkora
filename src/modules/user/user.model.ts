import { model } from 'mongoose';
import { UserSchema } from './user.schema';

export interface IUser {
    name: string;  
    email: string;
    isEmailVerified: boolean;
    verificationCode?: {
        code: string;
        expiresAt: Date;
    };
}

export const User = model<IUser>('User', UserSchema);