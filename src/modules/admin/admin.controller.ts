import { Request, Response } from 'express';
import { AdminCrud } from './admin.crud';
import { AdminLoginSchema } from './admin.schema';
import { generateToken } from '../../middleware/auth.utils';
import { AuthenticatedAdminRequest } from '../../middleware/admin.middleware';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

interface UserLeanDoc {
    _id: mongoose.Types.ObjectId;
    email: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified: boolean;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    twitterConnection?: {
        isConnected: boolean;
        username: string;
    };
    discordConnection?: {
        isConnected: boolean;
        username: string;
    };
    telegramConnection?: {
        isConnected: boolean;
        username: string;
    };
}

export class AdminController {
    private adminCrud: AdminCrud;

    constructor() {
        this.adminCrud = new AdminCrud();
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            // Validate input
            const validatedInput = AdminLoginSchema.parse(req.body);

            // Find admin
            const admin = await this.adminCrud.findByEmail(validatedInput.email);
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Verify password
            const isPasswordValid = await this.adminCrud.verifyPassword(
                validatedInput.password,
                admin.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = generateToken({
                userId: admin._id.toString(),
                email: admin.email,
                name: admin.name,
                role: 'admin'
            });

            return res.status(200).json({
                success: true,
                token,
                admin: {
                    id: admin._id.toString(),
                    email: admin.email,
                    name: admin.name
                }
            });
        } catch (error) {
            console.error('Admin Login Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async logout(_req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
        try {
            return res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Admin Logout Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async setup(req: Request, res: Response): Promise<Response> {
        try {
            // Simple security check - you should use an environment variable for this
            if (req.body.setupKey !== 'your-secure-setup-key') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid setup key'
                });
            }

            await this.adminCrud.createInitialAdmin();
            
            return res.status(200).json({
                success: true,
                message: 'Admin account created successfully'
            });
        } catch (error) {
            console.error('Admin Setup Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create admin account'
            });
        }
    }

    async getAllUsers(req: AuthenticatedAdminRequest, res: Response): Promise<Response> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;

            const query: any = {};
            if (search) {
                query.$or = [
                    { email: { $regex: search, $options: 'i' } },
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } }
                ];
            }

            const users = await User.find(query)
                .select({
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    isEmailVerified: 1,
                    totalPoints: 1,
                    createdAt: 1,
                    lastLoginAt: 1,
                    twitterConnection: { isConnected: 1, username: 1 },
                    discordConnection: { isConnected: 1, username: 1 },
                    telegramConnection: { isConnected: 1, username: 1 }
                })
                .lean<UserLeanDoc[]>()
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await User.countDocuments(query);

            return res.json({
                success: true,
                data: {
                    users: users.map(user => ({
                        id: user._id.toString(),
                        email: user.email,
                        firstName: user.firstName || null,
                        lastName: user.lastName || null,
                        isEmailVerified: user.isEmailVerified || false,
                        totalPoints: user.totalPoints || 0,
                        createdAt: user.createdAt,
                        lastLoginAt: user.lastLoginAt || null,
                        connections: {
                            twitter: user.twitterConnection?.isConnected ? {
                                username: user.twitterConnection.username
                            } : null,
                            discord: user.discordConnection?.isConnected ? {
                                username: user.discordConnection.username
                            } : null,
                            telegram: user.telegramConnection?.isConnected ? {
                                username: user.telegramConnection.username
                            } : null
                        }
                    })),
                    pagination: {
                        total,
                        page,
                        limit,
                        pages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Get All Users Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }
    }
}