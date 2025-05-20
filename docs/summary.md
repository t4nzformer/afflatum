# Afflatum – MVP Project Summary (Updated)

# TL;DR:
   
  Afflatum is a social platform where users share their creative processes in structured project folders. The backend is Django + PostgreSQL with JWT auth and REST API. The frontend is React + Vite + Tailwind (manually integrated via CLI). MVP includes login, profiles, projects, comments, and likes. Tailwind utilities were manually added due to CLI/config issues. Next step: build login form and wire it to the API.


## 1. Project Structure

- Root folder: `Afflatum/`
- Git repo initialized and pushed to GitHub
- Backend in `backend/`:
  - Django project: `config`
  - Django app: `core`
- Frontend in `frontend/`:
  - React + Vite + Tailwind (manually wired using Tailwind CLI)

---

## 2. Backend Environment Setup

- Python virtual environment (`venv`)
- Installed:
  - Django
  - Pillow
  - PostgreSQL (via Homebrew)
  - python-decouple
  - Django REST Framework (DRF)
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

- `UserProfile`: OneToOne with `User`; includes bio, profile image
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
- Working endpoints:
  - `/api/projects/`
  - `/api/comments/`
  - `/api/likes/`
  - `/api/profiles/`
  - `/api/register/`
  - `/api/token/` (JWT login)
- Authentication enforced on create/update/delete
- `IsOwnerOrReadOnly` permission in use

---

## 7. Authentication

- JWT auth using `djangorestframework-simplejwt`
- Login: `POST /api/token/`  
- Refresh: `POST /api/token/refresh/`
- Custom registration endpoint: `POST /api/register/`
- `UserProfile` auto-created via `post_save` signal

---

## 8. Frontend (React + Vite + Tailwind CLI)

- Vite + React (TypeScript) project set up in `frontend/`
- Tailwind installed manually via CLI:
  - Compiles from `tailwind.input.css` to `src/index.css`
  - Uses local binary `./tailwindcss`
  - Manually safelisted utility classes
- Tailwind working after manually writing critical CSS into `index.css`
- React confirmed rendering with centered gradient layout

---

## ➕ Next Steps

- Build login form in React to POST to `/api/token/`
- Store JWT in `localStorage`
- Add logged-in state context + authenticated requests
- Design user feed, project page, profile view
- Add `Follower` model and `Inbox` messaging (MVP scope)

---

<!-- Context for future GPT sessions -->
> Afflatum is a Django + React + Tailwind project for sharing creative processes (not final products). Backend includes JWT-secured models: UserProfile, Project, Comment, Like. Frontend uses React + Vite + Tailwind (manual CLI). Tailwind config had to be manually overridden via injected utility CSS. Next up: login form + authenticated frontend integration.
