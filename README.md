# TaskFlow

TaskFlow is a full stack MERN productivity app with JWT auth, task CRUD, backend-calculated priority scoring, Socket.io real-time updates, and a live analytics dashboard.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Socket.io
- Frontend: React, Redux Toolkit, Chakra UI, Vite, Socket.io Client
- Auth: Bearer JWT stored in frontend localStorage and attached to API/socket requests

## Local Setup

1. Install dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start MongoDB locally or set `MONGODB_URI` to a MongoDB Atlas connection string.

4. Run the backend:

```bash
cd backend
npm run dev
```

5. Run the frontend:

```bash
cd frontend
npm run dev
```

The frontend defaults to `http://localhost:5174` and the backend defaults to `http://localhost:5000`.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/analytics`

Task and analytics routes require `Authorization: Bearer <token>`.

## Real-Time Behavior

Socket.io authenticates with the same JWT and joins each user to a private room. Creating, updating, or deleting a task emits live task and analytics updates to that user's connected sessions, so multiple tabs stay in sync without leaking task data across users.

## Deployment Notes

Recommended deployment:

- Backend: Render or Railway
- Frontend: Vercel or Netlify
- Database: MongoDB Atlas

Set these backend variables in production:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_ORIGIN`

Set this frontend variable in production:

- `VITE_API_URL=https://your-backend.example.com/api`

After deploying the frontend, update backend `CLIENT_ORIGIN` to the live frontend URL so CORS and WebSocket connections work.

For Render, use:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

For Vercel, use:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Verification

Run these checks before deployment:

```bash
cd frontend
npm run lint
npm run build

cd ../backend
node --check src/server.js
node --check src/controllers/taskController.js
```
