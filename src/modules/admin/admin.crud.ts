import { Admin } from './admin.model';
import bcrypt from 'bcryptjs';

export class AdminCrud {
    async findByEmail(email: string) {
        return Admin.findOne({ email });
    }

    async verifyPassword(plainPassword: string, hashedPassword: string) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    // Optional: Create initial admin if none exists
    async createInitialAdmin() {
        const adminExists = await Admin.exists({});
        
        if (!adminExists) {
            await Admin.create({
                email: 'admin@tazkora.com',
                password: 'admin123', // Will be hashed by the pre-save hook
                name: 'Admin'
            });
            console.log('Initial admin created successfully');
        } else {
            console.log('Admin already exists');
        }
    }
}