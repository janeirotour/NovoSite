---
name: Admin authentication
description: How admin auth works in the Janeiro Tour project
---

- Session-based auth via `express-session` + `SESSION_SECRET` env var
- Default credentials: username `admin`, password `admin123` (bcrypt hash in DB)
- Login endpoint: `POST /api/admin/login`
- Auth check: `GET /api/admin/me` → 401 if not logged in
- Frontend login route: `/admin` (page: `src/pages/admin-login.tsx`)
- After login → redirects to `/admin/dashboard` (page: `src/pages/admin-dashboard.tsx`)
- Admin dashboard is a standalone page (no MainLayout, its own header)

**Why:** Admin is fully session-based — no JWT, no Clerk. Session cookie must be present for any /api/admin/* route.
