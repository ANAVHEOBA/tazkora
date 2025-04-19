# Get featured rewards
GET /api/rewards/featured


{
  "success": true,
  "data": [
    {
      "_id": "reward_id_1",
      "userId": "user_id",
      "taskId": "task_id",
      "amount": 1000,
      "status": "CREDITED",
      "taskTitle": "Follow on Twitter",
      "taskType": "TWITTER",
      "creditedAt": "2024-02-14T12:00:00Z",
      "createdAt": "2024-02-14T11:55:00Z",
      "updatedAt": "2024-02-14T12:00:00Z"
    },
   
  ]
}



# Get all rewards
GET /api/rewards



{
  "success": true,
  "data": {
    "rewards": [
      {
        "_id": "reward_id_1",
        "userId": "user_id",
        "taskId": "task_id",
        "amount": 1000,
        "status": "CREDITED",
        "taskTitle": "Follow on Twitter",
        "taskType": "TWITTER",
        "creditedAt": "2024-02-14T12:00:00Z",
        "createdAt": "2024-02-14T11:55:00Z",
        "updatedAt": "2024-02-14T12:00:00Z"
      }
      
    ],
    "total": 50,  // Total number of rewards
    "pages": 5    // Total number of pages
  }
}













