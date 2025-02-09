import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

router.get(
    '/',
    authMiddleware,
    notificationController.getUserNotifications.bind(notificationController)
);

router.get(
    '/unread-count',
    authMiddleware,
    notificationController.getUnreadCount.bind(notificationController)
);

router.put(
    '/:notificationId/read',
    authMiddleware,
    notificationController.markAsRead.bind(notificationController)
);

export default router;
