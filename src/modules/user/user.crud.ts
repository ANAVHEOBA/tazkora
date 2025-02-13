import { User, IUser, Post, IPost } from './user.model';
import bcrypt from 'bcrypt';

export class UserCrud {
    async findById(userId: string): Promise<IUser | null> {
        return await User.findById(userId);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        // Hash password
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        const user = new User({
            ...userData,
            isEmailVerified: false
        });
        return await user.save();
    }

    async generateVerificationCode(email: string): Promise<string> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await User.findOneAndUpdate(
            { email },
            {
                verificationCode: {
                    code,
                    expiresAt,
                },
            }
        );

        return code;
    }

    async verifyEmail(email: string, code: string): Promise<boolean> {
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
                    $unset: { verificationCode: 1 },
                }
            );
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

    async login(loginData: { username: string; password: string }): Promise<IUser | null> {
        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { email: loginData.username },
                { username: loginData.username }
            ]
        });

        if (!user) return null;

        // Verify password
        const isValidPassword = await bcrypt.compare(loginData.password, user.password);
        if (!isValidPassword) return null;

        return user;
    }
}