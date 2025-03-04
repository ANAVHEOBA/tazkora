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

export default router;
