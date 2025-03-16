a@a:~/tazkora$ curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "anavheobaabraham@gmail.com"}' \
  http://localhost:5000/api/users/request-access
{"message":"Verification code sent successfully","email":"anavheobaabraham@gmail.com"}a@a:~/tazkora$ curl -X POST \        curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "anavheobaabraham@gmail.com",
    "code": "916554"
}' \
  http://localhost:5000/api/users/verify
{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2YjcxY2UxOTBhYzFjYTdkYzU2ZjEiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIxMjQ5NjAsImV4cCI6MTc0MjIxMTM2MH0.xu3gVqhZJsXA-STBsfUyNkVFB9pIDelZJFqsX8G9JQs","user":{"id":"67d6b71ce190ac1ca7dc56f1","email":"anavheobaabraham@gmail.com"}}a@a:~/tazkora$ 