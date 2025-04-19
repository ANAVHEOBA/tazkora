import { Router } from 'express';
import { RewardController } from './reward.controller';
import { userMiddleware } from '../../middleware/user.middleware';

const router = Router();
const rewardController = new RewardController();

// Get featured rewards
router.get(
  '/featured',
  userMiddleware,
  rewardController.getFeaturedRewards.bind(rewardController)
);

// Get user's rewards
router.get(
  '/',
  userMiddleware,
  rewardController.getUserRewards.bind(rewardController)
);

export default router;
