import mongoose from 'mongoose';

export interface INotification {
    userId: mongoose.Types.ObjectId;
    type: 'NEW_PARTNER' | 'PARTNER_UPDATE' | 'PARTNER_DELETE' | 'NEW_POST';
    title: string;
    message: string;
    partnerId?: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['NEW_PARTNER', 'PARTNER_UPDATE', 'PARTNER_DELETE', 'NEW_POST'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
