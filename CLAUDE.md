# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aura is a web app that turns discipline into a game with real consequences. Users set goals, place bets in an internal currency, and confirm completion with physical proof. Success grows their digital garden—Aura—while inaction harms it. The garden reflects mental health, skills, social connections, and fears, changing visually with every action. Aura combines gamification, economy, and social interaction, motivating through risk and visible progress. Its game-like interface relaxes, reduces anxiety, and makes discipline enjoyable, ensuring every effort matters. Real action counts—AI can't run a mile or face fear for you.

Stack: React (Vite) + Tailwind v4 + Framer Motion frontend, FastAPI + SQLite backend.

## Commands

### Frontend (run from repo root)
```bash
npm install
npm run dev       # dev server on http://localhost:3000
npm run build     # production build to dist/
npm run lint      # ESLint
npm run preview   # preview production build
```

### Backend (must run from `backend/` directory — `aura.db` is created there)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py              # starts on http://0.0.0.0:8000
```

./hooks folder is for reusable hooks

Alternative backend start with hot reload:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API docs: `http://127.0.0.1:8000/docs`  
Demo credentials: `demo@aura.app` / `demo123`

### Environment variables
- `VITE_API_URL` — frontend: full API base URL with `/api` suffix (e.g. `http://127.0.0.1:8000/api`). Omit to auto-derive from `window.location.hostname:8000/api`.
- `CORS_ORIGINS` — backend: comma-separated extra allowed origins for production. Local origins and `*.onrender.com` are allowed by default.

## Architecture

### Frontend state model (`src/context/`)

Two React contexts are the backbone of the app:

**`AuthContext.jsx`** — Manages login/register/logout via the FastAPI backend. User object (`uid`, `username`, `email`, `displayName`) is persisted in `localStorage` as `aura-user`.

**`AppContext.jsx`** — Central state for all domain data: `garden`, `wallet`, `tasks`, `moods`, `fears`, `reviews`, `notifications`. On mount it loads from the FastAPI backend (3 separate requests: user data, tasks, fears). If the backend is unreachable it falls back to `localStorage` (`aura-data-{uid}`). State mutations call `syncItem()` immediately for tasks/fears; garden/wallet/moods/notifications are debounce-saved (1 s) via a `POST /api/user/data` call.

### Garden data model

```
garden = {
  roots: { level, xp, streak, lastCheckIn },   // mental health zone
  stems: { level, xp, streak, totalTasks },     // skills/study zone
  buds:  { level, xp, karma, activities },      // social zone
  weeds: { removed, active },                   // fears zone
  decorations: [{ id, type, emoji, position }]  // shop items
}
```

Garden health (0-100) is a pure function of this object — see `src/utils/economy.js:calculateGardenHealth`.

### Token economy (`src/utils/economy.js`)

- Users start with 100 tokens (`INITIAL_BALANCE`)
- Completing a task returns `stake × 1.5 × (1 + streakBonus)` tokens
- Failing a task loses the staked amount; 30% goes to charity, 70% to winner pool
- XP per task: 25 / mood: 10 / fear conquered: 50
- `calculateReward(stake, streakDays)` is the canonical reward function used by `AppContext.completeTask`

### Anti-AI Proof System (`src/utils/proofSystem.js`)

`generateProofChallenge(category)` picks random gesture + color + background + category-specific item requirements. Returns a challenge string plus `expiresIn: 300` seconds. `evaluateProof(votes)` approves if 2/3 majority with ≥3 peer reviews; otherwise returns `'pending'`.

### Task lifecycle

`active → pending_proof → pending_review → completed | failed`

Tasks are synced individually to `POST /api/tasks` on every status transition.

### Backend (`backend/main.py`)

Single-file FastAPI app with aiosqlite. Four tables: `users`, `user_data`, `tasks`, `fears`. User dynamic state (garden, wallet, moods, notifications) is stored as JSON blobs in `user_data`. Authentication uses SHA-256 password hashing (no JWT; session state lives in frontend `localStorage`).

Key routes:
- `POST /api/register`, `POST /api/login`
- `GET/POST /api/user/data/{username}`
- `GET /api/tasks/{username}`, `POST /api/tasks`
- `GET /api/fears/{username}`, `POST /api/fears`

### Deployment

`render.yaml` defines a Render Blueprint with two services: `aura-backend` (Python web service from `backend/`) and `aura-frontend` (static site). Set `VITE_API_URL` in the frontend's build environment to point to the deployed backend URL.

### Note on Firebase

`src/config/firebase.js` initialises Firebase Auth, Firestore, and Storage, but the app currently uses the FastAPI backend for authentication — Firebase is not actively wired to auth flows. Configure `VITE_FIREBASE_*` env vars only if you intend to add Firebase-backed features.
