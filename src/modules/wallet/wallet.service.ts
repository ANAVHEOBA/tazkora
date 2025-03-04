import axios from 'axios';
import { env } from '../../config/env';
import { InitiateDepositInput, InitiateWithdrawalInput } from './wallet.types';

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface TransferRecipientResponse {
  recipient_code: string;
  active: boolean;
  name: string;
  email: string;
  type: string;
}

interface InitializeTransactionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface TransactionVerificationResponse {
  id: number;
  status: string;
  reference: string;
  amount: number;
  gateway_response: string;
  paid_at: string;
  channel: string;
  metadata: any;
}

interface BankResponse {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export class PaystackService {
  private baseUrl = 'https://api.paystack.co';
  private secretKey: string;

  constructor() {
    if (!env.PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key not configured');
    }
    this.secretKey = env.PAYSTACK_SECRET_KEY;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<PaystackResponse<T>> {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        data,
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Paystack API Error:', error);
      throw new Error('Payment service error');
    }
  }

  async initiateDeposit(input: InitiateDepositInput) {
    return this.request<InitializeTransactionResponse>('POST', '/transaction/initialize', {
      amount: input.amount * 100, // Convert to kobo
      email: input.email,
      metadata: input.metadata
    });
  }

  async verifyTransaction(reference: string) {
    return this.request<TransactionVerificationResponse>('GET', `/transaction/verify/${reference}`);
  }

  async initiateWithdrawal(input: InitiateWithdrawalInput) {
    return this.request<any>('POST', '/transfer', {
      source: 'balance',
      amount: input.amount * 100, // Convert to kobo
      recipient: await this.createTransferRecipient({
        type: 'nuban',
        name: input.accountName,
        account_number: input.accountNumber,
        bank_code: input.bankCode
      })
    });
  }

  private async createTransferRecipient(data: any) {
    const response = await this.request<TransferRecipientResponse>('POST', '/transferrecipient', data);
    return response.data.recipient_code;
  }

  async getBanks() {
    return this.request<BankResponse[]>('GET', '/bank');
  }
}
