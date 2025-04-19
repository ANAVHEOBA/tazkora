import mongoose from 'mongoose';
import { Wallet, Transaction, IWallet, ITransaction } from './wallet.model';
import { TransactionType, TransactionStatus, CreateTransactionInput } from './wallet.types';

export class WalletCrud {
  // Create a new wallet for a user
  async createWallet(userId: string): Promise<IWallet> {
    const wallet = await Wallet.create({
      userId: new mongoose.Types.ObjectId(userId)
    });
    return wallet;
  }

  // Get wallet by user ID
  async getWallet(userId: string): Promise<IWallet | null> {
    return Wallet.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  }

  // Create a new transaction
  async createTransaction(
    userId: string,
    input: CreateTransactionInput
  ): Promise<ITransaction> {
    const transaction = await Transaction.create({
      userId: new mongoose.Types.ObjectId(userId),
      type: input.type,
      amount: input.amount,
      reference: input.reference || this.generateReference(),
      metadata: input.metadata,
      status: TransactionStatus.PENDING
    });

    // Update wallet's lastTransactionDate
    await Wallet.updateOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      { lastTransactionDate: new Date() }
    );

    return transaction;
  }

  // Update transaction status and wallet balance
  async updateTransactionStatus(
    reference: string,
    status: TransactionStatus
  ): Promise<ITransaction | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findOne({ reference });
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Update transaction status
      transaction.status = status;
      await transaction.save({ session });

      if (status === TransactionStatus.COMPLETED) {
        // Update wallet balance based on transaction type
        const modifier = transaction.type === TransactionType.WITHDRAWAL ? -1 : 1;
        await Wallet.findOneAndUpdate(
          { userId: transaction.userId },
          { 
            $inc: { balance: modifier * transaction.amount },
            lastTransactionDate: new Date()
          },
          { session }
        );
      }

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get transaction history for a user
  async getTransactionHistory(
    userId: string,
    limit: number = 10,
    page: number = 1
  ): Promise<{
    transactions: ITransaction[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ userId: new mongoose.Types.ObjectId(userId) })
    ]);

    return {
      transactions,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  // Get transaction by reference
  async getTransactionByReference(reference: string): Promise<ITransaction | null> {
    return Transaction.findOne({ reference });
  }

  // Check if wallet has sufficient balance
  async hasSufficientBalance(userId: string, amount: number): Promise<boolean> {
    const wallet = await this.getWallet(userId);
    return wallet ? wallet.balance >= amount : false;
  }

  // Generate unique reference
  private generateReference(): string {
    return `TRX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add amount to wallet
  async addAmount(userId: string, amount: number): Promise<IWallet | null> {
    return Wallet.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $inc: { balance: amount } },
      { new: true }
    );
  }

  // Deduct amount from wallet
  async deductAmount(userId: string, amount: number): Promise<IWallet | null> {
    const wallet = await this.getWallet(userId);
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    return Wallet.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $inc: { balance: -amount } },
      { new: true }
    );
  }

  // Get recent payouts (withdrawals)
  async getRecentPayouts(
    userId: string,
    limit: number = 4
  ): Promise<ITransaction[]> {
    return Transaction.find({
      userId: new mongoose.Types.ObjectId(userId),
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.COMPLETED
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  // Get withdrawal history with pagination
  async getWithdrawalHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: TransactionStatus
  ): Promise<{
    withdrawals: ITransaction[];
    total: number;
    pages: number;
  }> {
    const query = {
      userId: new mongoose.Types.ObjectId(userId),
      type: TransactionType.WITHDRAWAL,
      ...(status && { status })
    };

    const [withdrawals, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transaction.countDocuments(query)
    ]);

    return {
      withdrawals,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  // Get withdrawal statistics
  async getWithdrawalStats(userId: string): Promise<{
    totalWithdrawn: number;
    pendingWithdrawals: number;
    lastWithdrawal?: ITransaction;
  }> {
    const [completedWithdrawals, pendingWithdrawals, lastWithdrawal] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.COMPLETED
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      Transaction.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING
      }),
      Transaction.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.COMPLETED
      }).sort({ createdAt: -1 })
    ]);

    return {
      totalWithdrawn: completedWithdrawals[0]?.total || 0,
      pendingWithdrawals,
      lastWithdrawal: lastWithdrawal || undefined
    };
  }
}
