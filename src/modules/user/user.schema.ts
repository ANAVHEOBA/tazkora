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

export const PostSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    taskType: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    taskCategory: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    verificationMethod: {
        type: String,
        required: true
    },
    targetLink: {
        type: String
    },
    budget: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'expired'],
        default: 'active'
    }
});