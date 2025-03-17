a@a:~/tazkora$ curl -X POST "https://tazkora-3.onrender.com/api/tasks/admin/pools/create" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk" \
-H "Content-Type: application/json" \
-d '{
  "title": "Join Discord Community",
  "description": "1. Join our Discord server\n2. Say hi in general chat",
  "totalSpots": 20,
  "rewardPerUser": 25,
  "taskLink": "https://discord.gg/tazkora",
}'gLI5AzFfo379UAAAAASUVORK5CYII="lfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3
{"success":true,"data":{"title":"Join Discord Community","description":"1. Join our Discord server\n2. Say hi in general chat","totalSpots":20,"rewardPerUser":25,"totalRewardBudget":500,"status":"OPEN","createdBy":{"userId":"67d760d0e84a9fca78a08289","role":"admin"},"completedCount":0,"submissions":[],"image":"uploads/tasks/63f5d54a-8adb-4077-9fbc-f3221b8cd27a.png","taskLink":"https://discord.gg/tazkora","taskType":"DISCORD","_id":"67d82964564666ad26d3ec63","createdAt":"2025-03-17T13:53:40.178Z","updatedAt":"2025-03-17T13:53:40.178Z","__v":0}}a@a:~/tazkora$ 






a@a:~/tazkora$ curl -X POST "https://tazkora-3.onrender.com/api/tasks/admin/pools/67d82859564666ad26d3ec5a/submissions/67d7e607e190ac1ca7dc570d/approve" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk"
{"success":true,"data":{"createdBy":{"userId":"67d7e607e190ac1ca7dc570d","role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":1,"submissions":[{"userId":"67d7e607e190ac1ca7dc570d","status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:54:45.274Z","__v":0}}a@a:~/tazkora$ 




a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/admin/pools/67d82859564666ad26d3ec5a/submissions" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk"
{"success":true,"data":{"submissions":[{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"task":{"title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"completedCount":1,"status":"OPEN"},"pagination":{"total":1,"page":1,"limit":10,"pages":1}}}a@a:~/tazkora$ 





a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/admin/pools/67d82859564666ad26d3ec5a/submissions?status=PENDING" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk"
{"success":true,"data":{"submissions":[{"userId":null,"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"task":{"title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"completedCount":1,"status":"OPEN"},"pagination":{"total":0,"page":1,"limit":10,"pages":0}}}a@a:~/tazkora$ 




a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/admin/pools/67d82859564666ad26d3ec5a/submissions?status=PENDING&page=1&limit=5" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk"
{"success":true,"data":{"submissions":[{"userId":null,"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"task":{"title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"completedCount":1,"status":"OPEN"},"pagination":{"total":0,"page":1,"limit":5,"pages":0}}}a@a:~/tazkora$ 






a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/admin/pools/all" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk"
{"success":true,"data":{"tasks":[{"createdBy":{"userId":null,"role":"admin"},"_id":"67d82964564666ad26d3ec63","title":"Join Discord Community","description":"1. Join our Discord server\n2. Say hi in general chat","totalSpots":20,"rewardPerUser":25,"totalRewardBudget":500,"status":"OPEN","completedCount":0,"submissions":[],"image":"uploads/tasks/63f5d54a-8adb-4077-9fbc-f3221b8cd27a.png","taskLink":"https://discord.gg/tazkora","taskType":"DISCORD","createdAt":"2025-03-17T13:53:40.178Z","updatedAt":"2025-03-17T13:53:40.178Z","__v":0,"submissionStats":{"total":0,"pending":0,"approved":0,"rejected":0}},{"createdBy":{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":1,"submissions":[{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:54:45.274Z","__v":0,"submissionStats":{"total":1,"pending":0,"approved":1,"rejected":0}}],"pagination":{"total":2,"page":1,"limit":10,"pages":1}}}a@a:~/tazkora$






a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/admin/pools/all?creatorRole=user" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk"
{"success":true,"data":{"tasks":[{"createdBy":{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":1,"submissions":[{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:54:45.274Z","__v":0,"submissionStats":{"total":1,"pending":0,"approved":1,"rejected":0}}],"pagination":{"total":1,"page":1,"limit":10,"pages":1}}}a@a:~/tazkora$ 





a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/admin/pools/all?status=OPEN&page=1&limit=5" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3NjBkMGU4NGE5ZmNhNzhhMDgyODkiLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyMTY5NDI3LCJleHAiOjE3NDIyNTU4Mjd9.TQuh5qvx1-sLwQW8oJrUvNdAhbMIhXUwEWm5uSh8Rwk"
{"success":true,"data":{"tasks":[{"createdBy":{"userId":null,"role":"admin"},"_id":"67d82964564666ad26d3ec63","title":"Join Discord Community","description":"1. Join our Discord server\n2. Say hi in general chat","totalSpots":20,"rewardPerUser":25,"totalRewardBudget":500,"status":"OPEN","completedCount":0,"submissions":[],"image":"uploads/tasks/63f5d54a-8adb-4077-9fbc-f3221b8cd27a.png","taskLink":"https://discord.gg/tazkora","taskType":"DISCORD","createdAt":"2025-03-17T13:53:40.178Z","updatedAt":"2025-03-17T13:53:40.178Z","__v":0,"submissionStats":{"total":0,"pending":0,"approved":0,"rejected":0}},{"createdBy":{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":1,"submissions":[{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:54:45.274Z","__v":0,"submissionStats":{"total":1,"pending":0,"approved":1,"rejected":0}}],"pagination":{"total":2,"page":1,"limit":5,"pages":1}}}a@a:~/tazkora$ 