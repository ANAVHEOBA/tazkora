export interface TaskPool {
  title: string;
  description: string;
  totalSpots: number;
  rewardPerUser: number;
  totalRewardBudget: number;
  status: 'OPEN' | 'CLOSED';
  createdBy: {
    userId: string;
    role: 'admin' | 'user';
  };
  completedCount: number;
  submissions: TaskSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskSubmission {
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: Date;
  approvalDate?: Date;
  proof: string;
} 