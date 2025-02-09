import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.post(
    '/send-verification',
    authMiddleware,
    userController.sendVerificationCode.bind(userController)
);

router.post(
    '/verify-email',
    authMiddleware,
    userController.verifyEmail.bind(userController)
);

router.post(
    '/posts',
    authMiddleware,
    userController.createPost.bind(userController)
);

router.get(
    '/posts',
    authMiddleware,
    userController.getUserPosts.bind(userController)
);

export default router;