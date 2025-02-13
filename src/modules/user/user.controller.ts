import { Request, Response } from 'express';
import { UserCrud } from './user.crud';
import { sendVerificationEmail } from '../../services/email.service';
import { generateToken } from '../../middleware/auth.middleware';

export class UserController {
    private userCrud: UserCrud;

    constructor() {
        this.userCrud = new UserCrud();
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
}