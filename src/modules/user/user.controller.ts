import { Request, Response } from 'express';
import { UserCrud } from './user.crud';
import { NotificationCrud } from '../notifications/notification.crud';
import { sendVerificationEmail } from '../../services/email.service';

export class UserController {
    private userCrud: UserCrud;
    private notificationCrud: NotificationCrud;

    constructor() {
        this.userCrud = new UserCrud();
        this.notificationCrud = new NotificationCrud();
    }

    async sendVerificationCode(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const userId = req.user.id;
            const user = await this.userCrud.findById(userId);
    
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
    
            const code = await this.userCrud.generateVerificationCode(userId);
            await sendVerificationEmail(
                user.email, 
                code, 
                user.name || 'User'  
            );
    
            res.status(200).json({ message: 'Verification code sent successfully' });
        } catch (error) {
            console.error('Error in sendVerificationCode:', error);
            res.status(500).json({ message: 'Failed to send verification code' });
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const userId = req.user.id;
            const { code } = req.body;

            const isVerified = await this.userCrud.verifyEmail(userId, code);

            if (isVerified) {
                res.status(200).json({ message: 'Email verified successfully' });
            } else {
                res.status(400).json({ message: 'Invalid or expired verification code' });
            }
        } catch (error) {
            console.error('Error in verifyEmail:', error);
            res.status(500).json({ message: 'Failed to verify email' });
        }
    }

    async createPost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const postData = req.body;
            const post = await this.userCrud.createPost(req.user.id, postData);
            
            // Create notification for all users except the creator
            await this.notificationCrud.createForAllUsers({
                type: 'NEW_POST',
                title: 'New Task Posted',
                message: `New ${post.taskType} task: ${post.title}`,
                postId: post._id,
                isRead: false,
                excludeUserId: req.user.id
            });

            res.status(201).json({ 
                message: 'Post created successfully',
                post 
            });
        } catch (error) {
            console.error('Error in createPost:', error);
            res.status(500).json({ message: 'Failed to create post' });
        }
    }

    async getUserPosts(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const posts = await this.userCrud.getUserPosts(req.user.id);
            res.status(200).json({ posts });
        } catch (error) {
            console.error('Error in getUserPosts:', error);
            res.status(500).json({ message: 'Failed to fetch posts' });
        }
    }
}