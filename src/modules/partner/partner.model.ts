import mongoose from 'mongoose';

export interface IPartner {
    name: string;
    logo: string;
    description: string;
    taskType: string;
    pointValue: number;
    targetCount: number;
    currentCount: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    taskType: {
        type: String,
        required: true
    },
    pointValue: {
        type: Number,
        required: true
    },
    targetCount: {
        type: Number,
        required: true
    },
    currentCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

export const Partner = mongoose.model<IPartner>('Partner', partnerSchema);