ab@ab:~/tazkora$ curl -X POST https://tazkora-production.up.railway.app/api/users/register \
-H "Content-Type: application/json" \
-d '{
    "firstName": "Anavheoba",
    "lastName": "Abraham",
    "middleName": "",
    "email": "anavheobaabraham@gmail.com",
    "username": "anavheoba",
    "password": "YourPassword123!",
    "confirmPassword": "YourPassword123!",
    "dateOfBirth": "1990-01-01",
}'  "gender": "male"
{"message":"Registration successful. Please verify your email.","email":"anavheobaabraham@gmail.com"}ab@ab:~/tazkora$ 


ab@ab:~/tazkora$ curl -X POST https://tazkora-production.up.railway.app/api/users/verify-email \
-H "Content-Type: application/json" \
-d '{
    "email": "anavheobaabraham@gmail.com",
    "code": "383509"
}'
{"message":"Email verified successfully","email":"anavheobaabraham@gmail.com"}ab@ab:~/tazkora$ 




ab@ab:~/tazkora$ curl -X POST https://tazkoraab@ab:~/tazkora$ curl -X POST https://tazkora-production.up.railway.app/api/users/login \
-H "Content-Type: application/json" \
-d '{
    "username": "anavheobaabraham@gmail.com",
    "password": "YourPassword123!"
}'
{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FkZWFiMWEzYjUyZThjNGU0YWU1ZmQiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwibmFtZSI6IkFuYXZoZW9iYSBBYnJhaGFtIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk0NTExNjAsImV4cCI6MTczOTUzNzU2MH0.MUvpaSEfbmP7t8R1Ur51DpoBmMS_4lVCLTasbcepTVg","user":{"id":"67adeab1a3b52e8c4e4ae5fd","email":"anavheobaabraham@gmail.com","name":"Anavheoba Abraham","username":"anavheoba"}}ab@ab:~/tazkora$ 