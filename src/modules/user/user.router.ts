import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Auth routes (no middleware)
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.post('/send-verification', userController.sendVerificationCode.bind(userController));
router.post('/verify-email', userController.verifyEmail.bind(userController));

// Protected routes
router.post('/posts', authMiddleware, userController.createPost.bind(userController));
router.get('/posts', authMiddleware, userController.getUserPosts.bind(userController));

export default router;