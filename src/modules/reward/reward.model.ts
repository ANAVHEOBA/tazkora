import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  amount: number;
  status: 'PENDING' | 'CREDITED';
  taskTitle: string;
  taskType: string;
  creditedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'TaskPool', required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'CREDITED'],
    default: 'PENDING'
  },
  taskTitle: { type: String, required: true },
  taskType: { type: String, required: true },
  creditedAt: { type: Date },
}, { 
  timestamps: true 
});

// Indexes for efficient queries
rewardSchema.index({ userId: 1, status: 1 });
rewardSchema.index({ status: 1, createdAt: -1 });
rewardSchema.index({ userId: 1, createdAt: -1 });

export const Reward = mongoose.model<IReward>('Reward', rewardSchema);
