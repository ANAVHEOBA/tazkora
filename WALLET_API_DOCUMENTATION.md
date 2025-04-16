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



























a@a:~/tazkora$ curl -X POST https://tazkora-3.onrender.com/api/wallet/deposit -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q5NTU2MGUxOTBhYzFjYTdkYzU4MTciLCJlbWFpbCI6IndlYmRldmxvcGVyMTg2QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ0ODA5MTEyLCJleHAiOjE3NDQ4OTU1MTJ9.GGkRF7kRxTgaRRYzbDKS3c5JpAZdG0Dm1qmQuk_3hFo" -H "Content-Type: application/json" -d '{
    "amount": 1000
}'
{"success":true,"data":{"authorization_url":"https://checkout.paystack.com/qano3lehuc1g38j","reference":"7bg7imstn2"}}a@a:~/tazkora$ 

curl -X GET "https://tazkora-3.onrender.com/api/wallet/verify?reference=7bg7imstn2" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q5NTU2MGUxOTBhYzFjYTdkYzU4MTciLCJlbWFpbCI6IndlYmRldmxvcGVyMTg2QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ0ODA5MTEyLCJleHAiOjE3NDQ4OTU1MTJ9.GGkRF7kRxTgaRRYzbDKS3c5JpAZdG0Dm1qmQuk_3hFo"

        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tazkora - Payment Status</title>
            <meta name="theme-color" content="#0A1929">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    background: #0A1929;
                    color: #FFFFFF;
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
                    color: #FFFFFF;
                    margin: 1rem 0;
                    font-weight: 600;
                }
                .amount {
                    font-size: 2rem;
                    color: #1E88E5;
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
                    border-top: 3px solid #1E88E5;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .status-container {
                    background: rgba(46, 125, 50, 0.1);
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status-container">
                    <div class="status-icon">✅</div>
                    <h1 class="title">Payment Successful</h1>
                    <div class="amount">NGN 1,000</div>
                    <p class="message">Payment processed successfully!</p>
                    <div class="reference">Reference: 7bg7imstn2</div>
                </div>
                <div class="loading"></div>
                <p class="message">Redirecting back to wallet...</p>
            </div>
            <script>
                const data = {"success":true,"message":"Payment processed successfully!","amount":1000,"reference":"7bg7imstn2"};
                window.opener.postMessage({
                    type: 'PAYMENT_SUCCESS',
                    data: data
                }, 'http://localhost:3000');
                setTimeout(() => {
                    window.close();
                }, 3000);
            </script>
        </body>
        </html>
a@a:~/tazkora$ rurl -X GET https://tazkora-3.onrender.com/api/wallet/balance -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q5NTU2MGUxOTBhYzFjYTdkYzU4MTciLCJlbWFpbCI6IndlYmRldmxvcGVyMTg2QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ0ODA5MTEyLCJleHAiOjE3NDQ4OTU1MTJ9.GGkRF7kRxTgaRRYzbDKS3c5JpAZdG0Dm1qmQuk_3hFo"
{"success":true,"data":{"balance":1000,"currency":"NGN"}}a@a:~/tazkora$ 