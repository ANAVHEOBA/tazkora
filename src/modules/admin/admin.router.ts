import { Router } from 'express';
import { AdminController } from './admin.controller';
import { PartnerController } from '../partner/partner.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();
const partnerController = new PartnerController();

// Admin auth routes
router.post('/login', adminController.login.bind(adminController));
router.post('/logout', authMiddleware, adminController.logout.bind(adminController));

// Admin partner routes
router.get('/partners', authMiddleware, partnerController.getAll.bind(partnerController));
router.post('/partners', authMiddleware, partnerController.create.bind(partnerController));
router.get('/partners/:id', authMiddleware, partnerController.getById.bind(partnerController));
router.put('/partners/:id', authMiddleware, partnerController.update.bind(partnerController));
router.delete('/partners/:id', authMiddleware, partnerController.delete.bind(partnerController));

export default router;