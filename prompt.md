# 🧩 PROMPT.md — Phase-Based AI Agent Prompts
> Each prompt is self-contained but references prior context. Before running any phase, re-read `reference.md` in full.
> Run phases in strict order. Do not skip or merge phases.

---

## 📋 How to Use This File

1. Open `reference.md` and read it completely before starting any phase.
2. Copy the prompt for the current phase and paste it into your AI agent.
3. Complete and verify each phase before moving to the next.
4. Every phase prompt includes a "Context from Previous Phase" section — never skip it.
5. After completing each module, report completion and ask for confirmation before proceeding.

---

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODULE 1 — Authentication & Core Task System
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## 🔵 Phase 1.1 — Backend Project Setup & Database Connection

```
You are building a Full Stack MERN application called "TaskFlow" — a real-time productivity management system.

Context from Reference:
- Stack: Node.js + Express.js backend, MongoDB with Mongoose, JWT for auth, Socket.io will be added later
- This is Phase 1.1 of a multi-phase build. You are setting up the backend only in this phase.
- The backend will serve REST APIs for authentication and task management.
- All future phases will extend this same backend — keep it modular and scalable.

Your task in this phase:
Set up the complete backend project from scratch. This includes:
- Initializing the Node.js project with all required dependencies for the entire project upfront (express, mongoose, jsonwebtoken, bcryptjs, dotenv, cors, socket.io, cookie-parser, and any other necessary packages)
- Configuring environment variables via a .env file (MongoDB URI, JWT secret, PORT, client origin for CORS)
- Creating the Express application with proper middleware setup (CORS configured for the frontend origin, JSON body parsing, cookie parser)
- Establishing the MongoDB connection using Mongoose with proper error handling and connection logs
- Creating a clean modular folder structure with separate directories for routes, controllers, models, middleware, and utilities
- Setting up a base HTTP server (not just Express app) that will later support Socket.io integration in Module 3
- Adding a root health-check route that confirms the API is running
- The server must start and connect to MongoDB successfully before accepting any requests

Do not implement any routes or models yet. This phase is purely project scaffolding and database connection.

After completion, confirm:
- Server starts without errors
- MongoDB connection is established and logged
- CORS is properly configured
- Environment variables are loading correctly
```

---

## 🔵 Phase 1.2 — User Model & Authentication APIs

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (1.1):
- Backend is initialized with Express, Mongoose, dotenv, bcryptjs, jsonwebtoken, cors, and socket.io installed
- MongoDB connection is established
- Modular folder structure is in place (routes, controllers, models, middleware)
- A base HTTP server exists that will later integrate Socket.io

Context from Reference:
- Auth uses JWT. Passwords are hashed with bcrypt.
- JWT can be stored in httpOnly cookie or Authorization header — pick one approach and stay consistent throughout the entire project.
- The user object shape: { id, name, email, password (hashed), createdAt }
- Redux auth state will track: user, token, isAuthenticated, loading, error

Your task in this phase:
Implement the complete authentication system on the backend:
- Create the User Mongoose model with name, email (unique), password (hashed), and timestamps
- Create a JWT utility that generates a token with user id as payload, using a secret from environment variables, with an expiration (e.g., 7 days)
- Create the Register API endpoint (POST /api/auth/register): validate that name, email, and password are provided; check if email already exists; hash the password with bcrypt; save the user; return a JWT token
- Create the Login API endpoint (POST /api/auth/login): validate credentials; compare hashed password; return a JWT token with user info (exclude password from response)
- Create the JWT authentication middleware: extract and verify token from request (cookie or Authorization header, consistent with your chosen approach); attach the decoded user to req.user; send 401 if token is missing or invalid
- Mount the auth routes under /api/auth
- All responses must follow a consistent JSON structure: { success, message, data }

