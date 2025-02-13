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
            const { email, name } = req.body;

            if (!email) {
                res.status(400).json({ message: 'Email is required' });
                return;
            }

            // Find or create user
            let user = await this.userCrud.findByEmail(email);
            if (!user) {
                user = await this.userCrud.createUser({ email, name });
            }

            const code = await this.userCrud.generateVerificationCode(email);
            await sendVerificationEmail(
                email, 
                code, 
                name || 'User'
            );

            res.status(200).json({ 
                message: 'Verification code sent successfully',
                email
            });
        } catch (error) {
            console.error('Error in sendVerificationCode:', error);
            res.status(500).json({ message: 'Failed to send verification code' });
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                res.status(400).json({ message: 'Email and code are required' });
                return;
            }

            const isVerified = await this.userCrud.verifyEmail(email, code);

            if (isVerified) {
                res.status(200).json({ 
                    message: 'Email verified successfully',
                    email
                });
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