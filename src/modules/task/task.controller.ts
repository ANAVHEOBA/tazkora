import { Response } from 'express';
import { TaskPoolCrud } from './task.crud';
import { AuthenticatedUserRequest } from '../../middleware/user.middleware';
import { AuthenticatedAdminRequest } from '../../middleware/admin.middleware';
import { saveBase64Image } from '../../utils/upload.utils';

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
        taskType,
        imageBase64
      } = req.body;

      // Get the image path either from file upload or base64
      let image: string | undefined;
      
      if (req.file) {
        // If file was uploaded using multer
        image = req.file.path;
      } else if (imageBase64) {
        // If image was sent as base64
        try {
          image = saveBase64Image(imageBase64);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid image data'
          });
        }
      }

      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'Task image is required (either as file upload or base64)'
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
} 

