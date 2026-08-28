# Project Page Update Implementation Plan

## Goal Description
Replace the placeholder content on the `/dashboard/projects` route with a professional, production‑quality Projects Management page. The page will initially display a **Welcome banner** that includes a countdown timer to the next submission window (using the `submissionStart` / `submissionEnd` data from the backend).

## User Review Required
> [!IMPORTANT]
> The new UI introduces a countdown timer that fetches batch data from the backend. Please confirm that displaying the next upcoming batch’s submission window is acceptable, and whether any additional batch information should be shown on the banner.

## Open Questions
> [!WARNING]
> 1. Should the banner also show the academic year/semester of the upcoming batch?
> 2. Do you prefer a static banner (shows only the nearest upcoming batch) or a dynamic one that updates when the student switches batches via a dropdown (to be added later)?
> 3. Any specific color or branding preferences for the welcome banner (e.g., gradient, glassmorphism) beyond the existing dark navy theme?

## Proposed Changes
---
### Backend
- **[MODIFY] app.js**: Mount the new project routes under `/api/v1/projects`.
- **[NEW] src/routes/v1/project.routes.js** (already created) – defines endpoints for stats, batches, team, deliverables, etc.
- **[NEW] src/controllers/projectController.js** – implements request handlers (already created).
- **[NEW] src/middleware/projectUploadMiddleware.js** – Multer config for project file uploads (already created).
- **[NEW] src/services/projectService.js** – Business logic for projects (already exists in `backend/src/services/projectService.js`).
- Ensure `app.use('/api/v1/projects', projectRoutes);` is added to `app.js`.

---
### Frontend
- **[NEW] src/services/projectService.js**: Axios wrapper exposing `getBatches`, `getStats`, etc.
- **[NEW] src/components/projects/WelcomeBanner.jsx**: Component that fetches the nearest upcoming batch, displays a welcome message, and shows a live countdown timer until `submissionStart`.
- **[MODIFY] src/pages/student/Projects.jsx**: Replace placeholder with layout that includes `<WelcomeBanner />` and retains existing surrounding layout (navbar, sidebar). Import the new component.
- **[NEW] src/components/common/CountdownTimer.jsx** (optional helper) to handle timer logic.
- Update any CSS (e.g., `src/index.css`) to style the banner using the app’s dark navy, glassmorphism aesthetic.

---
### Verification Plan
**Automated Tests**
- Run existing backend test suite (if any) to ensure routes load (`npm test`).
- Manually invoke `/api/v1/projects/batches` via curl to confirm JSON response.

**Manual Verification**
- Start the dev servers (`npm run dev` for backend and frontend).
- Navigate to `http://localhost:5173/dashboard/projects`.
- Verify the welcome banner appears, shows the correct batch name, and the countdown updates in real time.
- Confirm no other dashboard pages are broken (e.g., Assignments, Attendance).
