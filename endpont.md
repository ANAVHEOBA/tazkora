ab@ab:~/tazkora$ curl -X POST https://tazkora-production.up.railway.app/api/users/request-access \
-H "Content-Type: application/json" \
-d '{
    "email": "anavheobaabraham@gmail.com"
}'
{"message":"Verification code sent successfully","email":"anavheobaabraham@gmail.com"}ab@ab:~/tazkora$ 




ab@ab:~/tazkora$ curl -X POST https://tazkora-production.up.railway.app/api/users/verify \
-H "Content-Type: application/json" \
-d '{
    "email": "anavheobaabraham@gmail.com",
    "code": "925670"
}'
{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FkZWFiMWEzYjUyZThjNGU0YWU1ZmQiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzk0NTkyNjEsImV4cCI6MTczOTU0NTY2MX0.AV9P7V8i_puvqF6LO9JDXmRL79hzdDuqXKzB-38LXjs","user":{"id":"67adeab1a3b52e8c4e4ae5fd","email":"anavheobaabraham@gmail.com"}}ab@ab:~/tazkora$ 