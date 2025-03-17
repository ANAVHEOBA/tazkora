a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY"
{"success":true,"data":{"tasks":[],"pagination":{"total":0,"page":1,"limit":10,"pages":0}}}a@a:~/tazkora$ 





a@a:~/tazkora$ curl -X POST "https://tazkora-3.onrender.com/api/tasks/pools/create" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY" \
-H "Content-Type: application/json" \
-d '{
  "title": "Follow Tazkora on Twitter",
  "description": "1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post",
  "totalSpots": 100,
  "rewardPerUser": 50,
  "taskLink": "https://twitter.com/tazkora",
}'gLI5AzFfo379UAAAAASUVORK5CYII="lfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3
{"success":false,"message":"Insufficient wallet balance"}a@a:~/tazkora$ 






a@a:~/tazkora$ curl -X POST "https://tazkora-3.onrender.com/api/tasks/pools/create" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY" \
-H "Content-Type: application/json" \
-d '{
  "title": "Follow Tazkora on Twitter",
  "description": "1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post",
  "totalSpots": 10,
  "rewardPerUser": 50,
  "taskLink": "https://twitter.com/tazkora",
}'gLI5AzFfo379UAAAAASUVORK5CYII="lfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3
{"success":true,"data":{"title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","createdBy":{"userId":"67d7e607e190ac1ca7dc570d","role":"user"},"completedCount":0,"submissions":[],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","_id":"67d82859564666ad26d3ec5a","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:49:13.241Z","__v":0}}a@a:~/tazkora$ 











a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY"
{"success":true,"data":{"tasks":[{"createdBy":{"userId":"67d7e607e190ac1ca7dc570d","role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":0,"submissions":[],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:49:13.241Z","__v":0}],"pagination":{"total":1,"page":1,"limit":10,"pages":1}}}a@a:~/tazkora$ 







a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools/67d82859564666ad26d3ec5a" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY"
{"success":true,"data":{"createdBy":{"userId":"67d7e607e190ac1ca7dc570d","role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":0,"submissions":[],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:49:13.241Z","__v":0}}a@a:~/tazkora$ 





a@a:~/tazkora$ curl -X POST "https://tazkora-3.onrender.com/api/tasks/pools/67d82859564666ad26d3ec5a/submit" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY" \
-H "Content-Type: application/json" \
-d '{
  "proofBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3}'gLI5AzFfo379UAAAAASUVORK5CYII="
{"success":true,"data":{"createdBy":{"userId":"67d7e607e190ac1ca7dc570d","role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":0,"submissions":[{"userId":"67d7e607e190ac1ca7dc570d","status":"PENDING","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z"}],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:52:48.190Z","__v":0}}a@a:~/tazkora$ 















a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools?status=OPEN&page=1&limit=10" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY"
{"success":true,"data":{"tasks":[{"createdBy":{"userId":"67d760d0e84a9fca78a08289","role":"admin"},"_id":"67d82964564666ad26d3ec63","title":"Join Discord Community","description":"1. Join our Discord server\n2. Say hi in general chat","totalSpots":20,"rewardPerUser":25,"totalRewardBudget":500,"status":"OPEN","completedCount":0,"submissions":[],"image":"uploads/tasks/63f5d54a-8adb-4077-9fbc-f3221b8cd27a.png","taskLink":"https://discord.gg/tazkora","taskType":"DISCORD","createdAt":"2025-03-17T13:53:40.178Z","updatedAt":"2025-03-17T13:53:40.178Z","__v":0},{"createdBy":{"userId":"67d7e607e190ac1ca7dc570d","role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":1,"submissions":[{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:54:45.274Z","__v":0}],"pagination":{"total":2,"page":1,"limit":10,"pages":1}}}a@a:~/tazkora$ 






a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools?status=CLOSED&page=1&limit=10" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY"
{"success":true,"data":{"tasks":[],"pagination":{"total":0,"page":1,"limit":10,"pages":0}}}a@a:~/tazkora$ 






a@a:~/tazkora$ curl -X GET "https://tazkora-3.onrender.com/api/tasks/pools?page=1&limit=5" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q3ZTYwN2UxOTBhYzFjYTdkYzU3MGQiLCJlbWFpbCI6Implc3NpY2FhbmF2aGVvYmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIyMDI0MjEsImV4cCI6MTc0MjI4ODgyMX0.2qXHiPh1nvbGcd_vleSgRKWaZMhWMgYA7HfdtNrBwwY"
{"success":true,"data":{"tasks":[{"createdBy":{"userId":"67d760d0e84a9fca78a08289","role":"admin"},"_id":"67d82964564666ad26d3ec63","title":"Join Discord Community","description":"1. Join our Discord server\n2. Say hi in general chat","totalSpots":20,"rewardPerUser":25,"totalRewardBudget":500,"status":"OPEN","completedCount":0,"submissions":[],"image":"uploads/tasks/63f5d54a-8adb-4077-9fbc-f3221b8cd27a.png","taskLink":"https://discord.gg/tazkora","taskType":"DISCORD","createdAt":"2025-03-17T13:53:40.178Z","updatedAt":"2025-03-17T13:53:40.178Z","__v":0},{"createdBy":{"userId":"67d7e607e190ac1ca7dc570d","role":"user"},"_id":"67d82859564666ad26d3ec5a","title":"Follow Tazkora on Twitter","description":"1. Follow @tazkora on Twitter\n2. Like and Retweet our pinned post","totalSpots":10,"rewardPerUser":50,"totalRewardBudget":500,"status":"OPEN","completedCount":1,"submissions":[{"userId":{"_id":"67d7e607e190ac1ca7dc570d","email":"jessicaanavheoba@gmail.com"},"status":"APPROVED","proof":"uploads/tasks/acb2612d-cf99-4418-8fec-046ace23a762.png","_id":"67d82930564666ad26d3ec60","submissionDate":"2025-03-17T13:52:48.192Z","approvalDate":"2025-03-17T13:54:45.274Z"}],"image":"uploads/tasks/77d67ce4-8954-4af8-a36e-fe942d72e23e.png","taskLink":"https://twitter.com/tazkora","taskType":"TWITTER","createdAt":"2025-03-17T13:49:13.241Z","updatedAt":"2025-03-17T13:54:45.274Z","__v":0}],"pagination":{"total":2,"page":1,"limit":5,"pages":1}}}a@a:~/tazkora$ 