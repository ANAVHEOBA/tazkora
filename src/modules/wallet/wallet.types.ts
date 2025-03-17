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

export interface TransferVerificationResponse {
  status: string;
  reference: string;
  amount: number;
  recipient: {
    name: string;
    account_number: string;
    bank_code: string;
  };
}
