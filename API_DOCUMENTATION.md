# Tazkora API Documentation

All API endpoints and their usage are documented below. The base URLs are http://localhost:5000 for development and https://tazkora-3.onrender.com for production.

To request access, send a POST request to /api/users/request-access with your email:

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}' \
  http://localhost:5000/api/users/request-access

You'll receive a response like:
{"message":"Verification code sent successfully","email":"user@example.com"}

Once you have the verification code, verify it with:

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "123456"
}' \
  http://localhost:5000/api/users/verify

This returns your JWT token and user info:
{"message":"Login successful","token":"your.jwt.token","user":{"id":"user_id","email":"user@example.com"}}

To connect Twitter, use the token in your Authorization header:

curl -H "Authorization: Bearer your.jwt.token" \
  https://tazkora-3.onrender.com/api/users/twitter/connect

This returns a Twitter OAuth URL:
{"url":"https://twitter.com/i/oauth2/authorize?..."}

After authorizing on Twitter, you'll receive:
{"success":true,"message":"Twitter connected successfully","data":{"id":"twitter_id","username":"twitter_username","accessToken":"twitter_token"}}

To disconnect Twitter:

curl -X POST https://tazkora-3.onrender.com/api/users/twitter/disconnect \
-H "Authorization: Bearer your.jwt.token" \
-H "Content-Type: application/json"

Response:
{"success":true,"message":"Twitter disconnected successfully"}

For Discord connection, use:

curl -X GET https://tazkora-3.onrender.com/api/users/discord/connect \
-H "Authorization: Bearer your.jwt.token"

This returns a Discord OAuth URL:
{"url":"https://discord.com/oauth2/authorize?..."}

After authorizing on Discord, you'll receive:
{"success":true,"message":"Discord connected successfully","data":{"id":"discord_id","username":"discord_username","email":"discord_email"}}

To disconnect Discord:

curl -X POST https://tazkora-3.onrender.com/api/users/discord/disconnect \
-H "Authorization: Bearer your.jwt.token"

Response:
{"success":true,"message":"Discord disconnected successfully"}

All authenticated endpoints need the JWT token in the Authorization header as "Bearer your.jwt.token". The API returns JSON responses with appropriate HTTP status codes (200 for success, 400 for bad requests, 401 for unauthorized, etc.). Error responses include a success:false flag and an error message.

When implementing the frontend:
1. Start with the email verification flow to get the JWT token
2. Store the token securely
3. Use the token for all authenticated requests
4. For social media connections, redirect users to the returned OAuth URLs
5. Handle the success/error responses appropriately
6. Store relevant user data from successful responses
7. Update UI based on connection status

The API uses standard HTTP methods (GET, POST) and JSON for data transfer. All timestamps are in ISO 8601 format. Keep the JWT token secure and include it in every authenticated request's Authorization header. 