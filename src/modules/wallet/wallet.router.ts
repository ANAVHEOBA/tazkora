import express from 'express';
import { WalletController } from './wallet.controller';
import { userMiddleware } from '../../middleware/user.middleware';

const router = express.Router();
const walletController = new WalletController();

// Get wallet balance
router.get(
  '/balance',
  userMiddleware,
  walletController.getBalance.bind(walletController)
);

// Deposit routes
router.post(
  '/deposit',
  userMiddleware,
  walletController.initiateDeposit.bind(walletController)
);

router.get(
  '/verify',
  userMiddleware,
  walletController.verifyTransaction.bind(walletController)
);

// Withdrawal routes
router.post(
  '/withdraw',
  userMiddleware,
  walletController.initiateWithdrawal.bind(walletController)
);

// New payout/withdrawal routes
router.get(
  '/payouts/recent',
  userMiddleware,
  walletController.getRecentPayouts.bind(walletController)
);

router.get(
  '/withdrawals',
  userMiddleware,
  walletController.getWithdrawalHistory.bind(walletController)
);

router.get(
  '/withdrawals/stats',
  userMiddleware,
  walletController.getWithdrawalStats.bind(walletController)
);

router.get(
  '/banks',
  userMiddleware,
  walletController.getBanks.bind(walletController)
);

// Transaction history
router.get(
  '/transactions',
  userMiddleware,
  walletController.getTransactions.bind(walletController)
);

// Add new withdrawal verification route
router.get(
  '/withdraw/verify/:reference',
  userMiddleware,
  walletController.verifyWithdrawal.bind(walletController)
);

export default router;
