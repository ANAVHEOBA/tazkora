import mongoose, { Schema, Document } from 'mongoose';
import { TaskPool as ITaskPool } from './task.types';

const taskSubmissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  submissionDate: { type: Date, default: Date.now },
  approvalDate: Date,
  proof: { type: String, required: true }
});

const taskPoolSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bio: { type: String, required: true },
  taskCategory: { 
    type: String, 
    enum: ['SOCIAL_MEDIA', 'OTHER'], 
    required: true 
  },
  deadline: { type: Date, required: true },
  verificationMethod: { type: String, required: true },
  totalSpots: { type: Number, required: true },
  rewardPerUser: { type: Number, required: true },
  totalRewardBudget: { type: Number, required: true },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  createdBy: {
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true }
  },
  completedCount: { type: Number, default: 0 },
  submissions: [taskSubmissionSchema],
  image: { type: String, required: false },
  taskLink: { type: String, required: true },
  taskType: { 
    type: String, 
    enum: ['TWITTER', 'DISCORD', 'TELEGRAM', 'OTHER'],
    required: true 
  }
}, { timestamps: true });

// Add index for efficient queries
taskPoolSchema.index({ status: 1, completedCount: 1 });
taskPoolSchema.index({ 'submissions.userId': 1 });
taskPoolSchema.index({ taskType: 1 });

// Add indexes for new fields
taskPoolSchema.index({ taskCategory: 1 });
taskPoolSchema.index({ deadline: 1 });
taskPoolSchema.index({ status: 1, deadline: 1 });

export const TaskPool = mongoose.model<ITaskPool & Document>('TaskPool', taskPoolSchema); 