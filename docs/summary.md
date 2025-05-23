# Afflatum – MVP Project Summary (Updated)

## TL;DR
Afflatum is a social platform where users share their creative processes inside structured project folders called **Afflations**. Each Afflation is a user-generated container (like a folder) that can hold subfolders such as "Manifesto", "Process", etc. The stack is Django + PostgreSQL backend with JWT-secured REST API, and React + Vite + Tailwind frontend. The UI mimics Instagram profiles and supports dynamic folder creation via modals. Users can create, navigate, and delete both Afflations and subfolders. JWT tokens are refreshed automatically.

---

## 1. Project Structure

- Root folder: `Afflatum/`
- Git repo initialized and pushed to GitHub
- Backend in `backend/`:
  - Django project: `config`
  - Django app: `core`
- Frontend in `frontend/`:
  - React + Vite + Tailwind (via CLI)

---

## 2. Backend Environment

- Virtual environment: `venv`
- Installed:
  - Django
  - Pillow
  - PostgreSQL (via Homebrew)
  - python-decouple
  - Django REST Framework
  - djangorestframework-simplejwt
  - django-cors-headers
- Secrets in `.env`, excluded via `.gitignore`

---

## 3. Database Setup

- PostgreSQL DB: `afflatum`
- User: `afflatum_user`, Password: `afflatum_pass`
- Connected via `settings.py` (using `decouple`)
- Migrations complete

---

## 4. Core Models

- `UserProfile`: OneToOne with `User`; includes `bio`, `profile_image`
- `Project`: called "Afflation", linked to `User`; includes `title`, `type`, `cover_image`, `readme`, and `details` (JSON of subfolders)
- `Comment`: linked to `User` + `Project`
- `Like`: linked to `User` + `Project`

---

## 5. Admin Setup

- All models registered in `core/admin.py`
- Admin panel live at `/admin/`
- Superuser created

---

## 6. API Endpoints

- Django REST Framework + ViewSets
- All endpoints auth-protected with `IsOwnerOrReadOnly`
- Routers + custom endpoints:
  - `/api/projects/`
  - `/api/comments/`
  - `/api/likes/`
  - `/api/profiles/`
  - `/api/profiles/me/`
  - `/api/projects/mine/`
  - `/api/register/`
  - `/api/token/`, `/api/token/refresh/`

---

## 7. Authentication

- JWT via `djangorestframework-simplejwt`
- Short-lived access token (1 hour), auto-refreshed using refresh token
- Token endpoints:
  - `POST /api/token/`
  - `POST /api/token/refresh/`
- `useAuthRefresh()` auto-refreshes tokens in frontend
- `UserProfile` created automatically with `post_save`

---

## 8. Frontend (React + Vite + Tailwind)

- Frontend: React (TypeScript), Vite, Tailwind
- Tailwind config:
  - `tailwind.config.js` with correct `content` paths
  - `postcss.config.js` via `npx tailwindcss init -p`
  - Styles built via:
    ```bash
    ./tailwindcss -i ./tailwind.input.css -o ./src/index.css --watch
    ```
- Responsive, mobile-first layout
- Auth managed via React Context
- Profile and Afflation pages dynamically load from API
- Context menus for delete/rename on right-click
- Folder creation handled via modal UI

---

## 9. Afflation System

- Afflations are projects created by users
- Each Afflation can have 0–5 subfolders:
  - Manifesto, Inspirations, Process, Thoughts, Result
- All subfolders are initialized as arrays (`[]`)
- Users can add these via a "+" menu
- Each subfolder appears as a grid square
- Right-click allows deletion (rename coming soon)
- UI reuses Instagram-style profile layout

---

## ➕ Next Steps

- Add rename functionality to context menu
- Improve media uploads (cover images)
- Add "follow" feature and messaging
- Explore content inside subfolders (rich text, images, etc.)
- Polish responsive layout for all breakpoints
- Finalize public vs private profile views

---

<!-- Context for future GPT sessions -->
> Afflatum is a Django + React + Tailwind platform where users document creative processes. Afflations = projects; subfolders = sections. Auth is JWT. Frontend uses modal UI for creation, right-click menus for management, and mimics Instagram layout. All state is API-driven.