After completion, confirm:
- Register creates a new user and returns a token
- Login returns a valid token for correct credentials
- Invalid credentials return proper error responses
- The JWT middleware correctly blocks requests without a valid token
```

---

## 🔵 Phase 1.3 — Task Model & Task CRUD APIs

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (1.2):
- Auth system is complete: Register and Login APIs work
- JWT middleware is implemented and ready to protect routes
- User model exists with id, name, email, password, timestamps

Context from Reference:
- Task data shape: { taskId (auto), title, description, category, status (Pending/In Progress/Completed), createdAt (auto), deadline, priorityScore (number, auto-calculated) }
- All task routes must be protected by JWT middleware
- Each user only sees and manages their own tasks (filter by req.user.id)
- Priority score logic: overdue tasks get highest priority, score increases as deadline approaches. This will be refined in Module 2 but create a placeholder calculation now.
- API responses sorted by priorityScore descending

Your task in this phase:
Implement the complete Task model and all CRUD API endpoints:
- Create the Task Mongoose model with all required fields: title (required), description, category, status (enum with default Pending), deadline (Date), priorityScore (Number, default 0), and a reference to the user (ObjectId linking to User model), plus timestamps
- Create a priority calculation utility function that accepts a task object and returns a numeric priority score. Rules: if deadline has passed and task is not completed → highest score (e.g., 1000 + days overdue); if deadline is approaching within 3 days → high score; otherwise → base score adjusted by days remaining. This function will be enhanced in Module 2 but must work correctly now.
- Create the GET /api/tasks endpoint: return all tasks belonging to req.user.id, with priorityScore recalculated fresh on each fetch, sorted by priorityScore descending, then by createdAt ascending for equal scores
- Create the POST /api/tasks endpoint: validate required fields; calculate priorityScore using the utility; save to MongoDB; return the created task
- Create the PUT /api/tasks/:id endpoint: verify the task belongs to req.user.id; update only provided fields; recalculate priorityScore after update; return updated task
- Create the DELETE /api/tasks/:id endpoint: verify ownership; delete from MongoDB; return success message
- Mount all task routes under /api/tasks and protect every route with the JWT middleware

After completion, confirm:
- All 4 CRUD operations work correctly via API testing
- Tasks are filtered per user (one user cannot access another's tasks)
- Priority score is calculated and returned with every task
- Tasks are returned sorted by priority
```

---

## 🔵 Phase 1.4 — Frontend Project Setup & Redux Configuration

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (1.3):
- Backend is fully working: Auth APIs (register, login) and Task CRUD APIs are complete
- JWT middleware protects all task routes
- Tasks are stored in MongoDB and returned sorted by priorityScore
- Backend base URL will be stored in frontend environment variable

Context from Reference:
- Frontend stack: React.js (functional components + hooks), Redux Toolkit (RTK), Chakra UI
- Redux store shape:
  store → auth: { user, token, isAuthenticated, loading, error }
  store → tasks: { items[], loading, error, filters: { status, category, search } }
- UI aesthetic: Dark, sleek, premium SaaS/DeFi-inspired. Deep dark backgrounds with soft teal-green ambient glowing gradients. Frosted glass cards. Bold white typography. Accent colors: white, soft teal/green, amber.
- Socket.io client will be added in Module 3 — do not add it yet, but keep the architecture open for it

Your task in this phase:
Set up the complete React frontend with Redux and Chakra UI:
- Initialize the React project and install all required dependencies upfront: @reduxjs/toolkit, react-redux, @chakra-ui/react (and its peer dependencies), axios, react-router-dom, socket.io-client (install now, use in Module 3)
- Configure Chakra UI with a custom dark theme: dark color mode as default, custom colors matching the design direction (dark backgrounds, teal accent, white text), custom font (choose a distinctive font — NOT Inter or Roboto. Consider something like DM Sans, Syne, Plus Jakarta Sans, or similar premium feel), custom component styles for buttons, cards, and inputs
- Set up the Redux store with two slices: authSlice and tasksSlice. Each slice must have proper initial state, reducers for synchronous updates, and async thunks using Redux Toolkit's createAsyncThunk for all API calls. Use axios instance configured with the backend base URL and automatic token attachment in request headers.
- Configure React Router with the following routes structure: public routes (login, register) and protected routes (dashboard, tasks). Create a ProtectedRoute component that checks isAuthenticated from Redux and redirects unauthenticated users to login.
- Create an axios instance in a dedicated file: base URL from environment variable, request interceptor that attaches JWT token to every request header, response interceptor that handles 401 errors by dispatching logout action
- On app load, check if a valid token exists (from localStorage or cookie) and rehydrate the auth state in Redux so users stay logged in on refresh
- Create the base layout shell (sidebar or top nav layout) using Chakra UI with the dark theme applied. The layout does not need page content yet — just the shell with navigation placeholder.

