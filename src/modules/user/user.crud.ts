import { User, IUser, Post, IPost } from './user.model';

export class UserCrud {
    async findById(userId: string): Promise<IUser | null> {
        return await User.findById(userId);
    }

    async generateVerificationCode(userId: string): Promise<string> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await User.findByIdAndUpdate(userId, {
            verificationCode: {
                code,
                expiresAt,
            },
        });

        return code;
    }

    async verifyEmail(userId: string, code: string): Promise<boolean> {
        const user = await User.findById(userId);
        
        if (!user || !user.verificationCode) {
            return false;
        }

        if (
            user.verificationCode.code === code &&
            user.verificationCode.expiresAt > new Date()
        ) {
            await User.findByIdAndUpdate(userId, {
                isEmailVerified: true,
                $unset: { verificationCode: 1 },
            });
            return true;
        }

        return false;
    }

    async createPost(userId: string, postData: Partial<IPost>): Promise<IPost> {
        const post = new Post({
            userId,
            ...postData,
            createdAt: new Date(),
            status: 'active'
        });
        return await post.save();
    }

    async getUserPosts(userId: string): Promise<IPost[]> {
        return await Post.find({ userId }).sort({ createdAt: -1 });
    }

    async getPostById(postId: string): Promise<IPost | null> {
        return await Post.findById(postId);
    }

    async updatePost(postId: string, updateData: Partial<IPost>): Promise<IPost | null> {
        return await Post.findByIdAndUpdate(postId, updateData, { new: true });
    }

    async deletePost(postId: string): Promise<boolean> {
        const result = await Post.findByIdAndDelete(postId);
        return !!result;
    }
}