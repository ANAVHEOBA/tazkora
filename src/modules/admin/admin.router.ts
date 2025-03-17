import { Router } from 'express';
import { AdminController } from './admin.controller';
import { PartnerController } from '../partner/partner.controller';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();
const adminController = new AdminController();
const partnerController = new PartnerController();


// Add this route before other routes
router.post('/setup', adminController.setup.bind(adminController));

// Admin auth routes
router.post('/login', adminController.login.bind(adminController));
router.post('/logout', adminMiddleware, adminController.logout.bind(adminController));

// Admin partner routes
router.get('/partners', adminMiddleware, partnerController.getAll.bind(partnerController));
router.post('/partners', adminMiddleware, partnerController.create.bind(partnerController));
router.get('/partners/:id', adminMiddleware, partnerController.getById.bind(partnerController));
router.put('/partners/:id', adminMiddleware, partnerController.update.bind(partnerController));
router.delete('/partners/:id', adminMiddleware, partnerController.delete.bind(partnerController));

// Add this with other admin routes
router.get('/users', adminMiddleware, adminController.getAllUsers.bind(adminController));



export default router;