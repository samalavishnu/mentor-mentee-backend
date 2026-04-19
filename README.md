# Mentor-Mentee Backend

Backend API for a mentor-mentee platform built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- JWT-based authentication
- Mentor discovery and follow flows
- Session booking and feedback modules
- User profile and certification APIs
- Real-time chat using Socket.IO
- Health check endpoint

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT authentication
- Multer (uploads)

## Project Structure

```text
config/        # DB connection
controllers/   # Route handlers
middleware/    # Auth + error middleware
models/        # Mongoose models
routes/        # API route modules
utils/         # Helper utilities
server.js      # App + HTTP server bootstrap
socket.js      # Socket.IO setup and events
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=https://mentor-mentee-frontend.vercel.app,https://mentor-mentee-frontend-git-main-018vishnuteja-7545s-projects.vercel.app
VERCEL_PREVIEW_HOST_SUFFIX=-018vishnuteja-7545s-projects.vercel.app
```

> Note: The MongoDB connection is currently defined in `config/db.js`.

### 3) Run the server

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server default URL: `http://localhost:5000`

## API Base Path

All REST endpoints are prefixed with `/api`.

Available route groups:

- `/api/auth`
- `/api/mentors`
- `/api/follow`
- `/api/sessions`
- `/api/feedback`
- `/api/users`
- `/api/chat`
- `/api/certifications`

Health endpoint:

- `GET /api/health`

## Real-time Chat (Socket.IO)

The server initializes Socket.IO on the same HTTP server. Clients must provide JWT in `socket.handshake.auth.token`.

Key events:

- `send_message`
- `new_message`
- `typing`
- `user_typing`
- `stop_typing`
- `user_stop_typing`

## Scripts

- `npm start` — start server with Node.js
- `npm run dev` — start server with Nodemon

## License

No license file is currently defined in this repository.
