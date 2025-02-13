import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        code: String,
        expiresAt: Date,
    },
    lastLoginAt: {
        type: Date
    }
});