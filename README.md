# Tasker — MERN Task Tracker

A full-stack Task Tracker web application built with the **MERN** stack (MongoDB, Express, React, Node.js).

## Features

- ✅ User accounts — register / login with JWT auth (bcrypt-hashed passwords)
- ✅ Per-user tasks — every task is scoped to its owner
- ✅ Create, View, Update & Delete tasks (full CRUD)
- ✅ REST API with proper HTTP verbs & status codes
- ✅ MongoDB integration via Mongoose
- ✅ Server-side & client-side form validation
- ✅ Responsive UI, custom-designed (light + dark)
- ✅ Dynamic updates without page refresh
- ✅ Public deployment (coming in Step 4)

> **Auth note:** there's no email verification or password reset (by design for
> this build) — accounts are email + password only. A seeded demo login is
> available: **`demo@tasker.app` / `demo1234`** (run `npm run seed`).

## Design — "Ink & Ember"

The UI is a bespoke design system, not a component-kit template:

- **Palette:** warm paper/graphite neutrals with a single ember accent
  (`#E8622C` / `#F4743E`), plus considered status hues. First-class light **and**
  dark themes (follows system, remembers your choice).
- **Type:** three faces with strict roles — **Fraunces** (display serif) for
  titles, **Inter** for UI, **JetBrains Mono** for metadata.
- **Signature — the "Ember Check":** completing a task sweeps an ember arc
  around the checkbox like a lit fuse, strokes in a checkmark, draws an ink
  strike across the title, then files the task to the bottom.
- **Custom components:** no native `<select>` or `<input type=date>` — custom
  listbox dropdown, popover calendar, theme switch, and completion control.
- **Micro-interactions:** spring/ease-out motion, drag-to-reorder with an ember
  insertion indicator (order persisted locally), designed empty/loading/error
  states. Respects `prefers-reduced-motion` and full keyboard navigation.

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React.js                |
| Backend   | Node.js + Express.js    |
| Database  | MongoDB (Mongoose ODM)  |

## Project Structure

```
tasker/
├── backend/            # Express REST API + MongoDB
│   ├── config/         # Database connection
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Route handlers / business logic
│   ├── routes/         # API route definitions
│   ├── server.js       # App entry point
│   └── .env.example    # Environment variable template
└── frontend/           # React app (Vite)
    ├── src/
    │   ├── api/        # Axios API layer
    │   ├── components/ # TaskForm, TaskList, TaskItem
    │   ├── App.jsx     # State + CRUD orchestration
    │   └── index.css   # Styles
    └── vite.config.js  # Dev server + /api proxy
```

## Build Roadmap

- [x] **Step 1** — Project scaffolding + backend REST API + MongoDB
- [x] **Step 2** — React frontend (Vite) with Axios API layer + dynamic updates
- [x] **Step 3** — Responsive UI + form validation polish (filters, search, counters)
- [ ] **Step 4** — Deploy frontend & backend to public URLs

## Getting Started (Backend)

```bash
cd backend
npm install
cp .env.example .env      # then fill in your MongoDB URI
npm run dev               # starts server with nodemon
```

Server runs on `http://localhost:5000` by default.

Optionally seed sample data (clears the collection first):

```bash
npm run seed
```

## Getting Started (Frontend)

```bash
cd frontend
npm install
npm run dev               # starts Vite dev server on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend on port 5000, so
run the backend alongside it. For production, set `VITE_API_URL` to the
deployed backend URL (see `frontend/.env.example`).

## REST API Endpoints

### Auth (public)

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| POST   | `/api/auth/register`  | Create an account → `{token,user}` |
| POST   | `/api/auth/login`     | Log in → `{token,user}`          |
| GET    | `/api/auth/me`        | Current user (requires token)    |

### Tasks (require `Authorization: Bearer <token>`)

| Method | Endpoint          | Description                       |
|--------|-------------------|-----------------------------------|
| GET    | `/api/tasks`      | List the current user's tasks     |
| GET    | `/api/tasks/:id`  | Get one of the user's tasks       |
| POST   | `/api/tasks`      | Create a task (owned by the user) |
| PUT    | `/api/tasks/:id`  | Update the user's task            |
| DELETE | `/api/tasks/:id`  | Delete the user's task            |

Task routes are protected: requests without a valid token get `401`, and every
query is scoped to the authenticated user so tasks never leak between accounts.

### Task shape

```json
{
  "title": "Finish assignment",
  "description": "Complete the MERN task tracker",
  "status": "pending",
  "dueDate": "2026-07-15T00:00:00.000Z"
}
```

`status` is one of: `pending`, `in-progress`, `completed`.
