import { Response } from 'express';
import { RewardCrud } from './reward.crud';
import { AuthenticatedUserRequest } from '../../middleware/user.middleware';

export class RewardController {
  private rewardCrud: RewardCrud;

  constructor() {
    this.rewardCrud = new RewardCrud();
  }

  // Get featured rewards
  async getFeaturedRewards(req: AuthenticatedUserRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const rewards = await this.rewardCrud.getFeaturedRewards(limit);

      return res.json({
        success: true,
        data: rewards
      });
    } catch (error) {
      console.error('Get Featured Rewards Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get featured rewards'
      });
    }
  }

  // Get user's rewards
  async getUserRewards(req: AuthenticatedUserRequest, res: Response) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as 'PENDING' | 'CREDITED';

      const rewards = await this.rewardCrud.getUserRewards(
        userId,
        page,
        limit,
        status
      );

      return res.json({
        success: true,
        data: rewards
      });
    } catch (error) {
      console.error('Get User Rewards Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get rewards'
      });
    }
  }
}