After completion, confirm:
- App runs without errors
- Chakra UI dark theme is applied globally
- Redux store initializes with correct initial state
- React Router routes are configured with protected route logic working
- Axios instance correctly attaches the token to requests
```

---

## 🔵 Phase 1.5 — Auth Pages UI & Redux Integration

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (1.4):
- React app is running with Redux Toolkit, Chakra UI (dark theme), React Router, and Axios configured
- Redux has authSlice and tasksSlice with async thunks ready
- Protected routes redirect unauthenticated users to /login
- Base layout shell exists
- Backend auth APIs are live at /api/auth/register and /api/auth/login

Context from Reference:
- Design aesthetic: Dark premium SaaS/DeFi look. Deep dark backgrounds, soft glowing gradients, frosted-glass card panels, bold white headings, clean inputs with subtle borders, teal/green accent buttons.
- Auth Redux state: { user, token, isAuthenticated, loading, error }
- After successful login/register: store token, set isAuthenticated to true, navigate to dashboard

Your task in this phase:
Build the complete authentication UI — Register and Login pages — connected to Redux:
- Build the Register page: full-page dark background with a centered card featuring a soft glowing gradient backdrop effect. Fields: Name, Email, Password, Confirm Password. A prominent call-to-action button with the teal accent color. Link to Login page. On submit, dispatch the register thunk; show loading state on button; show error messages from Redux state using Chakra UI alert or toast; on success, navigate to /dashboard
- Build the Login page: similar dark aesthetic to Register but distinct enough to feel like its own screen. Fields: Email, Password. Remember the design reference — the UI should feel premium and confidence-inspiring. Dispatch login thunk; handle loading/error states; on success, navigate to /dashboard
- Both pages must be fully responsive (mobile and desktop)
- Show meaningful, user-friendly error messages (not raw API errors)
- Add subtle entrance animations to the card (fade in + slight upward slide using CSS or Chakra's animation utilities)
- The design should evoke the reference image: dark atmosphere, glowing soft gradient in the background, clean minimal form, confident typography

After completion, confirm:
- Register creates a new user and redirects to dashboard
- Login authenticates and redirects to dashboard
- Errors (wrong password, existing email) display clearly to the user
- Loading state is visible during API call
- Unauthenticated users are redirected to login when accessing protected routes
```

---

## 🔵 Phase 1.6 — Task Management UI (CRUD) & Redux Integration

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (1.5):
- Auth pages (Register, Login) are working and connected to Redux
- Authenticated users reach the dashboard (currently a shell)
- Redux tasksSlice has thunks for fetch, create, update, delete but UI is not yet connected
- Backend task APIs are live and return priorityScore-sorted tasks

Context from Reference:
- Task fields visible to user: Title, Description, Category, Status (Pending/In Progress/Completed), Deadline
- Priority score is calculated by backend — never manually set by user
- Status changes: user can update a task's status from the task card or a modal
- Design: dark cards with subtle borders/glass effect, color-coded status badges, deadline display, bold title, smooth hover interactions

