curl -X GET "https://tazkora-3.onrender.com/api/wallet/payouts/recent" \
-H "Authorization: Bearer YOUR_TOKEN"



{
  "success": true,
  "data": [
    {
      "_id": "65d95560e190ac1ca7dc5817",
      "userId": "67d95560e190ac1ca7dc5817",
      "type": "withdrawal",
      "amount": 5000,
      "currency": "NGN",
      "status": "completed",
      "reference": "TRX_1644829200000_abc123xyz",
      "metadata": {
        "bankCode": "057",
        "accountNumber": "0123456789",
        "accountName": "John Doe",
        "bankName": "Zenith Bank"
      },
      "createdAt": "2024-02-14T12:00:00Z",
      "updatedAt": "2024-02-14T12:05:00Z"
    },
    {
      "_id": "65d95560e190ac1ca7dc5818",
      "userId": "67d95560e190ac1ca7dc5817",
      "type": "withdrawal",
      "amount": 10000,
      "currency": "NGN",
      "status": "completed",
      "reference": "TRX_1644742800000_def456uvw",
      "metadata": {
        "bankCode": "044",
        "accountNumber": "9876543210",
        "accountName": "John Doe",
        "bankName": "Access Bank"
      },
      "createdAt": "2024-02-13T15:30:00Z",
      "updatedAt": "2024-02-13T15:35:00Z"
    }
    
  ]
}

curl -X GET "https://tazkora-3.onrender.com/api/wallet/withdrawals?page=1&limit=10" \
-H "Authorization: Bearer YOUR_TOKEN"


{
  "success": true,
  "data": {
    "withdrawals": [
      {
        "_id": "65d95560e190ac1ca7dc5817",
        "userId": "67d95560e190ac1ca7dc5817",
        "type": "withdrawal",
        "amount": 5000,
        "currency": "NGN",
        "status": "completed",
        "reference": "TRX_1644829200000_abc123xyz",
        "metadata": {
          "bankCode": "057",
          "accountNumber": "0123456789",
          "accountName": "John Doe",
          "bankName": "Zenith Bank"
        },
        "createdAt": "2024-02-14T12:00:00Z",
        "updatedAt": "2024-02-14T12:05:00Z"
      },
      {
        "_id": "65d95560e190ac1ca7dc5818",
        "userId": "67d95560e190ac1ca7dc5817",
        "type": "withdrawal",
        "amount": 10000,
        "currency": "NGN",
        "status": "pending",
        "reference": "TRX_1644742800000_def456uvw",
        "metadata": {
          "bankCode": "044",
          "accountNumber": "9876543210",
          "accountName": "John Doe",
          "bankName": "Access Bank"
        },
        "createdAt": "2024-02-13T15:30:00Z",
        "updatedAt": "2024-02-13T15:30:00Z"
      }
      
    ],
    "total": 20,    // Total number of withdrawals
    "pages": 2      // Total number of pages
  }
}


curl -X GET "https://tazkora-3.onrender.com/api/wallet/withdrawals/stats" \
-H "Authorization: Bearer YOUR_TOKEN"





{
  "success": true,
  "data": {
    "totalWithdrawn": 50000,        // Total amount successfully withdrawn
    "pendingWithdrawals": 2,        // Number of pending withdrawals
    "lastWithdrawal": {             // Details of last successful withdrawal
      "_id": "65d95560e190ac1ca7dc5817",
      "userId": "67d95560e190ac1ca7dc5817",
      "type": "withdrawal",
      "amount": 5000,
      "currency": "NGN",
      "status": "completed",
      "reference": "TRX_1644829200000_abc123xyz",
      "metadata": {
        "bankCode": "057",
        "accountNumber": "0123456789",
        "accountName": "John Doe",
        "bankName": "Zenith Bank"
      },
      "createdAt": "2024-02-14T12:00:00Z",
      "updatedAt": "2024-02-14T12:05:00Z"
    }
  }
}