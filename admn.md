POST /api/admin/login
POST /api/admin/logout

POST /api/admin/partners          - Create new partner
GET /api/admin/partners          - List all partners
GET /api/admin/partners/:id      - Get partner details
PUT /api/admin/partners/:id      - Update partner
DELETE /api/admin/partners/:id   - Delete/deactivate partner



ab@ab:~/tazkora$ curl -X POST http://localhost:3000/api/admiin -H "Content-Type: application/json" -d '{"email":"admin@tazkora.com","password":"admin123"}'
{"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzllNjgzMGU4NmM2M2FkZTZiMjhlZjciLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM4NDM1Mzk2LCJleHAiOjE3Mzg1MjE3OTZ9.vCRie99LHNFHdGmDxlmleAF5gcMXnpDKerqyz5vXJhw","admin":{"id":"679e6830e86c63ade6b28ef7","email":"admin@tazkora.com","name":"Admin"}}ab@ab:~/tazkora$ 


curl -X POST http://localhost:3000/api/admin/logout \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzllNjgzMGU4NmM2M2FkZTZiMjhlZjciLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM4NDM1MDEyLCJleHAiOjE3Mzg1MjE0MTJ9.LDCyiOqzMR88oMMMunaQVsdZ6G4gPGwTS3NDMlbJZ-M"



ab@ab:~/tazkora$ curl -X POST http://localhost:3000/api/admin/partners \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzllNjgzMGU4NmM2M2FkZTZiMjhlZjciLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM4NDM1Mzk2LCJleHAiOjE3Mzg1MjE3OTZ9.vCRie99LHNFHdGmDxlmleAF5gcMXnpDKerqyz5vXJhw" \
-d '{
    "name": "RUCCI",
    "logo": "https://example.com/rucci-logo.png",
    "description": "Search for an article, sign up and earn points",
    "taskType": "Search",
    "pointValue": 100,
}'  "status": "active",
{"success":true,"message":"Partner created successfully","partner":{"name":"RUCCI","logo":"https://example.com/rucci-logo.png","description":"Search for an article, sign up and earn points","taskType":"Search","pointValue":100,"targetCount":250,"currentCount":0,"status":"active","_id":"679e6ed2b11af65b856dc1f1","createdAt":"2025-02-01T18:58:26.549Z","updatedAt":"2025-02-01T18:58:26.549Z","__v":0}}ab@ab:~/tazkora$ 


ab@ab:~/tazkora$ curl -X GET http://localhost:3000/api/admin/partners/679e6ed2b11af65b856dc1f1 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzllNjgzMGU4NmM2M2FkZTZiMjhlZjciLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM4NDM1Mzk2LCJleHAiOjE3Mzg1MjE3OTZ9.vCRie99LHNFHdGmDxlmleAF5gcMXnpDKerqyz5vXJhw"
{"success":true,"partner":{"_id":"679e6ed2b11af65b856dc1f1","name":"RUCCI","logo":"https://example.com/rucci-logo.png","description":"Search for an article, sign up and earn points","taskType":"Search","pointValue":100,"targetCount":250,"currentCount":0,"status":"active","createdAt":"2025-02-01T18:58:26.549Z","updatedAt":"2025-02-01T18:58:26.549Z","__v":0}}ab@ab:~/tazkora$ curl -X PUT http://localhost:3000/api/admin/partners/679e6ed2b11af65b856dc1fab@ab:~/tazkora$ curl -X PUT http://localhost:3000/api/admin/partners/679e6ed2b11af65b856dc1f1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzllNjgzMGU4NmM2M2FkZTZiMjhlZjciLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM4NDM1Mzk2LCJleHAiOjE3Mzg1MjE3OTZ9.vCRie99LHNFHdGmDxlmleAF5gcMXnpDKerqyz5vXJhw" \
-d '{
    "description": "Updated RUCCI description",
    "pointValue": 150,
    "targetCount": 300
}'
{"success":true,"message":"Partner updated successfully","partner":{"_id":"679e6ed2b11af65b856dc1f1","name":"RUCCI","logo":"https://example.com/rucci-logo.png","description":"Updated RUCCI description","taskType":"Search","pointValue":150,"targetCount":300,"currentCount":0,"status":"active","createdAt":"2025-02-01T18:58:26.549Z","updatedAt":"2025-02-01T19:06:42.220Z","__v":0}}ab@ab:~/tazkora$ 


curl -X DELETE http://localhost:3000/api/admin/partners/679e6ed2b11af65b856dc1f1 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzllNjgzMGU4NmM2M2FkZTZiMjhlZjciLCJlbWFpbCI6ImFkbWluQHRhemtvcmEuY29tIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM4NDM1Mzk2LCJleHAiOjE3Mzg1MjE3OTZ9.vCRie99LHNFHdGmDxlmleAF5gcMXnpDKerqyz5vXJhw"



    