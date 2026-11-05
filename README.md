# Doctor Tracker – Doctor & Patient Management System


 GitHub Repository: Full project link

Live Frontend URL: 
Live Backend API URL: https://doctor-tracker-xi.vercel.app/login
Live Backend Help URL:https://doctor-tracker-lmk0.onrender.com
Live Backend Help URL:https://doctor-tracker-lmk0.onrender.com/health


Demo login credentials:
Email: Khan1200@gmail.com
Password: 12345678














Secure admin web app to manage doctors, their patients, and view live analytics.
Separate **Next.js** frontend (`:3000`) and **Express + MongoDB** REST API (`:5000`).

## Features
- Admin login/logout, `/auth/me`, protected frontend routes and protected APIs (no public registration; admin created via seed script)
- Doctors: CRUD, detail page with associated patients, add patient under a doctor, move patients to another doctor, search, specialization/hospital/date filters, server-side pagination, patient count
- Patients: CRUD, detail page, search, condition/doctor/date filters, server-side pagination
- Dashboard: 4 stat cards (+2 extra), bar / line / pie charts, recent doctors & patients. All numbers come from MongoDB aggregations
- Responsive layout (collapsible sidebar on mobile), loading / empty / error states, confirm dialogs, toasts, accessible labels

## Tech stack
Next.js 14 (App Router), React 18, TypeScript, Tailwind, Axios, React Hook Form, Zod, Recharts, Lucide · Node, Express 4, Mongoose, Zod, bcryptjs, JWT, Helmet, express-rate-limit, CORS · MongoDB Atlas · Vitest, Supertest, Testing Library

## Folder structure
```
doctor-tracker/
  backend/src/{config,models,controllers,routes,middleware,validators,services,utils,scripts}, app.js, server.js
  backend/tests/
  frontend/src/{app,components,hooks,services,lib,types,providers,constants,__tests__}
```
Route → validator → controller (thin) → service (business logic + queries) → model.

## Installation
Requires Node 18+ and a MongoDB Atlas cluster (free M0 is enough).

### Backend (`backend/`)
```bash
cd backend && npm install
cp .env.example .env     # fill MONGODB_URI, JWT_SECRET (>=32 chars), ADMIN_* values
# generate a secret:  openssl rand -hex 48
npm run seed:admin       # creates the first admin (set SEED_DEMO=true for demo doctors/patients)
npm run dev              # http://localhost:5000
```
### Frontend (`frontend/`)
```bash
cd frontend && npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                   # http://localhost:3000
```
### Database setup
Atlas → create cluster → Database Access (user) → Network Access (allow your IP) → Connect → copy the connection string into `MONGODB_URI`. Indexes are created automatically by Mongoose.

## Environment variables
| Backend | |
|---|---|
| `PORT`, `NODE_ENV`, `CLIENT_URL` | server port, mode, the one trusted CORS origin |
| `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN` | DB and token config (secrets never reach the frontend) |
| `COOKIE_SAMESITE` | `lax` (same site) or `none` (cross-domain deploy; needs HTTPS) |
| `ADMIN_NAME/EMAIL/PASSWORD`, `SEED_DEMO` | only for the seed script |

Frontend: `NEXT_PUBLIC_API_URL`.

## API
All responses: `{ success, data }` (lists add `pagination: { currentPage, limit, totalRecords, totalPages }`); errors: `{ success:false, message, errors? }`.

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | rate limited (10 / 15 min); sets HttpOnly cookie |
| POST | `/api/auth/logout` | clears cookie |
| GET | `/api/auth/me` | current admin |
| GET/POST | `/api/doctors` | query: `page, limit(≤100), search, specialization, hospital, dateFrom, dateTo` |
| GET | `/api/doctors/meta` | distinct specializations/hospitals + doctor options for dropdowns |
| GET/PUT/DELETE | `/api/doctors/:id` | DELETE accepts `?reassignTo=<doctorId>` |
| GET | `/api/doctors/:id/patients` | paginated |
| GET/POST | `/api/patients` | query: `page, limit, search, condition, doctorId, dateFrom, dateTo` |
| GET | `/api/patients/meta` | distinct conditions |
| GET/PUT/DELETE | `/api/patients/:id` | |
| GET | `/api/dashboard/stats` · `patients-per-doctor` · `monthly-stats` · `specialization-stats` | aggregations |

