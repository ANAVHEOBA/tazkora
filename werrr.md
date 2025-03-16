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





a@a:~/tazkora$ curl -H "Authorization: Bearer $TOKEN"   https://tazkora-3.onrender.com/api/users/twitter/connect
{"url":"https://twitter.com/i/oauth2/authorize?response_type=code&client_id=RGRkSlN1UXA0ZUpXTWVTc1N3TUE6MTpjaQ&redirect_uri=https%3A%2F%2Ftazkora-3.onrender.com%2Fapi%2Fusers%2Ftwitter%2Fcallback&scope=tweet.read+users.read+offline.access&state=eyJ2ZXJpZmllciI6Ii1sUmVHS3JfajBSZUoyR3lrVEt4aVBGNi1OdUVLRl9HX0dPSTRoaGVfcXNIWGd%2BZk9QSEZqOUdrUDhkcFJjaFFSdTBDWmh4YllRalNNRmxScEhYNjMuTG5La2ppS1JkM0d2flRFUF9MdngyZ2paRmFKQ29sM0JsdHlnbEV6VF9LIiwidXNlcklkIjoiNjdkNmI3MWNlMTkwYWMxY2E3ZGM1NmYxIiwidGltZXN0YW1wIjoxNzQyMTMyNDkzMjc1fQ%3D%3D&code_challenge_method=S256&code_challenge=8YY6yO4n0IoAvrfZhFhU9_C1UcpxspJa7Koalft8rTM"}a@a:~/tazkora$ 


{"success":true,"message":"Twitter connected successfully","data":{"id":"1662546173419302912","username":"AnavheobaDEV","accessToken":"a2o4TVljcl..."}}




a@a:~/tazkora$ curl -X POST https://tazkora-3.onrender.com/api/users/twitter/disconnect \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2YjcxY2UxOTBhYzFjYTdkYzU2ZjEiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIxMjQ5NjAsImV4cCI6MTc0MjIxMTM2MH0.xu3gVqhZJsXA-STBsfUyNkVFB9pIDelZJFqsX8G9JQs" \
-H "Content-Type: application/json"
{"success":true,"message":"Twitter disconnected successfully"}a@a:~/tazkora$ 





a@a:~/tazkora$ curl -X GET https://tazkora-3.onrender.com/api/users/discord/connect \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2YjcxY2UxOTBhYzFjYTdkYzU2ZjEiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIxMjQ5NjAsImV4cCI6MTc0MjIxMTM2MH0.xu3gVqhZJsXA-STBsfUyNkVFB9pIDelZJFqsX8G9JQs"
{"url":"https://discord.com/oauth2/authorize?client_id=1346478400742887537&redirect_uri=https%3A%2F%2Ftazkora-production.up.railway.app%2Fapi%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email"}a@a:~/tazkora$ 





a@a:~/tazkora$ curl -X GET https://tazkora-3.onrender.com/api/users/discord/connect -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2YjcxY2UxOTBhYzFjYTdkYzU2ZjEiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIxMjQ5NjAsImV4cCI6MTc0MjIxMTM2MH0.xu3gVqhZJsXA-STBsfUyNkVFB9pIDelZJFqsX8G9JQs"
{"url":"https://discord.com/oauth2/authorize?client_id=1346478400742887537&redirect_uri=https%3A%2F%2Ftazkora-3.onrender.com%2Fapi%2Fusers%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email&state=eyJ1c2VySWQiOiI2N2Q2YjcxY2UxOTBhYzFjYTdkYzU2ZjEiLCJ0aW1lc3RhbXAiOiIyMDI1LTAzLTE2VDE2OjExOjAzLjQ4N1oifQ=="}a@a:~/tazkora$ 






{"success":true,"message":"Discord connected successfully","data":{"id":"1155866911591120967","username":"anavheoba_17","email":"wisdomabraham92@gmail.com"}}










a@a:~/tazkora$ curl -X POST https://tazkora-3.onrender.com/api/users/discord/disconnect \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2YjcxY2UxOTBhYzFjYTdkYzU2ZjEiLCJlbWFpbCI6ImFuYXZoZW9iYWFicmFoYW1AZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDIxMjQ5NjAsImV4cCI6MTc0MjIxMTM2MH0.xu3gVqhZJsXA-STBsfUyNkVFB9pIDelZJFqsX8G9JQs"
{"success":true,"message":"Discord disconnected successfully"}a@a:~/tazkora$ 