export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  REWARD = 'reward',
  PURCHASE = 'purchase'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD'
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface InitiateDepositInput {
  amount: number;
  email: string;
  metadata?: Record<string, any>;
}

export interface InitiateWithdrawalInput {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}
