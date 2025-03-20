# Tazkora Tasks API Documentation

The Tasks API allows users to create, view, and submit tasks. All endpoints require authentication with a JWT token in the Authorization header.

To list all task pools:

curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools" \
-H "Authorization: Bearer your.jwt.token"

Response:
{
    "success": true,
    "data": {
        "tasks": [],
        "pagination": {
            "total": 0,
            "page": 1,
            "limit": 10,
            "pages": 0
        }
    }
}

To create a new task pool:

curl -X POST "https://tazkora-3.onrender.com/api/tasks/pools/create" \
-H "Authorization: Bearer your.jwt.token" \
-H "Content-Type: application/json" \
-d '{
    "title": "Follow Tazkora on Twitter",
    "description": "1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post",
    "totalSpots": 10,
    "rewardPerUser": 50,
    "taskLink": "https://twitter.com/tazkora"
}'

Success response:
{
    "success": true,
    "data": {
        "title": "Follow Tazkora on Twitter",
        "description": "1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post",
        "totalSpots": 10,
        "rewardPerUser": 50,
        "totalRewardBudget": 500,
        "status": "OPEN",
        "completedCount": 0,
        "submissions": [],
        "taskLink": "https://twitter.com/tazkora",
        "taskType": "TWITTER",
        "_id": "task_id",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}

To get a specific task pool:

curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools/task_id" \
-H "Authorization: Bearer your.jwt.token"

To submit proof for a task:

curl -X POST "https://tazkora-3.onrender.com/api/tasks/pools/task_id/submit" \
-H "Authorization: Bearer your.jwt.token" \
-H "Content-Type: application/json" \
-d '{
    "proofBase64": "base64_encoded_image_data"
}'

To filter tasks by status:

curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools?status=OPEN" \
-H "Authorization: Bearer your.jwt.token"

Available status filters: OPEN, CLOSED

For pagination, use page and limit parameters:

curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools?page=1&limit=5" \
-H "Authorization: Bearer your.jwt.token"

Task object structure:
- title: Task title
- description: Task instructions
- totalSpots: Maximum number of participants
- rewardPerUser: Points awarded per completion
- totalRewardBudget: Total points allocated (totalSpots × rewardPerUser)
- status: OPEN or CLOSED
- completedCount: Number of approved submissions
- submissions: Array of user submissions
- taskLink: External link for task completion
- taskType: TWITTER or DISCORD
- image: Task image URL
- createdAt: Creation timestamp
- updatedAt: Last update timestamp

Submission object structure:
- userId: Submitter's information
- status: PENDING or APPROVED
- proof: Proof image URL
- submissionDate: Submission timestamp
- approvalDate: Approval timestamp (if approved)

Error cases:
- Insufficient wallet balance when creating task
- Invalid task ID
- Duplicate submissions
- Missing or invalid proof
- Unauthorized access

All responses include a success boolean and either a data object or error message. Pagination info is included when listing tasks. 