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

// Protected routes (user required)
router.use(userMiddleware); // Apply user middleware to all routes below this line

router.get('/partners/:partnerId', userController.viewPartnerDetails.bind(userController));
router.get('/me/tasks', userController.getMyTasks.bind(userController));

// Add new protected routes for task submission
router.post('/partners/:partnerId/tasks', userController.submitTask.bind(userController));
router.get('/partners/:partnerId/tasks/status', userController.getTaskStatus.bind(userController));

// Add new routes for task creation
router.post('/tasks/create', userController.createTask.bind(userController));
router.get('/tasks/created', userController.getCreatedTasks.bind(userController));

// Add new route for updating user details
router.patch('/me', userController.updateUserDetails.bind(userController));

export default router;