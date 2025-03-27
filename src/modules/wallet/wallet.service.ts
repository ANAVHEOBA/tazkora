import axios from 'axios';
import { env } from '../../config/env';
import { InitiateDepositInput, InitiateWithdrawalInput, TransferVerificationResponse } from './wallet.types';

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

  async verifyTransfer(reference: string) {
    return this.request<TransferVerificationResponse>('GET', `/transfer/verify/${reference}`);
  }

  generatePaymentCallbackHTML(data: { 
    success: boolean; 
    message: string; 
    amount?: number;
    reference?: string;
  }): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tazkora - Payment Status</title>
            <meta name="theme-color" content="${env.HTML_TEMPLATE.THEME_COLOR}">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    background: ${env.HTML_TEMPLATE.PRIMARY_COLOR};
                    color: ${env.HTML_TEMPLATE.TEXT_COLOR};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .container {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    backdrop-filter: blur(10px);
                }
                .status-icon {
                    font-size: 48px;
                    margin: 1rem 0;
                }
                .title {
                    font-size: 1.5rem;
                    color: ${env.HTML_TEMPLATE.TEXT_COLOR};
                    margin: 1rem 0;
                    font-weight: 600;
                }
                .amount {
                    font-size: 2rem;
                    color: ${env.HTML_TEMPLATE.SECONDARY_COLOR};
                    margin: 1rem 0;
                    font-weight: bold;
                }
                .message {
                    color: rgba(255, 255, 255, 0.8);
                    margin: 1rem 0;
                    line-height: 1.5;
                }
                .reference {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.9rem;
                }
                .loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid ${env.HTML_TEMPLATE.SECONDARY_COLOR};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .status-container {
                    background: ${data.success ? env.HTML_TEMPLATE.PAYMENT.SUCCESS_COLOR : env.HTML_TEMPLATE.PAYMENT.ERROR_COLOR};
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status-container">
                    <div class="status-icon">${data.success ? '✅' : '❌'}</div>
                    <h1 class="title">${data.success ? 'Payment Successful' : 'Payment Failed'}</h1>
                    ${data.amount ? `<div class="amount">${env.HTML_TEMPLATE.PAYMENT.CURRENCY} ${data.amount.toLocaleString()}</div>` : ''}
                    <p class="message">${data.message}</p>
                    ${data.reference ? `<div class="reference">Reference: ${data.reference}</div>` : ''}
                </div>
                <div class="loading"></div>
                <p class="message">Redirecting back to wallet...</p>
            </div>
            <script>
                const data = ${JSON.stringify(data)};
                window.opener.postMessage({
                    type: '${data.success ? 'PAYMENT_SUCCESS' : 'PAYMENT_ERROR'}',
                    data: data
                }, '${env.FRONTEND_URL}');
                setTimeout(() => {
                    window.close();
                }, 3000);
            </script>
        </body>
        </html>
    `;
  }
}