Your task in this phase:
Build the complete Task Management UI connected to Redux and the backend:
- Build the main Tasks page / Dashboard view with a task list area and a "Create Task" button prominently placed
- Build a Create Task form (modal or side panel using Chakra UI Modal or Drawer): fields for Title (required), Description, Category (input or select), Deadline (date picker), Status defaults to Pending. On submit, dispatch create task thunk; close modal on success; show toast notification
- Build the Task Card component: displays Title, Category badge, Status badge (color-coded: Pending → amber, In Progress → blue, Completed → green), Deadline with visual urgency indicator if approaching or overdue, Priority score displayed subtly. Include Edit and Delete action buttons/icons.
- Build the Edit Task functionality: clicking edit opens a pre-filled modal/drawer with current task values; on submit dispatches update task thunk; updates Redux state and UI without page refresh
- Build Delete Task: clicking delete shows a Chakra UI confirmation dialog; on confirm dispatches delete thunk; removes from Redux state immediately for optimistic UI
- On page load (or when navigating to tasks), dispatch fetchTasks thunk to load from backend; show loading skeleton while fetching
- Tasks must always display sorted by priority (highest first) — this ordering comes from the API response
- Add a Logout button in the navbar/sidebar that clears Redux auth state and redirects to login

After completion, confirm:
- All 4 CRUD operations work end-to-end (create, read, update, delete)
- Tasks appear immediately after creation without page refresh
- Status badges are visually distinct and color-coded
- Edit pre-populates form correctly
- Delete requires confirmation
- Logout clears session and redirects
```

---

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODULE 2 — Smart Task Prioritization Engine
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## 🟠 Phase 2.1 — Backend Priority Engine Enhancement

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (Module 1 complete):
- Full authentication system is working (Register, Login, JWT middleware)
- Task CRUD APIs are functional with a basic priority score placeholder
- Frontend is connected to backend for auth and task CRUD
- Priority score exists in the Task model but uses a basic calculation

Context from Reference — Priority Rules to implement now:
1. Overdue tasks (deadline has passed AND status is not Completed) → HIGHEST priority. Score = 10000 + (number of days overdue × 100). This ensures they always appear first.
2. Tasks due within 1 day → Score = 5000
3. Tasks due within 3 days → Score = 3000
4. Tasks due within 7 days → Score = 1000
5. Tasks with no deadline → Score = 10 (very low, treated as non-urgent)
6. Completed tasks → Score = 0 (always lowest — they're done)
7. Tiebreaker: when two tasks have equal priority score, the one with the earlier createdAt timestamp comes first (FIFO)
- Priority must NEVER be set manually by users
- Priority must be recalculated on every fetch and every update — never stored as a permanent static value in the database (store it for sorting convenience but always recalculate on read)

Your task in this phase:
Enhance the backend priority engine to fully implement all rules:
- Update the priority calculation utility function to implement all 7 rules above precisely
- Update the GET /api/tasks endpoint: after fetching tasks from MongoDB, recalculate priorityScore for every task in memory using the updated utility before sorting and returning. This ensures the score is always fresh even if time has passed since last update.
- Update the POST /api/tasks and PUT /api/tasks/:id endpoints to also recalculate priority on write
- Add a dedicated internal utility that can also recalculate and return tasks sorted by priority + createdAt tiebreaker — this will be reused in Module 3 when broadcasting updated task lists via Socket.io
- Ensure the response for every task includes: the calculated priorityScore, a derived field called priorityLevel (string: "overdue", "critical", "high", "medium", "low", "none") based on the score ranges — the frontend will use this for highlighting

After completion, confirm:
- Overdue tasks always appear first regardless of other tasks
- Completed tasks always appear last
- FIFO tiebreaker works for equal-score tasks
- priorityLevel field is returned with every task
- Recalculation happens fresh on every GET request
```

---

## 🟠 Phase 2.2 — Frontend Priority Display & Visual Highlighting

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (2.1):
- Backend now returns fully accurate priorityScore and priorityLevel ("overdue", "critical", "high", "medium", "low", "none") for every task
- Tasks from the API are already sorted by priority (highest first) with FIFO tiebreaker
- Frontend task cards exist from Phase 1.6 but show priority only as a number

