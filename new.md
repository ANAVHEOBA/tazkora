ab@ab:~/tazkora$ curl -X GET http://localhost:5000/api/users/partners \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FkZWFiMWEzYjUyZThjNGU0YWU1ZmQiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk0NTkyNjEsImV4cCI6MTczOTU0NTY2MX0.AV9P7V8i_puvqF6LO9JDXmRL79hzdDuqXKzB-38LXjs"
{"success":true,"partners":[{"id":"67b30d457653572161949225","name":"TRIX","logo":"https://example.com/trix-logo.png","description":"Updated: TRIX is a reward platform. Follow us for exciting rewards!","taskType":"social_follow","pointValue":150,"progress":"0/300"},{"id":"679e6ed2b11af65b856dc1f1","name":"RUCCI","logo":"https://example.com/rucci-logo.png","description":"Updated RUCCI description","taskType":"Search","pointValue":150,"progress":"0/300"}]}ab@ab:~/tazkora$ 




ab@ab:~/tazkora$ curl -X GET http://localhost:5000/api/users/partners/67b30d457653572161949225 \   curl -X GET http://localhost:5000/api/users/partners/67b30d457653572161949225 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FkZWFiMWEzYjUyZThjNGU0YWU1ZmQiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk0NTkyNjEsImV4cCI6MTczOTU0NTY2MX0.AV9P7V8i_puvqF6LO9JDXmRL79hzdDuqXKzB-38LXjs"
{"success":true,"partner":{"id":"67b30d457653572161949225","name":"TRIX","logo":"https://example.com/trix-logo.png","description":"Updated: TRIX is a reward platform. Follow us for exciting rewards!","taskType":"social_follow","pointValue":150,"targetCount":300,"currentCount":0,"userProgress":null}}ab@ab:~/tazkora$ 



ab@ab:~/tazkora$ curl -X GET http://localhost:5000/api/users/me/tasks \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMjNmMmU3MGRmYWE3N2Y5MjZjYmEiLCJlbWFpbCI6Indpc2RvbXZvbHRAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk3OTM0NjgsImV4cCI6MTczOTg3OTg2OH0.MHN2VW1M1QXKVFhAakWvjldFG_cjcMTAoxky15YBnac"
{"success":true,"tasks":[]}ab@ab:~/tazkora$ 





ab@ab:~/tazkora$ curl -X GET http://localhost:5000/api/users/partners \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMjNmMmU3MGRmYWE3N2Y5MjZjYmEiLCJlbWFpbCI6Indpc2RvbXZvbHRAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk3OTM0NjgsImV4cCI6MTczOTg3OTg2OH0.MHN2VW1M1QXKVFhAakWvjldFG_cjcMTAoxky15YBnac"
{"success":true,"partners":[{"id":"67b30d457653572161949225","name":"TRIX","logo":"https://example.com/trix-logo.png","description":"Updated: TRIX is a reward platform. Follow us for exciting rewards!","taskType":"social_follow","pointValue":150,"progress":"0/300"},{"id":"679e6ed2b11af65b856dc1f1","name":"RUCCI","logo":"https://example.com/rucci-logo.png","description":"Updated RUCCI description","taskType":"Search","pointValue":150,"progress":"0/300"}]}ab@ab:~/tazkora$ 



ab@ab:~/tazkora$ curl -X GET http://localhost:5000/api/users/partners/67b30d457653572161949225 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMjNmMmU3MGRmYWE3N2Y5MjZjYmEiLCJlbWFpbCI6Indpc2RvbXZvbHRAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk3OTM0NjgsImV4cCI6MTczOTg3OTg2OH0.MHN2VW1M1QXKVFhAakWvjldFG_cjcMTAoxky15YBnac"
{"success":true,"partner":{"id":"67b30d457653572161949225","name":"TRIX","logo":"https://example.com/trix-logo.png","description":"Updated: TRIX is a reward platform. Follow us for exciting rewards!","taskType":"social_follow","pointValue":150,"targetCount":300,"currentCount":0,"userProgress":null}}ab@ab:~/tazkora$ 




