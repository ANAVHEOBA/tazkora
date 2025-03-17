import { TaskPool } from './task.model';
import { WalletCrud } from '../wallet/wallet.crud';
import { CreateTaskPoolInput } from './task.types';

export class TaskPoolCrud {
  private walletCrud: WalletCrud;

  constructor() {
    this.walletCrud = new WalletCrud();
  }

  async createTaskPool(data: CreateTaskPoolInput & {
    createdBy: {
      userId: string;
      role: 'admin' | 'user';
    };
  }) {
    const totalRewardBudget = data.totalSpots * data.rewardPerUser;

    // If user is not admin, check wallet balance
    if (data.createdBy.role === 'user') {
      const hasBalance = await this.walletCrud.hasSufficientBalance(
        data.createdBy.userId,
        totalRewardBudget
      );
      if (!hasBalance) {
        throw new Error('Insufficient wallet balance');
      }
      // Deduct amount from wallet
      await this.walletCrud.deductAmount(data.createdBy.userId, totalRewardBudget);
    }

    return TaskPool.create({
      ...data,
      totalRewardBudget,
      status: 'OPEN',
      completedCount: 0,
      submissions: []
    });
  }

  async submitTask(taskId: string, userId: string, proof: string) {
    const task = await TaskPool.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.status === 'CLOSED') throw new Error('Task is closed');
    
    // Check if user already submitted
    const existingSubmission = task.submissions.find(
      s => s.userId.toString() === userId
    );
    if (existingSubmission) throw new Error('Already submitted');

    return TaskPool.findByIdAndUpdate(
      taskId,
      {
        $push: { submissions: { userId, proof } }
      },
      { new: true }
    );
  }

  async approveSubmission(taskId: string, userId: string) {
    const task = await TaskPool.findById(taskId);
    if (!task) throw new Error('Task not found');

    const submission = task.submissions.find(
      s => s.userId.toString() === userId && s.status === 'PENDING'
    );
    if (!submission) throw new Error('Submission not found');

    // Update submission status and reward user
    await this.walletCrud.addAmount(userId, task.rewardPerUser);
    
    const result = await TaskPool.findOneAndUpdate(
      { 
        _id: taskId,
        'submissions.userId': userId 
      },
      { 
        $set: { 
          'submissions.$.status': 'APPROVED',
          'submissions.$.approvalDate': new Date()
        },
        $inc: { completedCount: 1 }
      },
      { new: true }
    );

    // Close task if all spots filled
    if (result?.completedCount === result?.totalSpots) {
      await TaskPool.findByIdAndUpdate(taskId, { status: 'CLOSED' });
    }

    return result;
  }

  async getAllTaskPools(page: number, limit: number, status?: 'OPEN' | 'CLOSED') {
    const query = status ? { status } : {};
    
    const [tasks, total] = await Promise.all([
      TaskPool.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('submissions.userId', 'email'),
      TaskPool.countDocuments(query)
    ]);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getTaskPoolById(taskId: string) {
    return TaskPool.findById(taskId)
      .populate('submissions.userId', 'email');
  }

  // Add other necessary methods...
} 