import { Response } from 'express';
import { TaskPoolCrud } from './task.crud';
import { AuthenticatedUserRequest } from '../../middleware/user.middleware';
import { AuthenticatedAdminRequest } from '../../middleware/admin.middleware';

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

  constructor() {
    this.taskPoolCrud = new TaskPoolCrud();
  }

  // Create task pool (both admin and users)
  async createTaskPool(req: AuthenticatedRequestWithFile, res: Response) {
    try {
      const { 
        title, 
        description, 
        totalSpots, 
        rewardPerUser,
        taskLink,
        taskType 
      } = req.body;

      // Get the uploaded image path
      const image = req.file?.path;
      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'Task image is required'
        });
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
        totalSpots,
        rewardPerUser,
        image,
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
      const userId = req.user.id;
      
      // Get the uploaded proof image path
      const proof = req.file?.path;
      if (!proof) {
        return res.status(400).json({
          success: false,
          message: 'Proof image is required'
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

      const result = await this.taskPoolCrud.approveSubmission(taskId, userId);

      return res.json({
        success: true,
        data: result
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
} 