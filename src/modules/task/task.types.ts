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
  image: string;
  taskLink: string;
  taskType: 'TWITTER' | 'DISCORD' | 'TELEGRAM' | 'OTHER';
}

export interface TaskSubmission {
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: Date;
  approvalDate?: Date;
  proof: string;
}

export interface CreateTaskPoolInput {
  title: string;
  description: string;
  totalSpots: number;
  rewardPerUser: number;
  image: string;
  taskLink: string;
  taskType: 'TWITTER' | 'DISCORD' | 'TELEGRAM' | 'OTHER';
} 