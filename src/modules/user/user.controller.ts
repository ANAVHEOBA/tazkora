import { Request, Response } from 'express';
import { UserCrud } from './user.crud';
import { NotificationCrud } from '../notifications/notification.crud';
import { sendVerificationEmail } from '../../services/email.service';
import { generateToken } from '../../middleware/auth.middleware';

export class UserController {
    private userCrud: UserCrud;
    private notificationCrud: NotificationCrud;

    constructor() {
        this.userCrud = new UserCrud();
        this.notificationCrud = new NotificationCrud();
    }

    async sendVerificationCode(req: Request, res: Response): Promise<void> {
        try {
            const { email, firstName } = req.body;

            if (!email) {
                res.status(400).json({ message: 'Email is required' });
                return;
            }

            // Find or create user
            let user = await this.userCrud.findByEmail(email);
            if (!user) {
                // Only create a temporary user with email
                user = await this.userCrud.createUser({ 
                    email,
                    isEmailVerified: false
                });
            }

            const code = await this.userCrud.generateVerificationCode(email);
            await sendVerificationEmail(
                email, 
                code, 
                firstName || 'User'
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

    async register(req: Request, res: Response): Promise<void> {
        try {
            const {
                firstName,
                lastName,
                middleName,
                email,
                username,
                password,
                confirmPassword,
                dateOfBirth,
                gender
            } = req.body;

            // Validate required fields
            if (!firstName || !lastName || !email || !username || !password || !dateOfBirth || !gender) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            // Validate password match
            if (password !== confirmPassword) {
                res.status(400).json({ message: 'Passwords do not match' });
                return;
            }

            // Check if user already exists
            const existingUser = await this.userCrud.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            // Create user and store the result
            await this.userCrud.createUser({
                firstName,
                lastName,
                middleName,
                email,
                username,
                password,
                dateOfBirth: new Date(dateOfBirth),
                gender
            });

            // Generate verification code and send email
            const code = await this.userCrud.generateVerificationCode(email);
            await sendVerificationEmail(email, code, firstName);

            res.status(201).json({
                message: 'Registration successful. Please verify your email.',
                email
            });
        } catch (error) {
            console.error('Error in register:', error);
            res.status(500).json({ message: 'Registration failed' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ message: 'Username and password are required' });
                return;
            }

            const user = await this.userCrud.login({ username, password });

            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            if (!user.isEmailVerified) {
                res.status(403).json({ message: 'Please verify your email first' });
                return;
            }

            // Generate JWT token - Convert ObjectId to string
            const token = generateToken({
                userId: user._id.toString(), // Convert ObjectId to string
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: 'user'
            });

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id.toString(), // Convert ObjectId to string
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    username: user.username
                }
            });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ message: 'Login failed' });
        }
    }
}