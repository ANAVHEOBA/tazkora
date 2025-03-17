import { Router } from 'express';
import { TaskController } from './task.controller';
import { userMiddleware } from '../../middleware/user.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();
const taskController = new TaskController();

// Routes accessible by both users and admins
router.get('/pools', userMiddleware, taskController.getAllTaskPools.bind(taskController));
router.get('/pools/:taskId', userMiddleware, taskController.getTaskPoolDetails.bind(taskController));

// User-specific routes
router.post('/pools/:taskId/submit', userMiddleware, taskController.submitTask.bind(taskController));
router.post('/pools/create', userMiddleware, taskController.createTaskPool.bind(taskController));

// Admin-specific routes
router.post('/admin/pools/create', adminMiddleware, taskController.createTaskPool.bind(taskController));
router.post('/admin/pools/:taskId/submissions/:userId/approve', 
  adminMiddleware, 
  taskController.approveSubmission.bind(taskController)
);

export default router; 