Status codes: 200, 201, 400 (validation / bad id), 401, 404, 409 (duplicate email / doctor still has patients), 429, 500.

## System architecture
Browser (Next.js) ⇄ Axios (`withCredentials`) ⇄ Express REST API ⇄ MongoDB Atlas. The JWT is only ever held in an HttpOnly cookie.

## Technical decisions
1. **Safe doctor deletion.** A patient must always belong to a doctor. Deleting a doctor who has patients returns `409` unless the caller passes `reassignTo`; then patients are moved first and the doctor deleted. No orphans, no silent cascade deletes. The UI forces choosing a target doctor. "Removing" a patient from a doctor likewise means moving them to another doctor (the schema requires `doctorId`).
2. **HttpOnly-cookie JWT instead of localStorage.** JS cannot read the token, which removes the main XSS token-theft path. Cost: CORS must allow credentials from one explicit origin and cross-domain deploys need `SameSite=None; Secure`. A 1-day expiry limits exposure; the frontend redirects to `/login?expired=1` on any 401.
3. **Separate frontend/backend** as required: independent deploys/scaling, API reusable by other clients. Route protection is enforced by the API; the frontend guard is UX only.
4. **Server-side pagination + DB filtering** everywhere; page size capped at 100 and validated.

## Security
bcrypt (cost 12), JWT with expiry, HttpOnly + Secure (prod) + SameSite cookie, constant-time-ish login (dummy hash for unknown emails, generic error), Helmet, login rate limit, single-origin CORS, 10 kb body limit, Zod validation on every body/query (unknown fields stripped → no mass assignment), ObjectId validation, escaped regex search (no ReDoS/injection), centralized error handler (no stack traces unless `NODE_ENV=development`), server refuses to start with a weak `JWT_SECRET`, no public register route, no hardcoded credentials.

## Performance
- Indexes: `doctors.email` (unique), `specialization`, `hospital`, `createdAt`; `patients.{doctorId,createdAt}`, `condition`, `createdAt`.
- Doctor list = one aggregation (`$match → $facet[data, total]`); patient counts are looked up **only for the current page** → no N+1.
- Patient list: `find + countDocuments` in parallel, one `populate` with a projected field set.
- Dashboard: `estimatedDocumentCount` for totals, `$group` for charts, gaps filled in the service.
- Frontend: stale-response protection in `useFetch`, debounced search, memoized filter options, per-chart loading.
- Known trade-off: search uses case-insensitive regex (not index-assisted). Fine for thousands of rows; for large data move to an Atlas Search / text index.

## Testing
```bash
cd backend  && npm test        # 21 pass; +7 DB integration tests when TEST_MONGODB_URI is set (THROWAWAY DB, it is wiped)
cd frontend && npm test        # 9 tests: schemas, Pagination, DataTable states
cd frontend && npm run lint && npm run build
```
Not covered by automated tests: browser E2E flows (login, create/edit forms). Verify them manually using the checklist below.

Manual checklist: login (wrong + right) → dashboard shows real counts → add doctor → add patient under doctor → search/filter/paginate both lists → edit → try deleting a doctor with patients (must ask for reassignment) → logout → protected pages redirect.

## Deployment
- **Backend** (Render/Railway): root `backend`, build `npm install`, start `npm start`; set env vars; `NODE_ENV=production`, `CLIENT_URL=<frontend url>`; if domains differ set `COOKIE_SAMESITE=none`. Run `npm run seed:admin` once.
- **Frontend** (Vercel): root `frontend`, env `NEXT_PUBLIC_API_URL=<backend url>/api`.
- Atlas Network Access must allow the backend host.

## Screenshots
Add desktop and mobile screenshots to `docs/screenshots/` after running the app locally with your Atlas database, then link them here.
