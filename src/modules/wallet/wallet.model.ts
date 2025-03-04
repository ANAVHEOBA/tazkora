import mongoose, { Document, Schema } from 'mongoose';
import { TransactionType, TransactionStatus, Currency } from './wallet.types';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  reference: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: Currency;
  isActive: boolean;
  lastTransactionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: Object.values(TransactionType), 
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { 
    type: String, 
    enum: Object.values(Currency), 
    default: Currency.NGN 
  },
  status: { 
    type: String, 
    enum: Object.values(TransactionStatus), 
    default: TransactionStatus.PENDING 
  },
  reference: { type: String, required: true, unique: true },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

const walletSchema = new Schema<IWallet>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  balance: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  currency: { 
    type: String, 
    enum: Object.values(Currency), 
    default: Currency.NGN 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastTransactionDate: Date,
}, { timestamps: true });

// Indexes
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 }, { unique: true });
walletSchema.index({ userId: 1 }, { unique: true });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);
