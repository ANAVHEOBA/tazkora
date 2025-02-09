import { Notification, INotification } from './notification.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

export class NotificationCrud {
    async createForAllUsers(data: {
        type: 'NEW_PARTNER' | 'PARTNER_UPDATE' | 'PARTNER_DELETE' | 'NEW_POST';
        title: string;
        message: string;
        partnerId?: mongoose.Types.ObjectId;
        postId?: mongoose.Types.ObjectId;
        isRead: boolean;
        excludeUserId?: string;
    }): Promise<mongoose.Document[]> {
        // Get all user IDs except the excluded one
        const query = data.excludeUserId 
            ? { _id: { $ne: data.excludeUserId } }
            : {};
        
        const users = await User.find(query, '_id');
        
        // Create notifications for users
        const notifications = await Notification.insertMany(
            users.map(user => ({
                ...data,
                userId: user._id
            }))
        );

        return notifications;
    }

    async getUserNotifications(userId: string): Promise<INotification[]> {
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
            
        return notifications;
    }

    async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true },
            { new: true }
        ).lean();
            
        return notification;
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await Notification.countDocuments({ userId, isRead: false });
    }
}
