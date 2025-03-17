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
  image: { type: String, required: true },
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

export const TaskPool = mongoose.model<ITaskPool & Document>('TaskPool', taskPoolSchema); 