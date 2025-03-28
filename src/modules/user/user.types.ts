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
    image: string; // Required image URL/path
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
    image: string; // Required image URL/path
    status: 'active' | 'completed' | 'expired';
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    bio?: string;
    profilePicture?: string;
    dateOfBirth?: string; // ISO date string
    country?: string;
    city?: string;
} 