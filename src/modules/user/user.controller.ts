import { Request, Response } from 'express';
import { UserCrud } from './user.crud';
import { sendVerificationEmail } from '../../services/email.service';

export class UserController {
    private userCrud: UserCrud;

    constructor() {
        this.userCrud = new UserCrud();
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
}