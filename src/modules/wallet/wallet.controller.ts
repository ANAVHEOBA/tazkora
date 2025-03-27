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
  async verifyTransaction(req: AuthenticatedUserRequest, res: Response): Promise<void> {
    try {
      const { reference } = req.query;
      
      if (!reference) {
        res.send(this.paystackService.generatePaymentCallbackHTML({
          success: false,
          message: 'Invalid transaction reference'
        }));
        return;
      }

      const verification = await this.paystackService.verifyTransaction(reference as string);
      
      if (verification.data.status === 'success') {
        await this.walletCrud.updateTransactionStatus(
          reference as string,
          TransactionStatus.COMPLETED
        );

        res.send(this.paystackService.generatePaymentCallbackHTML({
          success: true,
          message: 'Payment processed successfully!',
          amount: verification.data.amount / 100, // Convert from kobo to naira
          reference: verification.data.reference
        }));
      } else {
        res.send(this.paystackService.generatePaymentCallbackHTML({
          success: false,
          message: 'Payment verification failed',
          reference: verification.data.reference
        }));
      }
    } catch (error) {
      console.error('Verify Transaction Error:', error);
      res.send(this.paystackService.generatePaymentCallbackHTML({
        success: false,
        message: 'Failed to verify transaction'
      }));
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

  // Verify withdrawal
  async verifyWithdrawal(req: AuthenticatedUserRequest, res: Response): Promise<Response> {
    try {
      const { reference } = req.params;
      
      if (!reference) {
        return res.status(400).json({
          success: false,
          message: 'Transfer reference is required'
        });
      }

      // Get the transaction from our database
      const transaction = await this.walletCrud.getTransactionByReference(reference);
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      // Verify with Paystack
      const verification = await this.paystackService.verifyTransfer(reference);
      
      // Update transaction status based on Paystack response
      let newStatus: TransactionStatus;
      switch (verification.data.status.toLowerCase()) {
        case 'success':
          newStatus = TransactionStatus.COMPLETED;
          break;
        case 'failed':
          newStatus = TransactionStatus.FAILED;
          break;
        default:
          newStatus = TransactionStatus.PENDING;
      }

      // Update transaction status if it has changed
      if (transaction.status !== newStatus) {
        await this.walletCrud.updateTransactionStatus(reference, newStatus);
      }

      return res.json({
        success: true,
        data: {
          status: newStatus,
          reference: verification.data.reference,
          amount: verification.data.amount / 100, // Convert from kobo to naira
          recipient: verification.data.recipient
        }
      });
    } catch (error) {
      console.error('Verify Withdrawal Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify withdrawal'
      });
    }
  }
}
