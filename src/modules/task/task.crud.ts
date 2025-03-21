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

  async getTaskSubmissions(
    taskId: string, 
    status?: 'PENDING' | 'APPROVED' | 'REJECTED',
    page: number = 1,
    limit: number = 10
  ) {
    const task = await TaskPool.findById(taskId);
    if (!task) throw new Error('Task not found');

    // Filter submissions based on status if provided
    let submissions = task.submissions;
    if (status) {
      submissions = submissions.filter(s => s.status === status);
    }

    // Calculate pagination
    const total = submissions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubmissions = submissions.slice(startIndex, endIndex);

    // Populate user details for the paginated submissions
    const populatedTask = await TaskPool.findById(taskId)
      .populate({
        path: 'submissions.userId',
        select: 'email name', // Add any other user fields you want to include
        match: { 
          _id: { 
            $in: paginatedSubmissions.map(s => s.userId) 
          } 
        }
      });

    return {
      submissions: populatedTask?.submissions || [],
      task: {
        title: task.title,
        description: task.description,
        totalSpots: task.totalSpots,
        completedCount: task.completedCount,
        status: task.status
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getAllTasksForAdmin(
    page: number,
    limit: number,
    status?: 'OPEN' | 'CLOSED',
    creatorRole?: 'admin' | 'user'
  ) {
    // Build query based on filters
    const query: any = {};
    if (status) query.status = status;
    if (creatorRole) query['createdBy.role'] = creatorRole;

    const [tasks, total] = await Promise.all([
      TaskPool.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate([
          {
            path: 'createdBy.userId',
            select: 'email name role',
            model: 'User'
          },
          {
            path: 'submissions.userId',
            select: 'email name',
            model: 'User'
          }
        ]),
      TaskPool.countDocuments(query)
    ]);

    return {
      tasks: tasks.map(task => ({
        ...task.toObject(),
        submissionStats: {
          total: task.submissions.length,
          pending: task.submissions.filter(s => s.status === 'PENDING').length,
          approved: task.submissions.filter(s => s.status === 'APPROVED').length,
          rejected: task.submissions.filter(s => s.status === 'REJECTED').length
        }
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Add other necessary methods...
} 