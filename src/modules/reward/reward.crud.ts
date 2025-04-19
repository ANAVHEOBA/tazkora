import mongoose from 'mongoose';
import { Reward, IReward } from './reward.model';
import { WalletCrud } from '../wallet/wallet.crud';

export class RewardCrud {
  private walletCrud: WalletCrud;

  constructor() {
    this.walletCrud = new WalletCrud();
  }

  // Create a new reward
  async createReward(data: {
    userId: string;
    taskId: string;
    amount: number;
    taskTitle: string;
    taskType: string;
  }): Promise<IReward> {
    const reward = await Reward.create({
      userId: new mongoose.Types.ObjectId(data.userId),
      taskId: new mongoose.Types.ObjectId(data.taskId),
      amount: data.amount,
      taskTitle: data.taskTitle,
      taskType: data.taskType
    });
    return reward;
  }

  // Get featured rewards (latest credited rewards)
  async getFeaturedRewards(limit: number = 4): Promise<IReward[]> {
    return Reward.find({ status: 'CREDITED' })
      .sort({ creditedAt: -1 })
      .limit(limit);
  }

  // Get user's rewards with pagination
  async getUserRewards(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: 'PENDING' | 'CREDITED'
  ): Promise<{
    rewards: IReward[];
    total: number;
    pages: number;
  }> {
    const query = { 
      userId: new mongoose.Types.ObjectId(userId),
      ...(status && { status })
    };

    const [rewards, total] = await Promise.all([
      Reward.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Reward.countDocuments(query)
    ]);

    return {
      rewards,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  // Credit a reward and update wallet
  async creditReward(rewardId: string): Promise<IReward> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const reward = await Reward.findById(rewardId).session(session);
      if (!reward) {
        throw new Error('Reward not found');
      }

      if (reward.status === 'CREDITED') {
        throw new Error('Reward already credited');
      }

      // Update reward status
      reward.status = 'CREDITED';
      reward.creditedAt = new Date();
      await reward.save({ session });

      // Add amount to user's wallet
      await this.walletCrud.addAmount(reward.userId.toString(), reward.amount);

      await session.commitTransaction();
      return reward;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get reward by ID
  async getRewardById(rewardId: string): Promise<IReward | null> {
    return Reward.findById(rewardId);
  }
}
