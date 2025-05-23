## [v0.11] - 2025-05-23

### Added
- Tailwind CLI watch-based build pipeline
- Automatic JWT access token refresh (`useAuthRefresh`)
- Dynamic profile data loading via `/api/profiles/me/`

### Updated
- Replaced manual `index.css` with CLI-generated styles
- Profile layout now mobile-first with scrollable highlight reels

### Notes
- Tailwind CLI binaries included for local builds
- Auth tokens are short-lived by design for testing