ab@ab:~/tazkora$ curl -X POST http://localhost:5000/api/users/partners/67b30d457653572161949225/tasks \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMjNmMmU3MGRmYWE3N2Y5MjZjYmEiLCJlbWFpbCI6Indpc2RvbXZvbHRAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk3OTM0NjgsImV4cCI6MTczOTg3OTg2OH0.MHN2VW1M1QXKVFhAakWvjldFG_cjcMTAoxky15YBnac" \
-H "Content-Type: application/json" \
-d '{
    "screenshot": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
}'
{"success":true,"message":"Task submitted successfully","task":{"partnerId":"67b30d457653572161949225","pointsEarned":150,"status":"pending"}}ab@ab:~/tazkora$ 




ab@ab:~/tazkora$ curl -X POST http://localhost:5000/api/users/tasks/create \
ab@ab:~/tazkora$ curl -X POST http://localhost:5000/api/users/tasks/create \iI2N2IzMjNmMmU3MGRmYWE3N2Y5MjZjY
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMjNmMmU3MGRmYWE3N2Y5MjZjYmEiLCJlbWFpbCI6Indpc2RvbXZvbHRAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk3OTM0NjgsImV4cCI6MTczOTg3OTg2OH0.MHN2VW1M1QXKVFhAakWvjldFG_cjcMTAoxky15YBnac" \
-H "Content-Type: application/json" \
-d '{title": "Follow Instagram Page",
    "title": "Follow Instagram Page",d like 3 posts",
    "description": "Follow @BrandX and like 3 posts",
    "taskType": "Online",al Media",
    "taskCategory": "Social Media",0.000Z",
    "deadline": "2024-03-01T00:00:00.000Z",llow confirmation",
    "verificationMethod": "Screenshot of follow confirmation",
    "targetLink": "https://instagram.com/BrandX",
    "budget": 100,l marketing campaign for BrandX"
    "bio": "Digital marketing campaign for BrandX"
}'
{"success":true,"message":"Task created successfully","task":{"title":"Follow Instagram Page","description":"Follow @BrandX and like 3 posts","taskType":"Online","taskCategory":"Social Media","deadline":"2024-03-01T00:00:00.000Z","verificationMethod":"Screenshot of follow confirmation","targetLink":"https://instagram.com/BrandX","budget":100,"bio":"Digital marketing campaign for BrandX","createdBy":"67b323f2e70dfaa77f926cba","status":"active","_id":"67b328652ed445a3a754cbc4","createdAt":"2025-02-17T12:15:33.788Z","updatedAt":"2025-02-17T12:15:33.788Z"}}ab@ab:~/tazkora$ 





ab@ab:~/tazkora$ curl -X GET http://localhost:5000/api/users/tasks/created -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMjNmMmU3MGRmYWE3N2Y5MjZjYmEiLCJlbWFpbCI6Indpc2RvbXZvbHRAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk3OTM0NjgsImV4cCI6MTczOTg3OTg2OH0.MHN2VW1M1QXKVFhAakWvjldFG_cjcMTAoxky15YBnac"
{"success":true,"tasks":[{"title":"Follow Instagram Page","description":"Follow @BrandX and like 3 posts","taskType":"Online","taskCategory":"Social Media","deadline":"2024-03-01T00:00:00.000Z","verificationMethod":"Screenshot of follow confirmation","targetLink":"https://instagram.com/BrandX","budget":100,"bio":"Digital marketing campaign for BrandX","status":"active","createdBy":"67b323f2e70dfaa77f926cba","_id":"67b328652ed445a3a754cbc4","createdAt":"2025-02-17T12:15:33.788Z","updatedAt":"2025-02-17T12:15:33.788Z"}]}ab@ab:~/tazkora$ 