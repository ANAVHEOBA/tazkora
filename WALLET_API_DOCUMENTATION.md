# Tazkora Wallet API Documentation

The Wallet API enables users to manage their balance, make deposits, and process withdrawals. All endpoints require authentication with a JWT token in the Authorization header.

To check wallet balance:

curl -X GET https://tazkora-3.onrender.com/api/wallet/balance \
-H "Authorization: Bearer your.jwt.token"

Response:
{
    "success": true,
    "data": {
        "balance": 1000,
        "currency": "NGN"
    }
}

To initiate a deposit:

curl -X POST https://tazkora-3.onrender.com/api/wallet/deposit \
-H "Authorization: Bearer your.jwt.token" \
-H "Content-Type: application/json" \
-d '{
    "amount": 1000
}'

Response:
{
    "success": true,
    "data": {
        "authorization_url": "https://checkout.paystack.com/reference",
        "reference": "payment_reference"
    }
}

To verify a deposit:

curl -X GET https://tazkora-3.onrender.com/api/wallet/verify?reference=payment_reference \
-H "Authorization: Bearer your.jwt.token"

Response includes detailed payment information including status, customer details, and payment method used.

To view transaction history:

curl -X GET https://tazkora-3.onrender.com/api/wallet/transactions \
-H "Authorization: Bearer your.jwt.token"

Response:
{
    "success": true,
    "data": {
        "transactions": [
            {
                "_id": "transaction_id",
                "userId": "user_id",
                "type": "deposit",
                "amount": 1000,
                "currency": "NGN",
                "status": "completed",
                "reference": "payment_reference",
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            }
        ],
        "total": 1,
        "pages": 1
    }
}

To get list of supported banks:

curl -X GET https://tazkora-3.onrender.com/api/wallet/banks \
-H "Authorization: Bearer your.jwt.token"

Response:
{
    "success": true,
    "data": [
        {
            "id": "bank_id",
            "name": "Bank Name",
            "code": "bank_code",
            "longcode": "bank_longcode",
            "gateway": "gateway_info",
            "active": true,
            "country": "Nigeria",
            "currency": "NGN",
            "type": "nuban"
        }
    ]
}

To initiate a withdrawal:

curl -X POST https://tazkora-3.onrender.com/api/wallet/withdraw \
-H "Authorization: Bearer your.jwt.token" \
-H "Content-Type: application/json" \
-d '{
    "amount": 500,
    "bankCode": "057",
    "accountNumber": "0000000000",
    "accountName": "Account Name"
}'

Response:
{
    "success": true,
    "data": {
        "reference": "withdrawal_reference",
        "status": "pending"
    }
}

To verify withdrawal status:

curl -X GET https://tazkora-3.onrender.com/api/wallet/withdraw/verify/withdrawal_reference \
-H "Authorization: Bearer your.jwt.token"

Response includes withdrawal status and recipient details.

Transaction object structure:
- _id: Transaction identifier
- userId: Owner of transaction
- type: deposit or withdraw
- amount: Transaction amount
- currency: Transaction currency (NGN)
- status: pending, completed, or failed
- reference: Payment/withdrawal reference
- createdAt: Creation timestamp
- updatedAt: Last update timestamp

Important notes:
- All amounts are in Nigerian Naira (NGN)
- Deposits are processed through Paystack
- Minimum withdrawal amount may apply
- Bank details are required for withdrawals
- Transaction history is paginated
- All timestamps are in ISO 8601 format
- Withdrawal processing times may vary
- Keep payment references for verification

Error cases:
- Insufficient balance for withdrawals
- Invalid bank details
- Failed payment verification
- Unauthorized access
- Invalid amount values 