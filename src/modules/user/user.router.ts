import { Router } from 'express';
import { UserController } from './user.controller';
import { userMiddleware } from '../../middleware/user.middleware';

const router = Router();
const userController = new UserController();

// Public routes (no user required)
router.post('/request-access', userController.requestAccess.bind(userController));
router.post('/verify', userController.verifyAndLogin.bind(userController));

// Public partner routes
router.get('/partners', userController.viewPartners.bind(userController));

// Twitter routes - move these above the userMiddleware
router.get('/twitter/callback', userController.twitterCallback.bind(userController));

// Protected routes (user required)
router.use(userMiddleware); // Apply user middleware to all routes below this line

router.get('/partners/:partnerId', userController.viewPartnerDetails.bind(userController));
router.get('/me/tasks', userController.getMyTasks.bind(userController));

// Task submission routes
router.post('/partners/:partnerId/tasks', userController.submitTask.bind(userController));
router.get('/partners/:partnerId/tasks/status', userController.getTaskStatus.bind(userController));

// Task creation routes
router.post('/tasks/create', userController.createTask.bind(userController));
router.get('/tasks/created', userController.getCreatedTasks.bind(userController));

// User details route
router.patch('/me', userController.updateUserDetails.bind(userController));

// Twitter routes that require authentication
router.get('/twitter/connect', userController.connectTwitter.bind(userController));
router.post('/twitter/disconnect', userController.disconnectTwitter.bind(userController));

// Discord routes
router.get('/discord/connect', userMiddleware, userController.connectDiscord.bind(userController));
router.get('/discord/callback', userMiddleware, userController.discordCallback.bind(userController));
router.post('/discord/disconnect', userMiddleware, userController.disconnectDiscord.bind(userController));

// Telegram routes
router.post('/telegram/connect', userMiddleware, userController.connectTelegram.bind(userController));
router.post('/telegram/disconnect', userMiddleware, userController.disconnectTelegram.bind(userController));

export default router;