Context from Reference:
- Frontend must always display tasks in priority order — use the order returned by API, do not re-sort on frontend
- Visual requirements:
  - Overdue tasks: visually distinct — red/orange tinted card border or glow, overdue badge
  - Critical (due within 1 day): warm orange accent indicator
  - High (due within 3 days): yellow/amber indicator
  - Medium/Low: subtle indicator
  - Completed: muted/dimmed card appearance
- Priority value must be visible on the card (can be subtle — small badge or label)
- No manual refresh should be needed — list order always reflects current priority

Your task in this phase:
Update the Task Card component and Tasks page to fully reflect the priority engine visually:
- Update the Task Card to use the priorityLevel field from the task data to apply conditional visual styling: left border accent color, card background tint, or glow effect matching priority level. Use Chakra UI's style props and conditional logic — no hardcoded styles.
- Add a priority indicator to each card: a colored badge or icon showing the priorityLevel label (e.g., "Overdue", "Critical", "High") with appropriate colors matching the dark theme
- For overdue tasks specifically, add a more prominent visual treatment: a warning badge, a subtle pulsing animation on the priority indicator, or a tinted card background
- Completed tasks should be visually de-emphasized: reduced opacity, strikethrough on title, or a distinct muted style
- Ensure the task list renders in the exact order returned by the API (priority sorted) — add a comment in the code noting this ordering must never be changed by client-side re-sorting
- Add a simple legend or filter bar above the task list allowing users to filter by status (All / Pending / In Progress / Completed) — filtering dispatches to Redux tasksSlice filters state and the displayed list filters accordingly without a new API call (filter the items already in Redux)

After completion, confirm:
- Overdue tasks visually stand out at the top of the list
- Priority level labels are visible on each card
- Completed tasks appear muted at the bottom
- Status filter works without re-fetching from API
- No manual page refresh is needed at any point
```

---

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODULE 3 — Real-Time Task Updates
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## 🔴 Phase 3.1 — Backend Socket.io Integration

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phases (Modules 1 & 2 complete):
- Backend has a base HTTP server (created in Phase 1.1 deliberately to support Socket.io)
- All task CRUD APIs (GET, POST, PUT, DELETE /api/tasks) are working
- Priority calculation utility is complete and accurate
- Frontend has socket.io-client installed (from Phase 1.4) but not yet connected

Context from Reference — Socket.io Events to implement:
| Event | Direction | Payload |
|---|---|---|
| task:created | Server → All clients | full task object |
| task:updated | Server → All clients | full updated task object |
| task:deleted | Server → All clients | { taskId: string } |
| analytics:updated | Server → All clients | analytics data object (will be populated in Module 4) |

- Updates must reach all clients within 1 second
- Multiple users must see each other's events in real-time

Your task in this phase:
Integrate Socket.io into the backend and emit events on every task mutation:
- Attach Socket.io to the existing HTTP server with CORS configured to allow the frontend origin
- Create a socket utility/helper that stores the io instance and exposes an emitToAll(event, data) function — this decouples socket emission from the controllers so controllers don't need direct io access
- Update the POST /api/tasks controller: after successfully creating a task, call emitToAll("task:created", createdTask)
- Update the PUT /api/tasks/:id controller: after successfully updating a task, call emitToAll("task:updated", updatedTask) — pass the fully recalculated task object including fresh priorityScore and priorityLevel
- Update the DELETE /api/tasks/:id controller: after successfully deleting a task, call emitToAll("task:deleted", { taskId: id })
- Add connection logging: log when a client connects and disconnects (with socket id)
- The analytics:updated event will be wired in Phase 4.1 — add a placeholder comment in the socket utility for it now

After completion, confirm:
- Socket.io server starts alongside the Express server without errors
- Client connections and disconnections are logged on the server
- Task create, update, and delete operations emit the correct socket events (verify via server logs)
- CORS allows the frontend origin to connect via WebSocket
```

---

