import { User, IUser } from './user.model';

export class UserCrud {
    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async createOrUpdateUser(email: string): Promise<IUser> {
        const user = await User.findOneAndUpdate(
            { email },
            { email },
            { upsert: true, new: true }
        );
        return user;
    }

    async generateVerificationCode(email: string): Promise<string> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await User.findOneAndUpdate(
            { email },
            {
                verificationCode: {
                    code,
                    expiresAt,
                }
            }
        );

        return code;
    }

    async verifyCode(email: string, code: string): Promise<boolean> {
        const user = await User.findOne({ email });
        
        if (!user || !user.verificationCode) {
            return false;
        }

        if (
            user.verificationCode.code === code &&
            user.verificationCode.expiresAt > new Date()
        ) {
            await User.findOneAndUpdate(
                { email },
                {
                    isEmailVerified: true,
                    lastLoginAt: new Date(),
                    $unset: { verificationCode: 1 }
                }
            );
            return true;
        }

        return false;
    }
}