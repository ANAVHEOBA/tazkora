import { Router } from 'express';
import { PartnerController } from './partner.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const partnerController = new PartnerController();

// Public routes
router.get('/public', partnerController.getAll.bind(partnerController));
router.get('/public/:id', partnerController.getById.bind(partnerController));

// Admin routes (with auth)
router.get('/admin', authMiddleware, partnerController.getAll.bind(partnerController));
router.post('/admin', authMiddleware, partnerController.create.bind(partnerController));
router.get('/admin/:id', authMiddleware, partnerController.getById.bind(partnerController));
router.put('/admin/:id', authMiddleware, partnerController.update.bind(partnerController));
router.delete('/admin/:id', authMiddleware, partnerController.delete.bind(partnerController));

export default router;