## 🔴 Phase 3.2 — Frontend Socket.io Client & Real-Time Redux Updates

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (3.1):
- Backend emits socket events: task:created, task:updated, task:deleted on every task mutation
- socket.io-client is already installed in the frontend (Phase 1.4)
- Redux tasksSlice manages the tasks array in state
- Frontend currently only updates Redux state via API thunk responses — not yet listening to socket events

Context from Reference:
- Updates must reflect in UI within 1 second
- No page refresh is allowed
- Multiple connected users must see each other's task changes
- Socket connection should be established after user logs in and torn down on logout

Your task in this phase:
Integrate Socket.io client into the React frontend and wire it to Redux for real-time updates:
- Create a socket utility file that initializes the socket.io-client connection to the backend URL (from environment variable). The socket should NOT auto-connect — it will be manually connected/disconnected based on auth state.
- Create a custom React hook (e.g., useSocket) that: connects to the socket server when the user is authenticated, registers event listeners for task:created, task:updated, task:deleted, and analytics:updated (listener for analytics:updated will be wired in Phase 4.2 — add placeholder now), and disconnects when called with cleanup or when auth state changes to logged out
- task:created listener: dispatch an action to add the new task to Redux tasks.items, maintaining sort order (insert at the correct position by priorityScore, or re-sort the array after insertion)
- task:updated listener: dispatch an action to replace the matching task in Redux tasks.items with the updated task object, then re-sort the array by priorityScore to maintain order
- task:deleted listener: dispatch an action to remove the task with matching taskId from Redux tasks.items
- Wire the useSocket hook in the top-level layout or App component so it activates immediately after authentication
- Add the required synchronous Redux reducers to tasksSlice for: addTask, updateTask, removeTask — these are dispatched by the socket listeners (separate from the async thunks used for API calls)
- Handle edge cases: if the same user has two browser tabs open, both must update in real-time without duplication

After completion, confirm:
- Opening two browser tabs: creating a task in tab 1 appears in tab 2 within 1 second without refresh
- Updating a task status in tab 1 reflects in tab 2 immediately
- Deleting a task in tab 1 removes it from tab 2 immediately
- Socket connects on login and disconnects on logout
- No duplicate tasks appear in the list
```

---

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODULE 4 — Productivity Insights & Activity Tracking
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## 🟢 Phase 4.1 — Backend Analytics API & Socket Emission

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phases (Modules 1, 2 & 3 complete):
- All task CRUD is working with real-time socket events
- Socket utility (emitToAll) exists with a placeholder for analytics:updated
- Backend has full access to all user tasks in MongoDB
- Each task has: status, category, createdAt, deadline, priorityScore

Context from Reference — Analytics metrics to calculate (all per authenticated user):
- totalTasks: count of all tasks
- completedTasks: count of tasks with status === "Completed"
- pendingTasks: count of tasks with status === "Pending"
- inProgressTasks: count of tasks with status === "In Progress"
- overdueTasks: count of tasks where deadline < now AND status !== "Completed"
- completedToday: count of tasks with status "Completed" and updatedAt date matching today's date
- mostActiveCategory: the category string that appears most among the user's tasks
- insights: array of human-readable strings derived from the above, e.g. "You completed 3 tasks today", "Most active in: Work", "You have 2 overdue tasks"

Your task in this phase:
Build the analytics backend endpoint and wire it to Socket.io:
- Create the GET /api/analytics endpoint (protected by JWT middleware): query all tasks belonging to req.user.id from MongoDB; calculate all metrics listed above; build the insights array with meaningful human-readable strings; return the full analytics object
- For mostActiveCategory: group tasks by category and find the one with the most tasks (if no tasks, return "None")
- For completedToday: compare the task's updatedAt date to today's date (use timezone-safe comparison)
- Wire the analytics:updated socket event: after every task create, update, or delete (in the respective controllers), recalculate analytics for the affected user and emit emitToAll("analytics:updated", analyticsData)
- Add the analytics route mounted under /api/analytics and protect it with JWT middleware

After completion, confirm:
- GET /api/analytics returns all required metrics correctly
- Insights array contains meaningful human-readable strings
- After creating/updating/deleting a task, the analytics:updated socket event fires with fresh data
- Analytics are user-specific (queried by req.user.id)
```

