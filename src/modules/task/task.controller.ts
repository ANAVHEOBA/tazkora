import { Response } from 'express';
import { TaskPoolCrud } from './task.crud';
import { AuthenticatedUserRequest } from '../../middleware/user.middleware';
import { AuthenticatedAdminRequest } from '../../middleware/admin.middleware';
import { saveBase64Image } from '../../utils/upload.utils';
import { RewardCrud } from '../reward/reward.crud';

// Extend the request types to include the file property
interface AuthenticatedUserRequestWithFile extends AuthenticatedUserRequest {
  file?: Express.Multer.File;
}

interface AuthenticatedAdminRequestWithFile extends AuthenticatedAdminRequest {
  file?: Express.Multer.File;
}

type AuthenticatedRequestWithFile = AuthenticatedUserRequestWithFile | AuthenticatedAdminRequestWithFile;

export class TaskController {
  private taskPoolCrud: TaskPoolCrud;
  private rewardCrud: RewardCrud;

  constructor() {
    this.taskPoolCrud = new TaskPoolCrud();
    this.rewardCrud = new RewardCrud();
  }

  // Create task pool (both admin and users)
  async createTaskPool(req: AuthenticatedRequestWithFile, res: Response) {
    try {
      const { 
        title, 
        description,
        bio,
        taskCategory,
        deadline,
        verificationMethod,
        totalSpots, 
        rewardPerUser,
        taskLink,
        taskType,
        imageBase64
      } = req.body;

      // Validate required fields
      if (!bio || !taskCategory || !deadline || !verificationMethod) {
        return res.status(400).json({
          success: false,
          message: 'Bio, task category, deadline, and verification method are required'
        });
      }

      // Validate deadline is in the future
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Deadline must be in the future'
        });
      }

      // Handle optional image
      let image: string | undefined;
      
      if (req.file) {
        // If file was uploaded using multer
        image = req.file.path;
      } else if (imageBase64) {
        // If image was sent as base64
        try {
          image = saveBase64Image(imageBase64);
        } catch (error) {
          console.warn('Failed to save image:', error);
          // Continue without image instead of returning error
        }
      }

      if (!taskLink || !taskType) {
        return res.status(400).json({
          success: false,
          message: 'Task link and task type are required'
        });
      }

      let userId: string;
      let role: 'admin' | 'user';

      if ('admin' in req && req.admin) {
        userId = req.admin.id;
        role = 'admin';
      } else if ('user' in req && req.user) {
        userId = req.user.id;
        role = 'user';
      } else {
        throw new Error('Invalid request authentication');
      }

      const taskPool = await this.taskPoolCrud.createTaskPool({
        title,
        description,
        bio,
        taskCategory,
        deadline: deadlineDate,
        verificationMethod,
        totalSpots,
        rewardPerUser,
        image,  // Now optional
        taskLink,
        taskType,
        createdBy: {
          userId,
          role
        }
      });

      return res.json({
        success: true,
        data: taskPool
      });
    } catch (error) {
      console.error('Create Task Pool Error:', error);
      return res.status(error.message === 'Insufficient wallet balance' ? 400 : 500).json({
        success: false,
        message: error.message || 'Failed to create task pool'
      });
    }
  }

  // Submit task (users only)
  async submitTask(req: AuthenticatedUserRequestWithFile, res: Response) {
    try {
      const { taskId } = req.params;
      const { proofBase64 } = req.body;
      const userId = req.user.id;
      
      // Get the proof image path either from file upload or base64
      let proof: string | undefined;
      
      if (req.file) {
        proof = req.file.path;
      } else if (proofBase64) {
        try {
          proof = saveBase64Image(proofBase64);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid proof image data'
          });
        }
      }

      if (!proof) {
        return res.status(400).json({
          success: false,
          message: 'Proof image is required (either as file upload or base64)'
        });
      }

      const submission = await this.taskPoolCrud.submitTask(taskId, userId, proof);

      return res.json({
        success: true,
        data: submission
      });
    } catch (error) {
      console.error('Submit Task Error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit task'
      });
    }
  }

  // Approve submission (admin only)
  async approveSubmission(req: AuthenticatedAdminRequest, res: Response) {
    try {
      const { taskId, userId } = req.params;

      // Get task details first
      const task = await this.taskPoolCrud.getTaskPoolById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Approve the submission
      const result = await this.taskPoolCrud.approveSubmission(taskId, userId);

      // Create and credit reward
      const reward = await this.rewardCrud.createReward({
        userId,
        taskId,
        amount: task.rewardPerUser,
        taskTitle: task.title,
        taskType: task.taskType
      });

      // Ensure reward is not null before proceeding
      if (!reward || !reward._id) {
        throw new Error('Failed to create reward');
      }

      // Credit the reward immediately
      const creditedReward = await this.rewardCrud.creditReward(reward._id.toString());

      return res.json({
        success: true,
        data: {
          task: result,
          reward: creditedReward
        }
      });
    } catch (error) {
      console.error('Approve Submission Error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to approve submission'
      });
    }
  }

  // Get all task pools
  async getAllTaskPools(req: AuthenticatedUserRequest | AuthenticatedAdminRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as 'OPEN' | 'CLOSED';

      const tasks = await this.taskPoolCrud.getAllTaskPools(page, limit, status);

      return res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get Task Pools Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch task pools'
      });
    }
  }

  // Get task pool details
  async getTaskPoolDetails(req: AuthenticatedUserRequest | AuthenticatedAdminRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const task = await this.taskPoolCrud.getTaskPoolById(taskId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task pool not found'
        });
      }

      return res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Get Task Pool Details Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch task pool details'
      });
    }
  }

  // Get all submissions for a task (admin only)
  async getTaskSubmissions(req: AuthenticatedAdminRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const status = req.query.status as 'PENDING' | 'APPROVED' | 'REJECTED';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const submissions = await this.taskPoolCrud.getTaskSubmissions(
        taskId,
        status,
        page,
        limit
      );

      return res.json({
        success: true,
        data: submissions
      });
    } catch (error) {
      console.error('Get Task Submissions Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch task submissions'
      });
    }
  }

  // Get all tasks with creator details (admin only)
  async getAllTasksForAdmin(req: AuthenticatedAdminRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as 'OPEN' | 'CLOSED';
      const creatorRole = req.query.creatorRole as 'admin' | 'user';

      const tasks = await this.taskPoolCrud.getAllTasksForAdmin(
        page,
        limit,
        status,
        creatorRole
      );

      return res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get All Tasks Admin Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch tasks'
      });
    }
  }
} 

