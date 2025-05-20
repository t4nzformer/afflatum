# Dev Notes – Afflatum MVP

## Project Overview
Afflatum is a social platform for sharing creative processes.  
Each user shares "project folders" (e.g. paintings, illustrations, music productions), which include inspirations, logs, and media. Profiles look like Instagram but each post is a rich, structured folder.

---

## MVP Focus
- Frontend (React + Tailwind)
- Backend (Express or Django)
- PostgreSQL database
- JWT auth
- Key features:
  - User accounts
  - Project folders
  - Comments, likes, follows
  - DM inbox
  - Feed and explore

---

## Folder Structure (High-Level)
Afflatum/
├── backend/
├── frontend/
├── database/
├── docs/
├── design/
├── tests/

---

## Todo (May 2025)

- [x] Create repo and project folder structure
- [x] Write MVP spec
- [x] Connect to GitHub
- [ ] Set up backend (Express or Django)
- [ ] Set up PostgreSQL schema
- [ ] Build API routes for auth, projects, comments
- [ ] Create frontend project with Vite
- [ ] Connect frontend to backend
- [ ] Create project folder UI with README + inspiration view

---

## Notes
- Use JSONB in PostgreSQL to support flexible project structures.
- Folders will differ by type: painting, illustration, music.
- User can follow other users or individual projects.
