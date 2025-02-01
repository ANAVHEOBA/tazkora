import { Router } from 'express';
import { PartnerController } from './partner.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const partnerController = new PartnerController();

router.post('/', authMiddleware, partnerController.create.bind(partnerController));
router.get('/:id', authMiddleware, partnerController.getById.bind(partnerController));
router.put('/:id', authMiddleware, partnerController.update.bind(partnerController));
router.delete('/:id', authMiddleware, partnerController.delete.bind(partnerController));

export default router;