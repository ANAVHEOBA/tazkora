import { Request, Response } from 'express';
import { NotificationCrud } from './notification.crud';

export class NotificationController {
    private notificationCrud: NotificationCrud;

    constructor() {
        this.notificationCrud = new NotificationCrud();
    }

    async getUserNotifications(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const notifications = await this.notificationCrud.getUserNotifications(req.user.id);
            return res.status(200).json({
                success: true,
                notifications
            });
        } catch (error) {
            console.error('Get Notifications Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async markAsRead(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const { notificationId } = req.params;
            const notification = await this.notificationCrud.markAsRead(notificationId, req.user.id);

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Notification marked as read',
                notification
            });
        } catch (error) {
            console.error('Mark As Read Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async getUnreadCount(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const count = await this.notificationCrud.getUnreadCount(req.user.id);
            return res.status(200).json({
                success: true,
                count
            });
        } catch (error) {
            console.error('Get Unread Count Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
