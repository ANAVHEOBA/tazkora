import { Request, Response } from 'express';
import { AdminCrud } from './admin.crud';
import { AdminLoginSchema } from './admin.schema';
import { generateToken } from '../../middleware/auth.middleware';

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


    async logout(_req: Request, res: Response): Promise<Response> {
        try {
            // You could add token to a blacklist here if implementing
            // For now, we'll just send a success response
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



    
}