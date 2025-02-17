import { User, IUser } from './user.model';
import mongoose from 'mongoose';
import { CreateTaskInput, UserTask } from './user.types';

interface CompletedTask {
    partnerId: mongoose.Types.ObjectId;
    completedAt: Date;
    pointsEarned: number;
    status: 'pending' | 'approved' | 'rejected';
}

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

    async getCompletedTasksForPartner(
        userId: string | mongoose.Types.ObjectId,
        partnerId: string | mongoose.Types.ObjectId
    ): Promise<CompletedTask[]> {
        const user = await User.findById(userId)
            .select('completedTasks')
            .lean();

        return (user?.completedTasks || []).filter((task: CompletedTask) => 
            task.partnerId.toString() === partnerId.toString()
        );
    }

    async addCompletedTask(
        userId: string | mongoose.Types.ObjectId,
        partnerId: string | mongoose.Types.ObjectId,
        pointsEarned: number
    ): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    completedTasks: {
                        partnerId,
                        completedAt: new Date(),
                        pointsEarned,
                        status: 'pending'
                    }
                },
                $inc: { totalPoints: pointsEarned }
            },
            { new: true }
        );
    }

    async getAllUserTasks(userId: mongoose.Types.ObjectId): Promise<CompletedTask[]> {
        const user = await User.findById(userId)
            .select('completedTasks')
            .lean();

        return user?.completedTasks || [];
    }

    async createTask(userId: string, taskInput: CreateTaskInput): Promise<UserTask> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const taskData: UserTask = {
            ...taskInput,
            deadline: new Date(taskInput.deadline),
            createdBy: new mongoose.Types.ObjectId(userId),
            status: 'active' as const,
            _id: new mongoose.Types.ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        user.createdTasks.push(taskData);
        await user.save();

        return taskData;
    }

    async getUserCreatedTasks(userId: string): Promise<UserTask[]> {
        const user = await User.findById(userId)
            .select('createdTasks')
            .lean();

        return user?.createdTasks || [];
    }
}