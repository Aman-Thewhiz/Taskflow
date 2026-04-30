# 📌 REFERENCE.md — Always-On Context Document
> Keep this file open at all times. Every AI agent prompt session must begin by reading this file.

---

## 🧠 Project Identity

**Project Name:** TaskFlow — Real-Time Productivity Management System  
**Type:** Full Stack Mini SaaS Web Application  
**Assessment Context:** MERN + Redux Full Stack Developer Assessment (4 Modules, 4 Hours)

---

## 🎯 Core Purpose

Build a real-time task and productivity management system where authenticated users can:
- Create, manage, and track tasks
- See tasks automatically prioritized by an intelligent engine
- Receive real-time updates across all connected sessions without page refresh
- View personal productivity insights and activity analytics on a live dashboard

---

## 🛠️ Mandatory Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (functional components + hooks) |
| State Management | Redux Toolkit (RTK) |
| Backend | Node.js + Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Real-Time | Socket.io (WebSockets) |
| Auth | JWT (JSON Web Tokens) |
| UI Library | Chakra UI (preferred) or any modern React UI library |

> ⚠️ No fake/mock backend. No localStorage-only state. No hardcoded logic. All data must persist in MongoDB.

---

## 🎨 UI / Design Direction

**Aesthetic:** Dark, sleek, modern — inspired by premium DeFi/SaaS dashboards.

**Key Visual References from Design Inspiration:**
- Deep dark backgrounds (near-black) with soft glowing gradients (green-teal ambient glow)
- Minimal, airy layouts with high contrast white text on dark surfaces
- Subtle mesh/radial gradients as background atmosphere — not flat black
- Cards and containers with frosted-glass or soft border styling
- Bold, confident typography for headings; clean readable body text
- Accent colors: white, soft green/teal, subtle gold/amber for highlights
- Status indicators as colored badges or subtle glowing dots
- Smooth transitions and subtle animations on interactions
- Sidebar navigation or top nav with clean icon + label pairing

**Do NOT use:**
- Bright white backgrounds
- Flat, generic Material Design or plain Bootstrap look
- Heavy borders or outdated UI patterns
- Purple gradient clichés

---

## 📦 Application Modules Overview

### Module 1 — Authentication & Core Task System
The foundation. Users register and log in with JWT auth. Protected routes on both frontend and backend. Full CRUD for tasks. Redux manages auth state and task state globally.

**Task Data Shape:**
- Task ID (auto)
- Title (string, required)
- Description (string)
- Category (string — e.g., Work, Personal, Urgent)
- Status (enum: Pending / In Progress / Completed)
- Created timestamp (auto)
- Deadline (date, user-set)
- Priority Score (number — calculated dynamically, not user-set)

---

### Module 2 — Smart Task Prioritization Engine
Backend calculates a dynamic priority score for every task. No static or manual priority setting by users.

**Priority Rules (all backend-calculated):**
- Priority score increases automatically as the deadline approaches
- Overdue tasks (deadline passed, not completed) always get the highest priority
- If two tasks share the same priority score, the one created earlier comes first (FIFO tiebreaker)
- Frontend displays tasks sorted by priority at all times
- High-priority and overdue tasks are visually highlighted

---

### Module 3 — Real-Time Task Updates (Critical Module)
All task mutations (create, update, delete) must broadcast changes via Socket.io to all connected clients instantly.

**Rules:**
- Updates must reflect within 1 second across all sessions
- No page refresh allowed to see updates
- Multiple users must see each other's relevant changes in real-time
- Socket events triggered on every task create / update / delete

---

### Module 4 — Productivity Insights & Activity Tracking
A live analytics dashboard showing per-user productivity data, all calculated dynamically on the backend.

**Tracked Metrics:**
- Total tasks
- Completed tasks
- Pending tasks
- Tasks completed today (daily count)
- Most active category
- Human-readable insight strings (e.g., "You completed 5 tasks today", "Most active in: Work")

**Dashboard must update in real-time** as tasks change (via Socket.io).

---

## 🔐 Auth & Security Rules

- Passwords must be hashed (bcrypt)
- JWT stored securely (httpOnly cookie or Authorization header — choose one and stay consistent)
- All task routes are protected (middleware checks JWT on every request)
- Each user only sees and manages their own tasks
- Redux auth slice tracks: `{ user, token, isAuthenticated, loading, error }`

---

## 🔄 Redux State Shape (Reference)

```
store
├── auth
│   ├── user (object: id, name, email)
│   ├── token (string)
│   ├── isAuthenticated (boolean)
│   ├── loading (boolean)
│   └── error (string | null)
└── tasks
    ├── items (array of task objects)
    ├── loading (boolean)
    ├── error (string | null)
    └── filters (object: status, category, search)
```

---

## 🌐 API Endpoint Reference

### Auth Routes (Public)
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Authenticate, return JWT

### Task Routes (Protected — require JWT)
- `GET /api/tasks` — Get all tasks for authenticated user (sorted by priority)
- `POST /api/tasks` — Create new task
- `PUT /api/tasks/:id` — Update task (status, title, description, deadline, category)
- `DELETE /api/tasks/:id` — Delete task

### Analytics Route (Protected)
- `GET /api/analytics` — Return productivity insights for authenticated user

---

## 📡 Socket.io Event Reference

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `task:created` | Server → All clients | task object | Broadcast when a task is created |
| `task:updated` | Server → All clients | updated task object | Broadcast when a task is updated |
| `task:deleted` | Server → All clients | `{ taskId }` | Broadcast when a task is deleted |
| `analytics:updated` | Server → All clients | analytics object | Broadcast when analytics change |

---

## 🚀 Deployment Targets

| Part | Platform |
|---|---|
| Frontend | Vercel or Netlify |
| Backend | Render or Railway |
| Database | MongoDB Atlas |

---

## ✅ Completion Checklist (For Each Module)

**Module 1:**
- [ ] Register + Login APIs working
- [ ] JWT auth middleware protecting task routes
- [ ] Task CRUD fully functional
- [ ] Redux managing auth state and task state
- [ ] Protected routes on frontend (redirect if not authenticated)
- [ ] Data persists in MongoDB

**Module 2:**
- [ ] Priority score auto-calculated on backend
- [ ] Overdue tasks get highest priority
- [ ] Tasks sorted by priority in API response
- [ ] Frontend displays sorted list with visual priority indicators
- [ ] Priority recalculates dynamically (no static values)

**Module 3:**
- [ ] Socket.io server initialized and connected
- [ ] All task mutations emit socket events
- [ ] Frontend listens to socket events and updates Redux store
- [ ] Updates visible within 1 second without page refresh
- [ ] Multi-user real-time visibility confirmed

**Module 4:**
- [ ] Analytics API returns all required metrics
- [ ] Dashboard displays all metrics
- [ ] Real-time update on dashboard when tasks change
- [ ] Insights are user-specific, not global

---

## ⛔ Strict Rules (Never Violate)

1. Never hardcode logic or mock data
2. Never use localStorage as the primary data store for tasks
3. Never allow page refresh to be required for real-time updates
4. Never skip protected route middleware
5. Priority score must always be calculated on the backend dynamically
6. Localhost URLs are not acceptable for submission — app must be deployed
