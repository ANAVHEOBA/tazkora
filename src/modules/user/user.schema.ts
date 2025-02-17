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
    },
    completedTasks: [{
        partnerId: {
            type: Schema.Types.ObjectId,
            ref: 'Partner',
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        pointsEarned: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    }],
    totalPoints: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});