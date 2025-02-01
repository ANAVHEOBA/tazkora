import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin {
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);