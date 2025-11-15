# Backend API - Express with Redis

Simple Express API with Redis-based authentication for learning purposes.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Fill in the values in `.env`:
   - `PORT`: Server port (default: 3001)
   - `REDIS_HOST`: Redis host (default: localhost)
   - `REDIS_PORT`: Redis port (default: 6379)
   - `REDIS_PW`: Redis password (leave empty if no password)
   - `COOKIE_KEY`: Secret key for cookie signing (generate a random string)

4. Make sure Redis is running (in Docker):
```bash
docker ps  # Check if Redis container is running
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### POST `/api/auth/signup`
Create a new user account and session.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
- Status: `200 OK`
- Body: `{ "success": true, "userId": "..." }`
- Cookie: Sets `auth` cookie with session

### POST `/api/auth/signin`
Sign in with existing credentials and create a session.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
- Status: `200 OK`
- Body: `{ "success": true, "userId": "..." }`
- Cookie: Sets `auth` cookie with session

### GET `/api/hello`
Protected endpoint that requires authentication.

**Headers:**
- Cookie: `auth=<session_id>:<signature>`

**Response:**
- Status: `200 OK` - If authorized
  - Body: `{ "message": "hello" }`
- Status: `401 Unauthorized` - If not authenticated
  - Body: `{ "message": "unauthorized" }`

### GET `/health`
Health check endpoint.

**Response:**
- Status: `200 OK`
- Body: `{ "status": "ok" }`

## Testing with Postman

1. **Signup:**
   - Method: `POST`
   - URL: `http://localhost:3001/api/auth/signup`
   - Body (raw JSON):
     ```json
     {
       "username": "testuser",
       "password": "password123"
     }
     ```
   - After sending, Postman should automatically store the cookie from the response

2. **Signin:**
   - Method: `POST`
   - URL: `http://localhost:3001/api/auth/signin`
   - Body (raw JSON):
     ```json
     {
       "username": "testuser",
       "password": "password123"
     }
     ```

3. **Hello (Protected):**
   - Method: `GET`
   - URL: `http://localhost:3001/api/hello`
   - Make sure cookies are enabled in Postman settings
   - The cookie from signup/signin should be automatically sent

## Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express app
│   ├── config/
│   │   └── redis.ts           # Redis client setup
│   ├── routes/
│   │   ├── auth.ts            # Signup & signin routes
│   │   └── protected.ts       # Protected hello endpoint
│   ├── services/
│   │   ├── auth/
│   │   │   └── auth.ts        # Auth logic (signup/signin)
│   │   ├── queries/
│   │   │   ├── users.ts       # User queries
│   │   │   └── sessions.ts    # Session queries
│   │   └── session.ts         # Session management
│   └── utils/
│       ├── keys.ts            # Redis key helpers
│       └── gen-id.ts          # ID generation
├── package.json
├── tsconfig.json
└── .env.example
```

## Notes

- Sessions are stored in Redis as hashes
- Users are stored in Redis with username lookup via sorted sets
- Cookie-based authentication using keygrip for signing
- Password hashing uses scrypt with salt
