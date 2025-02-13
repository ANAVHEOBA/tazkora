import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const userController = new UserController();

// Auth routes (no middleware)
router.post('/request-access', userController.requestAccess.bind(userController));
router.post('/verify', userController.verifyAndLogin.bind(userController));

export default router;