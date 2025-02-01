import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.post('/login', adminController.login.bind(adminController));
router.post('/logout', authMiddleware, adminController.logout.bind(adminController));

export default router;