---

## 🟢 Phase 4.2 — Frontend Analytics Dashboard UI & Real-Time Updates

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (4.1):
- Backend /api/analytics returns: totalTasks, completedTasks, pendingTasks, inProgressTasks, overdueTasks, completedToday, mostActiveCategory, insights[]
- Backend emits analytics:updated socket event after every task mutation
- Frontend socket hook has a placeholder for analytics:updated listener
- useSocket hook exists and manages socket connection lifecycle

Context from Reference:
- Dashboard must update in real-time as tasks change
- Insights must be user-specific and dynamically calculated
- Design: dark, premium — stat cards with glowing number display, clean labels, insight strings displayed as styled text callouts

Your task in this phase:
Build the complete Productivity Insights Dashboard page:
- Add an analyticsSlice to the Redux store (or add analytics state to tasksSlice) with: data (the analytics object), loading, error
- Create a fetchAnalytics async thunk that calls GET /api/analytics and stores the result in Redux
- Wire the analytics:updated socket listener in useSocket hook: when the event fires, dispatch an action to update the analytics state in Redux with the incoming data (no additional API call needed — the data comes with the socket event)
- Build the Dashboard / Analytics page with:
  - A stats grid showing 5 stat cards: Total Tasks, Completed, Pending, In Progress, Overdue — each card with a large number, label, and a subtle color accent matching its semantic meaning (green for completed, amber for pending, red for overdue, etc.)
  - A "Completed Today" highlight — displayed more prominently, perhaps a larger card or feature section
  - An "Insights" section displaying the insights array as styled callout text blocks (e.g., each insight in a distinct card or row with a subtle icon)
  - A "Most Active Category" display — badge or highlighted label
  - The dashboard should feel like a command center — dark, data-rich but clean and readable
- On page load, dispatch fetchAnalytics to populate the dashboard
- The dashboard must update live: when tasks change (via socket), the analytics:updated event automatically refreshes the numbers without any user action
- Add loading skeleton states for the analytics cards while fetching

After completion, confirm:
- All 5 stat cards display correct numbers from the API
- Completing a task (in another tab) causes the dashboard numbers to update within 1 second
- Insights strings are meaningful and display correctly
- Most Active Category updates when tasks are added or categorized
- Dashboard is fully responsive (mobile + desktop)
```

---

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODULE 5 — Polish, UX & Deployment
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## ⚪ Phase 5.1 — UI Polish & UX Refinement

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phases (All 4 Modules complete):
- Auth, Task CRUD, Priority Engine, Real-Time Socket updates, and Analytics Dashboard are all working
- The full application is functional end-to-end
- This phase is purely UI polish and UX improvements — no new features

Context from Reference:
- Design aesthetic: dark premium SaaS/DeFi-inspired. Soft glowing gradients. Frosted glass cards. Bold typography. Teal/green and white accents.
- The app must be fully responsive (desktop + mobile)
- Clean, minimal, focused on usability

Your task in this phase:
Polish the entire application UI and improve UX details:
- Audit every page (Login, Register, Tasks, Dashboard) against the design aesthetic. Ensure consistency: same dark background tone, same font, same spacing system, same button styles.
- Add a proper application navigation: sidebar (desktop) that collapses to a bottom nav or hamburger (mobile). Navigation items: Dashboard/Insights, Tasks, Logout. Show the logged-in user's name in the nav.
- Add Chakra UI toast notifications for: task created successfully, task updated, task deleted, login success, register success, and any error states. Toasts should appear in a consistent position (top-right) and auto-dismiss.
- Add empty state designs: if a user has no tasks, show a friendly illustrated or icon-based empty state with a "Create your first task" call-to-action button.
- Add loading skeleton screens (Chakra UI Skeleton) for the task list and analytics cards while data is fetching.
- Ensure all form inputs have proper validation messages shown inline (not just toast).
- Add a real-time connection status indicator somewhere subtle (e.g., a small dot in the nav: green = connected, grey = reconnecting). Wire it to socket connect/disconnect events.
- Ensure all interactive elements have hover states and smooth transitions (Chakra UI transition props).
- Review mobile responsiveness on all pages and fix any layout issues.

After completion, confirm:
- All pages are visually consistent with the dark premium aesthetic
- Navigation works correctly on both mobile and desktop
- Empty states appear when no tasks exist
- Toast notifications appear for all actions
- Real-time connection indicator is visible
- No layout breaks on mobile screen sizes
```

