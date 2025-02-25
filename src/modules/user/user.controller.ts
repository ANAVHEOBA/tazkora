import { Request, Response } from 'express';
import { UserCrud } from './user.crud';
import { sendVerificationEmail } from '../../services/email.service';
import { generateToken } from '../../middleware/auth.utils';
import { PartnerCrud } from '../partner/partner.crud';
import mongoose from 'mongoose';
import { AuthenticatedUserRequest } from '../../middleware/user.middleware';
import { CreateTaskInput, UpdateUserInput } from './user.types';

// Define interfaces for type safety
interface CompletedTask {
    partnerId: mongoose.Types.ObjectId;
    completedAt: Date;
    pointsEarned: number;
    status: 'pending' | 'approved' | 'rejected';
}

export class UserController {
    private userCrud: UserCrud;
    private partnerCrud: PartnerCrud;

    constructor() {
        this.userCrud = new UserCrud();
        this.partnerCrud = new PartnerCrud();
    }

    async requestAccess(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            if (!email) {
                res.status(400).json({ message: 'Email is required' });
                return;
            }

            // Create or update user without storing the result
            await this.userCrud.createOrUpdateUser(email);
            
            // Generate and send verification code
            const code = await this.userCrud.generateVerificationCode(email);
            await sendVerificationEmail(email, code);

            res.status(200).json({ 
                message: 'Verification code sent successfully',
                email 
            });
        } catch (error) {
            console.error('Error in requestAccess:', error);
            res.status(500).json({ message: 'Failed to send verification code' });
        }
    }

    async verifyAndLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                res.status(400).json({ message: 'Email and code are required' });
                return;
            }

            const isVerified = await this.userCrud.verifyCode(email, code);

            if (!isVerified) {
                res.status(400).json({ message: 'Invalid or expired verification code' });
                return;
            }

            const user = await this.userCrud.findByEmail(email);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Generate JWT token
            const token = generateToken({
                userId: user._id.toString(),
                email: user.email,
                role: 'user'
            });

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Error in verifyAndLogin:', error);
            res.status(500).json({ message: 'Verification failed' });
        }
    }

    async viewPartners(_req: Request, res: Response): Promise<Response> {
        try {
            const partners = await this.partnerCrud.getAllPartners();
            
            return res.status(200).json({
                success: true,
                partners: partners.map(partner => ({
                    id: partner._id,
                    name: partner.name,
                    logo: partner.logo,
                    description: partner.description,
                    taskType: partner.taskType,
                    pointValue: partner.pointValue,
                    progress: `${partner.currentCount}/${partner.targetCount}`
                }))
            });
        } catch (error) {
            console.error('View Partners Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch partners'
            });
        }
    }

    async viewPartnerDetails(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
        try {
            const { partnerId } = req.params;
            const userId = req.user?._id;

            if (!mongoose.Types.ObjectId.isValid(partnerId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid partner ID'
                });
            }

            const partner = await this.partnerCrud.findById(partnerId);
            if (!partner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found'
                });
            }

            // Get user's completed tasks for this partner if user is logged in
            let userTasks: CompletedTask[] = [];
            if (userId) {
                userTasks = await this.userCrud.getCompletedTasksForPartner(userId, partnerId);
            }

            return res.status(200).json({
                success: true,
                partner: {
                    id: partner._id,
                    name: partner.name,
                    logo: partner.logo,
                    description: partner.description,
                    taskType: partner.taskType,
                    pointValue: partner.pointValue,
                    targetCount: partner.targetCount,
                    currentCount: partner.currentCount,
                    userProgress: userTasks.length > 0 ? {
                        completed: userTasks.length,
                        points: userTasks.reduce((sum: number, task: CompletedTask) => sum + task.pointsEarned, 0)
                    } : null
                }
            });
        } catch (error) {
            console.error('View Partner Details Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch partner details'
            });
        }
    }

    async getMyTasks(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?._id;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const userTasks = await this.userCrud.getAllUserTasks(userId);

            return res.status(200).json({
                success: true,
                tasks: userTasks.map((task: CompletedTask) => ({
                    partnerId: task.partnerId,
                    completedAt: task.completedAt,
                    pointsEarned: task.pointsEarned,
                    status: task.status
                }))
            });
        } catch (error) {
            console.error('Get My Tasks Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user tasks'
            });
        }
    }

    async submitTask(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
        try {
            const { partnerId } = req.params;
            const { screenshot } = req.body;
            const userId = req.user?._id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            if (!screenshot) {
                return res.status(400).json({
                    success: false,
                    message: 'Screenshot is required'
                });
            }

            const partner = await this.partnerCrud.findById(partnerId);
            if (!partner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found'
                });
            }

            // Check if user has already completed this task
            const existingTasks = await this.userCrud.getCompletedTasksForPartner(userId, partnerId);
            if (existingTasks.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Task already submitted for this partner'
                });
            }

            // Add task submission
            await this.userCrud.addCompletedTask(
                userId,
                partnerId,
                partner.pointValue
            );

            return res.status(200).json({
                success: true,
                message: 'Task submitted successfully',
                task: {
                    partnerId,
                    pointsEarned: partner.pointValue,
                    status: 'pending'
                }
            });
        } catch (error) {
            console.error('Submit Task Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to submit task'
            });
        }
    }

    async getTaskStatus(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
        try {
            const { partnerId } = req.params;
            const userId = req.user?._id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const tasks = await this.userCrud.getCompletedTasksForPartner(userId, partnerId);
            
            return res.status(200).json({
                success: true,
                status: tasks.length > 0 ? tasks[0].status : null,
                task: tasks.length > 0 ? {
                    completedAt: tasks[0].completedAt,
                    pointsEarned: tasks[0].pointsEarned,
                    status: tasks[0].status
                } : null
            });
        } catch (error) {
            console.error('Get Task Status Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get task status'
            });
        }
    }

    async createTask(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            const taskInput: CreateTaskInput = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            // Validate task input
            if (!taskInput.title || !taskInput.description || !taskInput.budget) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const task = await this.userCrud.createTask(userId, taskInput);

            return res.status(201).json({
                success: true,
                message: 'Task created successfully',
                task
            });
        } catch (error) {
            console.error('Create Task Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create task'
            });
        }
    }

    async getCreatedTasks(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const tasks = await this.userCrud.getUserCreatedTasks(userId);

            return res.status(200).json({
                success: true,
                tasks
            });
        } catch (error) {
            console.error('Get Created Tasks Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch created tasks'
            });
        }
    }

    async updateUserDetails(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            const updateData: UpdateUserInput = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            // Validate update data
            const allowedFields = [
                'firstName', 'lastName', 'phoneNumber', 'bio',
                'profilePicture', 'dateOfBirth', 'country', 'city'
            ];
            
            const invalidFields = Object.keys(updateData).filter(
                field => !allowedFields.includes(field)
            );

            if (invalidFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid fields: ${invalidFields.join(', ')}`
                });
            }

            const updatedUser = await this.userCrud.updateUserDetails(userId, updateData);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'User details updated successfully',
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    phoneNumber: updatedUser.phoneNumber,
                    bio: updatedUser.bio,
                    profilePicture: updatedUser.profilePicture,
                    dateOfBirth: updatedUser.dateOfBirth,
                    country: updatedUser.country,
                    city: updatedUser.city
                }
            });
        } catch (error) {
            console.error('Update User Details Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update user details'
            });
        }
    }
}