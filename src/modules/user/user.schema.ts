import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    name: {          
        type: String,
        required: true,
    },
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
    }
});