---

## ⚪ Phase 5.2 — Deployment

```
You are building "TaskFlow" — a real-time MERN productivity management system.

Context from Previous Phase (5.1):
- The entire application is polished and working locally
- Backend: Node.js + Express + MongoDB + Socket.io
- Frontend: React + Redux + Chakra UI + Socket.io client

Context from Reference:
- Deployment targets: Frontend → Vercel or Netlify | Backend → Render or Railway | Database → MongoDB Atlas
- Submissions without a live URL will be rejected
- Localhost links are not acceptable

Your task in this phase:
Deploy the complete application to production:
- Set up MongoDB Atlas: create a free-tier cluster, create a database user, whitelist all IPs (0.0.0.0/0 for deployment), copy the connection string
- Deploy the backend to Render (recommended) or Railway:
  - Set all environment variables: MONGODB_URI (Atlas connection string), JWT_SECRET, PORT, CLIENT_ORIGIN (the frontend's production URL)
  - Ensure the start command is correct
  - Verify the backend health-check route responds publicly
  - Note the live backend URL
- Deploy the frontend to Vercel (recommended) or Netlify:
  - Set environment variable: VITE_API_URL or REACT_APP_API_URL pointing to the live backend URL
  - Ensure Socket.io client connects to the live backend URL (not localhost)
  - Verify the build completes without errors
  - Note the live frontend URL
- After deployment, update the backend's CLIENT_ORIGIN environment variable with the live frontend URL (for CORS)
- Smoke test the live application:
  - Register a new user on the live URL
  - Create, update, and delete tasks
  - Open the app in two browser tabs — verify real-time sync works on production
  - Check the analytics dashboard updates in real-time
- Prepare the GitHub repository: ensure all code is committed with clear commit messages, no .env files committed, a proper README.md explaining the project, setup instructions, and the live URL

After completion, deliver:
- Live frontend URL (Vercel/Netlify)
- Live backend URL (Render/Railway)
- GitHub repository URL
- Confirmation that real-time Socket.io works on the live deployment
```

---

---

## 📎 Quick Phase Reference

| Phase | Module | What's Built |
|---|---|---|
| 1.1 | M1 | Backend setup, MongoDB connection |
| 1.2 | M1 | User model, Register & Login APIs, JWT middleware |
| 1.3 | M1 | Task model, CRUD APIs, basic priority score |
| 1.4 | M1 | React + Redux + Chakra UI setup |
| 1.5 | M1 | Login & Register pages UI |
| 1.6 | M1 | Task CRUD UI, dashboard shell |
| 2.1 | M2 | Full priority engine on backend |
| 2.2 | M2 | Priority visual display on frontend |
| 3.1 | M3 | Socket.io server, event emission |
| 3.2 | M3 | Socket.io client, real-time Redux updates |
| 4.1 | M4 | Analytics API + socket emission |
| 4.2 | M4 | Analytics dashboard UI + real-time |
| 5.1 | Polish | UI consistency, toasts, responsiveness |
| 5.2 | Deploy | MongoDB Atlas, Render, Vercel |

---

> ⚠️ **Golden Rule:** Always re-read `reference.md` at the start of every prompt session. If anything in your implementation contradicts the reference, the reference wins.
