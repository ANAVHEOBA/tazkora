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








a@a:~/tazkora$ curl -X PATCH \
  'https://tazkora-production.up.railway.app/api/users/me' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMTQ1YmU3MGRmYWE3N2Y5MjZjYTYiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDA1MTMxNDIsImV4cCI6MTc0MDU5OTU0Mn0._plq_rSPd80_oreoxsoRh4j8JnOvSbsdWLLvIEqd1gE' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Anavhe",
    "lastName": "Abraham",
    "bio": "Software Developer",
    "country": "Nigeria",
}'  "city": "Lagos"
{"success":true,"message":"User details updated successfully","user":{"id":"67b3145be70dfaa77f926ca6","email":"anavheobaabraham@gmail.com","firstName":"Anavhe","lastName":"Abraham","bio":"Software Developer","country":"Nigeria","city":"Lagos"}}a@a:~/tazkora$ 









a@a:~/tazkora$ curl -X PATCH \
  'https://tazkora-production.up.railway.app/api/users/me' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2IzMTQ1YmU3MGRmYWE3N2Y5MjZjYTYiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDA1MTMxNDIsImV4cCI6MTc0MDU5OTU0Mn0._plq_rSPd80_oreoxsoRh4j8JnOvSbsdWLLvIEqd1gE' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Anavhe",
    "lastName": "Abraham",
    "phoneNumber": "+2348012345678",
    "bio": "Full Stack Software Developer | AI Enthusiast | Open Source Contributor",
}'  "city": "Lagos"eria",01-01",xample.com/profile.jpg",
{"success":true,"message":"User details updated successfully","user":{"id":"67b3145be70dfaa77f926ca6","email":"anavheobaabraham@gmail.com","firstName":"Anavhe","lastName":"Abraham","phoneNumber":"+2348012345678","bio":"Full Stack Software Developer | AI Enthusiast | Open Source Contributor","profilePicture":"https://example.com/profile.jpg","dateOfBirth":"1990-01-01T00:00:00.000Z","country":"Nigeria","city":"Lagos"}}a@a:~/tazkora$ 