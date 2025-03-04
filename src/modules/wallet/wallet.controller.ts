import { Response } from 'express';
import { WalletCrud } from './wallet.crud';
import { PaystackService } from './wallet.service';
import { AuthenticatedUserRequest } from '../../middleware/user.middleware';
import { TransactionStatus, TransactionType } from './wallet.types';

export class WalletController {
  private walletCrud: WalletCrud;
  private paystackService: PaystackService;

  constructor() {
    this.walletCrud = new WalletCrud();
    this.paystackService = new PaystackService();
  }

  // Get wallet balance
  async getBalance(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const wallet = await this.walletCrud.getWallet(userId);

      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
      }

      return res.json({
        success: true,
        data: {
          balance: wallet.balance,
          currency: wallet.currency
        }
      });
    } catch (error) {
      console.error('Get Balance Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get wallet balance'
      });
    }
  }

  // Initiate deposit
  async initiateDeposit(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { amount } = req.body;
      const email = req.user?.email;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount'
        });
      }

      // Initialize transaction with Paystack
      const paystackResponse = await this.paystackService.initiateDeposit({
        amount,
        email,
        metadata: { userId }
      });

      // Create pending transaction record
      await this.walletCrud.createTransaction(userId, {
        type: TransactionType.DEPOSIT,
        amount,
        reference: paystackResponse.data.reference
      });

      return res.json({
        success: true,
        data: {
          authorization_url: paystackResponse.data.authorization_url,
          reference: paystackResponse.data.reference
        }
      });
    } catch (error) {
      console.error('Initiate Deposit Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to initiate deposit'
      });
    }
  }

  // Verify transaction
  async verifyTransaction(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
    try {
      const { reference } = req.query;
      
      if (!reference) {
        return res.status(400).json({
          success: false,
          message: 'Transaction reference is required'
        });
      }

      const verification = await this.paystackService.verifyTransaction(reference as string);
      
      if (verification.data.status === 'success') {
        await this.walletCrud.updateTransactionStatus(
          reference as string,
          TransactionStatus.COMPLETED
        );
      }

      return res.json({
        success: true,
        data: verification.data
      });
    } catch (error) {
      console.error('Verify Transaction Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify transaction'
      });
    }
  }

  // Get transaction history
  async getTransactions(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const history = await this.walletCrud.getTransactionHistory(userId, limit, page);

      return res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Get Transactions Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get transaction history'
      });
    }
  }

  // Initiate withdrawal
  async initiateWithdrawal(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { amount, bankCode, accountNumber, accountName } = req.body;

      // Validate input
      if (!amount || !bankCode || !accountNumber || !accountName) {
        return res.status(400).json({
          success: false,
          message: 'Missing required withdrawal information'
        });
      }

      // Check sufficient balance
      const hasSufficientBalance = await this.walletCrud.hasSufficientBalance(userId, amount);
      if (!hasSufficientBalance) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Initiate withdrawal with Paystack
      const withdrawal = await this.paystackService.initiateWithdrawal({
        amount,
        bankCode,
        accountNumber,
        accountName
      });

      // Create pending transaction record
      await this.walletCrud.createTransaction(userId, {
        type: TransactionType.WITHDRAWAL,
        amount,
        reference: withdrawal.data.reference,
        metadata: {
          bankCode,
          accountNumber,
          accountName
        }
      });

      return res.json({
        success: true,
        data: {
          reference: withdrawal.data.reference,
          status: 'pending'
        }
      });
    } catch (error) {
      console.error('Initiate Withdrawal Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to initiate withdrawal'
      });
    }
  }

  // Get available banks
  async getBanks(_req: AuthenticatedUserRequest, res: Response): Promise<Response> {
    try {
      const banks = await this.paystackService.getBanks();
      return res.json({
        success: true,
        data: banks.data
      });
    } catch (error) {
      console.error('Get Banks Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch banks'
      });
    }
  }
}
