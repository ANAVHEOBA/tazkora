import mongoose from 'mongoose';

export interface CreateTaskInput {
    title: string;
    description: string;
    taskType: 'Online' | 'Offline';
    taskCategory: 'Social Media' | 'Content Creation' | 'Review' | 'Other';
    deadline: string; // ISO date string
    verificationMethod: string;
    targetLink?: string;
    budget: number;
    bio?: string;
}

export interface UserTask {
    _id: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    title: string;
    description: string;
    taskType: 'Online' | 'Offline';
    taskCategory: 'Social Media' | 'Content Creation' | 'Review' | 'Other';
    deadline: Date;
    verificationMethod: string;
    targetLink?: string;
    budget: number;
    bio?: string;
    status: 'active' | 'completed' | 'expired';
    createdAt: Date;
    updatedAt: Date;
} 