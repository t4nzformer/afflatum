# Afflatum – MVP Project Summary (Updated)

# TL;DR:
Afflatum is a social platform where users share their creative processes in structured project folders. The backend is Django + PostgreSQL with JWT auth and REST API. The frontend is React + Vite + Tailwind. MVP includes login, profiles, projects, comments, and likes. Tailwind is now correctly configured with `tailwind.config.js`, `postcss.config.js`, and `index.css` auto-generated via CLI using a watch command. Auth is handled via short-lived access tokens with automatic refresh using long-lived refresh tokens. Profile data is dynamically loaded from the API and rendered in a mobile-first UI inspired by Instagram profiles.

---

## 1. Project Structure

- Root folder: `Afflatum/`
- Git repo initialized and pushed to GitHub
- Backend in `backend/`:
  - Django project: `config`
  - Django app: `core`
- Frontend in `frontend/`:
  - React + Vite + Tailwind (configured via CLI with proper build pipeline)

---

## 2. Backend Environment Setup

- Python virtual environment (`venv`)
- Installed:
  - Django
  - Pillow
  - PostgreSQL (via Homebrew)
  - python-decouple
  - Django REST Framework (DRF)
  - djangorestframework-simplejwt
  - django-cors-headers
- `.env` file handles all secrets
- `.gitignore` excludes `.env`

---

## 3. Database & Django Integration

- PostgreSQL database configured:
  - DB: `afflatum`
  - User: `afflatum_user`
  - Password: `afflatum_pass`
- Integrated into Django via `settings.py` using `decouple`
- Migrations applied

---

## 4. Core Models (`core/models.py`)

- `UserProfile`: OneToOne with `User`; includes `bio`, `profile_image`
- `Project`: linked to user; includes type, title, README, cover image, and JSON `details`
- `Comment`: linked to user + project
- `Like`: linked to user + project

---

## 5. Admin Setup

- All models registered in `core/admin.py`
- Superuser created and verified
- Admin panel accessible via `/admin/`

---

## 6. API Endpoints (DRF)

- DRF configured in `settings.py`
- ViewSets and serializers built for all models
- Routing via `DefaultRouter`
- Custom route:
  - `/api/profiles/me/` (returns current user's profile)
- Working endpoints:
  - `/api/projects/`
  - `/api/comments/`
  - `/api/likes/`
  - `/api/profiles/`
  - `/api/profiles/me/`
  - `/api/register/`
  - `/api/token/`
  - `/api/token/refresh/`
- Authentication enforced on create/update/delete
- `IsOwnerOrReadOnly` permission in use

---

## 7. Authentication

- JWT auth using `djangorestframework-simplejwt`
- Access token: short-lived (1 minute for dev testing)
- Refresh token: long-lived
- Frontend uses `useAuthRefresh()` to refresh access tokens automatically
- Login: `POST /api/token/`
- Refresh: `POST /api/token/refresh/`
- Custom registration endpoint: `POST /api/register/`
- `UserProfile` auto-created via `post_save` signal

---

## 8. Frontend (React + Vite + Tailwind)

- Vite + React (TypeScript) project set up in `frontend/`
- Tailwind now fully integrated with:
  - `tailwind.config.js` (correct `content` paths + optional `safelist`)
  - `postcss.config.js` created via `npx tailwindcss init -p`
  - `tailwind.input.css` compiled to `src/index.css` using:
    ```
    ./tailwindcss -i ./tailwind.input.css -o ./src/index.css --watch
    ```
- `index.css` is no longer manually edited — styles are generated via CLI
- Font set to Helvetica globally
- All Tailwind classes now available in JSX without safelisting
- UI built mobile-first and styled to mimic Instagram profile layout
- Scrollable highlight reels work with horizontal overflow
- Profile page loads real data from backend API (`/api/profiles/me/`)
- Auth handled cleanly via `useAuthRefresh()` and `useContext()`

---

## ➕ Next Steps

- Load real user projects into profile grid
- Enable profile image uploads (Django media support is working)
- Add ability to update bio and profile image
- Design project detail view
- Build follower/following system
- Add inbox-style messaging (MVP scope)

---

<!-- Context for future GPT sessions -->
> Afflatum is a Django + React + Tailwind project for sharing creative processes (not final products). Backend includes JWT-secured models: UserProfile, Project, Comment, Like. Frontend uses React + Vite + Tailwind with a functional CLI pipeline. Auth includes short-lived access tokens with automatic refresh. Profile data is dynamically loaded. UI is mobile-first and mimics Instagram profile layout, with real project integration and editing features planned.
