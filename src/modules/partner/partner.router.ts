import { Router } from 'express';
import { PartnerController } from './partner.controller';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();
const partnerController = new PartnerController();

// Public routes
router.get('/public', partnerController.getAll.bind(partnerController));
router.get('/public/:id', partnerController.getById.bind(partnerController));

// Admin routes (with admin)
router.get('/admin', adminMiddleware, partnerController.getAll.bind(partnerController));
router.post('/admin', adminMiddleware, partnerController.create.bind(partnerController));
router.get('/admin/:id', adminMiddleware, partnerController.getById.bind(partnerController));
router.put('/admin/:id', adminMiddleware, partnerController.update.bind(partnerController));
router.delete('/admin/:id', adminMiddleware, partnerController.delete.bind(partnerController));

export default router;