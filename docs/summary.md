# Afflatum – MVP Project Summary (Updated)

## TL;DR
Afflatum is a social platform where users document their creative processes inside structured project folders called **Afflations**. Each Afflation is a user-owned container that holds dynamically created subfolders (like "Manifesto", "Process", etc.). The tech stack is Django + PostgreSQL backend (JWT-secured REST API) and React + Vite + Tailwind frontend. The UI mimics Instagram profiles, supports modal-based creation, and uses reusable context menus for item management. JWT tokens auto-refresh. Users can create, view, and delete both Afflations and subfolders.

---

## 1. Project Structure

- Root: `Afflatum/`
- Backend in `backend/`:
  - Django project: `config/`
  - Django app: `core/`
- Frontend in `frontend/`:
  - React + Vite + Tailwind

---

## 2. Backend Environment

- Virtualenv: `venv`
- Installed:
  - Django
  - Pillow
  - PostgreSQL (via Homebrew)
  - python-decouple
  - Django REST Framework
  - simplejwt
  - django-cors-headers
- `.env` holds secrets, excluded via `.gitignore`

---

## 3. Database Setup

- PostgreSQL DB: `afflatum`
- User: `afflatum_user`, PW: `afflatum_pass`
- Connected via `settings.py` using `decouple`
- Migrations completed

---

## 4. Core Models

- `UserProfile`: OneToOne with `User`; includes `bio`, `profile_image`
- `Project`: aka Afflation; linked to `User`; has `title`, `type`, `cover_image`, `readme`, and `details` (JSON structure)
- `Comment`: linked to `User` + `Project`
- `Like`: linked to `User` + `Project`

---

## 5. Admin Setup

- All models registered in `core/admin.py`
- Admin panel live at `/admin/`
- Superuser created

---

## 6. API Endpoints

- REST Framework + ViewSets
- All views protected with `IsOwnerOrReadOnly`
- Routers:
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
- 1-hour access token, auto-refreshed via refresh token
- Token endpoints:
  - `POST /api/token/`
  - `POST /api/token/refresh/`
- `useAuthRefresh()` hook auto-refreshes tokens
- `UserProfile` is created automatically via `post_save`

---

## 8. Frontend (React + Vite + Tailwind)

- Stack: React (TypeScript), Vite, Tailwind
- Tailwind setup:
  - `tailwind.config.js` includes correct content paths
  - Run:
    ```bash
    ./tailwindcss -i ./tailwind.input.css -o ./src/index.css --watch
    ```
- Responsive mobile-first layout
- JWT auth managed via React Context
- Profile, Afflation, and Folder pages all dynamically loaded
- Modal-based creation (`+`) for Afflations and folders
- Right-click triggers `ContextMenu` component (shared)
- Context menu handles delete/rename

---

## 9. Afflation System

- Afflations = user-created "projects"
- Each Afflation can have subfolders (0–5):
  - Manifesto, Inspirations, Process, Thoughts, Result
- Stored as key-arrays in `details` JSON field
- Folder creation via "+" menu
- All folders shown in a grid
- Reusable scroll strip shows afflations or folders
- Deletion via right-click → context menu
- UI mimics Instagram profile layout

---

## ➕ Next Steps

- Finish rename functionality in context menu
- Add support for media uploads (cover images, embeds)
- Build follow and messaging system
- Add real content support in folders (text, media)
- Polish styling + responsiveness across devices
- Separate public vs private views

---

<!-- Context for future GPT sessions -->
> Afflatum = Django + React + Tailwind platform to document creative processes. Afflations = projects. Each holds folders like "Process", "Thoughts", etc. Auth is JWT. Modals handle creation, right-click menus handle management. API drives all state. Layout mimics Instagram but focused on introspection and artistic growth.
