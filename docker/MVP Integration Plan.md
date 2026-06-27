# PetOLife MVP_V2 — Full Refactor Implementation Plan

## Goal
Refactor the PetOLife MVP_V2 frontend from a scattered prototype into a clean, session-secured, production-grade SaaS application. This covers component cleanup, security hardening, route protection, session management, and production readiness for 1K–3K concurrent users at 20–50 RPS.

---

## Phase 1: Structural Cleanup & Code Quality

### 1.1 Rename `homepg/` → `LandingPg/`

#### [MODIFY] Folder + files rename
- Rename `src/components/homepg/` → `src/components/LandingPg/`
- Rename `Homepg.jsx` → `LandingPg.jsx` and `Homepg.css` → `LandingPg.css`
- Update the component name from `Homepg` to `LandingPg` inside the file
- Update the CSS import inside the component
- Update `App.jsx` lazy import path from `./components/homepg/Homepg` → `./components/LandingPg/LandingPg`

---

### 1.2 Delete Unnecessary Files

#### [DELETE] `src/components/ProfileCreation/Profilecreation barrel.jsx`
- 1-line re-export file, not imported anywhere

#### [DELETE] `src/components/MedicalRecords/` (entire folder)
- Old local-only medical records. The newer `medical/` folder has full API integration.

---

### 1.3 Consolidate Duplicate Components (TopNav & BottomNav)

**Current state:** `Home/TopNav/`, `Home/BottomNav/`, `Checklist/TopNav/`, `Checklist/BottomNav/` — all near-identical copies.

#### [NEW] `src/components/common/TopNav/TopNav.jsx` + `TopNav.css`
- Extract a single shared `TopNav` from `Home/TopNav/`
- Copy the CSS and logo asset
- Both `HomeScreen` and `ChecklistPage` will import from here

#### [NEW] `src/components/common/BottomNav/BottomNav.jsx` + `BottomNav.css`
- Extract a single shared `BottomNav` from `Home/BottomNav/`
- The only difference is the `active` default prop — this is already parameterized (`active="home"` vs `active="checklist"`)
- Delete the duplicate BottomNav + TopNav folders from both `Home/` and `Checklist/`

#### [DELETE] After consolidation
- `src/components/Home/TopNav/` (folder)
- `src/components/Home/BottomNav/` (folder)
- `src/components/Checklist/TopNav/` (folder)
- `src/components/Checklist/BottomNav/` (folder)

#### [MODIFY] `src/components/Home/HomeScreen/HomeScreen.jsx`
- Update TopNav/BottomNav imports to `../../common/TopNav/TopNav` and `../../common/BottomNav/BottomNav`

#### [MODIFY] `src/components/Checklist/Checklistpage/Checklistpage.jsx`
- Update TopNav/BottomNav imports to `../../common/TopNav/TopNav` and `../../common/BottomNav/BottomNav`

---

## Phase 2: Feature Fixes, Routing & Functional Completeness

### 2.1 LandingPg (formerly homepg) — Bug Fixes

#### [MODIFY] [LandingPg.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/homepg/Homepg.jsx)
- Verify all `#section` anchor links scroll correctly
- "Join as Pet Parent" button → navigates to `/login` (already works via `handleJoinPetParent`)
- "Join as Veterinarian" button → opens the vet registration modal (already works via `openModal('vet')`)
- Fix any broken asset imports (verify all images in `src/assets/` exist)
- Ensure mobile nav hamburger menu toggles properly

---

### 2.2 Login Component — Security & Flow Fixes

#### [MODIFY] [Login.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/Login/Login.jsx)

**Security fixes:**
- Sanitize all user inputs before sending to API (trim whitespace, validate email format client-side)
- Add rate-limiting awareness — disable submit button after 3 rapid failures, show cooldown message
- Store `access_token` and `refresh_token` properly — currently only `access_token` is stored. Add `refresh_token` to localStorage too
- Add token validation on app load (check if stored token is still valid via `GET /api/auth/me`)

**Forgot Password:**
- Add a `ForgotPasswordScreen` sub-component. Supabase supports `resetPasswordForEmail` — we'll call a new backend endpoint `POST /api/auth/forgot-password` that triggers Supabase's password reset email flow
- Backend: add `POST /api/auth/forgot-password` endpoint to [auth.py](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/backend/app/routers/auth.py)

**Welcome/Success Screen changes:**
- Remove "Continue to App" button
- Show the success screen for 3 seconds with a countdown indicator, then auto-navigate to `/home`
- Add a brief loading animation during the 3-second wait

**Google OAuth:**
- After Google redirect completes, the callback URL is `/home` — need to parse Supabase's hash fragments (`#access_token=...`) from the URL on the Home page load and store the tokens
- Add an `AuthCallback` handler component or handle in `App.jsx`

> [!IMPORTANT]
> **New backend endpoint needed:** `POST /api/auth/forgot-password` — calls `supabase.auth.reset_password_email()`. The reset link in the email should redirect to a password reset page on the frontend.

---

### 2.3 Home Component — Conditional Rendering

#### [MODIFY] [HomeScreen.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/Home/HomeScreen/HomeScreen.jsx)
- On mount, fetch the logged-in user's pets via `GET /api/pet-profile/by-user/{user_id}`
- **If no pets exist:** Show only HeroSection + AddPetCard (promoting pet profile creation). Hide Checklist tab, hide pet-related content.
- **If pets exist:** Show the full home layout with HeroSection, pet cards, health banner, and enable Checklist/Records/Profile tabs
- The `activeTab` state machine drives what main content area shows:
  - `"home"` → HeroSection + pet cards + health banner
  - `"checklist"` → Coming Soon placeholder (deferred to backend-connected version)
  - `"medicalrecords"` → Medical Records component (from `medical/`)
  - `"profile"` → PetHome component (pet dashboard + Logout button + FamilyAccess card)

---

### 2.4 Checklist — Remove for Now

#### [MODIFY] [HomeScreen.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/Home/HomeScreen/HomeScreen.jsx)
- Remove the inline `ChecklistPage` import and rendering
- When `activeTab === "checklist"` → render a "Coming Soon" placeholder (similar to HealthTab style)
- The existing `Checklist/` folder stays in the codebase but is not rendered — it will be rebuilt later with backend/DB integration

> [!NOTE]
> The Checklist component is preserved in the codebase for future reference but will not be rendered in the current version. It needs `daily_task_logs` and `daily_streaks` tables integration which is a Phase 4 feature.

---

### 2.5 Profile Creation — Back Button & Editable Review

#### [MODIFY] [ProfileCreation.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/ProfileCreation/ProfileCreation/ProfileCreation.jsx)
- Back button already exists on Step1 (`onNavigateBack`). Steps 2–4 already have `goBack`. ✅ Already working.

#### [MODIFY] [Step4.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/ProfileCreation/Step4/Step4.jsx)
- Currently shows a review card with "Edit Details" button that goes to Step 2
- Make each individual field row tappable/editable inline — OR — add edit buttons per section that jump to the relevant step
- Better approach: Keep the current "Edit Details" button but change it to link back to Step 2 with a `returnToReview: true` flag, so after editing any step the user is brought back to Step 4 instead of continuing forward
- Ensure `user_id` from `localStorage` is always sent with the profile creation API call (it already is)

---

### 2.6 PostIdScreen — Integrate Into Profile Creation Flow

#### [MODIFY] [ProfileCreation.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/ProfileCreation/ProfileCreation/ProfileCreation.jsx)
- Add a `step === 5` case that renders a `SuccessScreen` (embed postidscreen's UI here)
- After Step 4 submits and gets back `{ petolifeId, petName, petPhotoUrl }` from the API:
  - Store the response data in `petData` state
  - Set `step` to 5 (success screen)
  - The success screen uses the data already in memory (no navigation state, no extra API call)

#### [MODIFY] [postidscreen.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/postidscreen/postidscreen.jsx)
- Refactor to accept props directly (`petName`, `petolifeId`, `petPhotoUrl`) instead of reading from `useLocation().state`
- Make it work both as a standalone route AND as an embedded component
- QR code generation: The QR already encodes the petolife_id into a URL. The Pet Health ID is already generated and stored by the backend (`pet_health_id.py`'s `generate_and_store`). The DB stores it in both `pet_health_ids` and `pet_profiles.petolife_id`. ✅ This is already handled.

#### [MODIFY] [App.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/App.jsx)
- Remove the standalone `/post-id-success` route (it's now part of profile creation)

---

### 2.7 PetCard — Bug Fixes + Public QR Landing Page

#### [MODIFY] [petcard.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/petcard/petcard.jsx)
- Fix QR URL: Currently generates `${API_BASE}/api/pet-profile/by-petolife-id/${petolifeId}` — the backend redirects this to `${FRONTEND_URL}/pet/${petolifeId}`. This is correct.
- Ensure the QR URL matches the public pet card page route

#### [NEW] `src/components/PublicPetCard/PublicPetCard.jsx` + `PublicPetCard.css`
- A public page at route `/pet/:petolifeId`
- On mount: calls `GET /api/pet-profile/public/${petolifeId}` to fetch pet data
- Renders the same PetCard UI (reuse the card design from `petcard/`)
- No login required — this is a public page

#### [MODIFY] App.jsx
- Add route: `<Route path="/pet/:petolifeId" element={<PublicPetCard />} />`

---

### 2.8 PetHome (Pethome/) — Render in Profile Tab

#### [MODIFY] [HomeScreen.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/Home/HomeScreen/HomeScreen.jsx)
- When `activeTab === "profile"`:
  - Render `PetHome` component (from `Pethome/`) showing pet dashboard
  - Below it: render `FamilyAccessCard` (from `FamilyAccess/`)
  - At the bottom: render a **Logout button**

---

### 2.9 Medical Records — Client-Side Validation + Direct Upload

#### [MODIFY] [medical/MedicalRecords.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/medical/MedicalRecords.jsx)

**Client-side validation (before upload):**
- File type check: only allow `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- File size check: max 5MB (matching backend limit)
- File name sanitization: strip special characters
- Show validation errors inline

**User ID tracking:**
- Add `user_id` to the upload FormData so backend stores it with the record
- Pass `user_id` when fetching records so only current user's pet records are shown

**Architecture note on direct-to-DB uploads:**

> [!IMPORTANT]
> **Re: "send uploaded files directly to DB"** — Supabase Storage is already object storage (not DB tables). The current flow is: `Client → Backend (FastAPI) → Supabase Storage`. The backend reads the file into memory (`file_bytes = await file.read()`) which does consume server RAM per upload.
> 
> **Recommended approach for production:** Use **Supabase presigned upload URLs**. The flow becomes: `Client → Supabase Storage (direct)`, and only the metadata goes `Client → Backend → DB`. This completely eliminates server RAM usage for file uploads. However, this requires Supabase JS client on the frontend with proper RLS policies.
>
> **For MVP scope:** We'll keep the current proxy approach but add client-side validation to reject bad files before they ever hit the server. The 5MB limit is already enforced server-side. At 20-50 RPS with most requests being reads, this is manageable.

#### [MODIFY] Backend [medical_records.py](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/backend/app/routers/medical_records.py)
- Add `user_id` field to the `medical_records` table insert
- Add auth token validation: extract user from `Authorization` header before allowing upload/fetch
- Scope record fetching to the authenticated user's pets only

---

### 2.10 FamilyAccess — Route in Profile Tab

#### [MODIFY] [HomeScreen.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/components/Home/HomeScreen/HomeScreen.jsx)
- In the Profile tab view, render `FamilyAccessCard` which on click opens `FamilyManagement` modal
- Both are already built and styled — just need to wire them into HomeScreen's profile tab

---

## Phase 3: Security, Session Management & Production Hardening

### 3.1 Codebase Cleanup

#### Files to remove:
- `src/components/ProfileCreation/Profilecreation barrel.jsx` (done in Phase 1)
- `src/components/MedicalRecords/` entire folder (done in Phase 1)
- Old duplicate TopNav/BottomNav folders (done in Phase 1)
- Any unused asset files in `src/assets/` (audit needed)

---

### 3.2 Security & Vulnerability Audit

**Frontend vulnerabilities to fix:**
- **localStorage token storage:** Currently `access_token` is in localStorage — vulnerable to XSS. For MVP, this is acceptable but should be documented. Production upgrade: use HttpOnly cookies via backend proxy.
- **No input sanitization:** Add input validation on all form fields (XSS prevention)
- **No CSRF protection:** The API uses token-based auth (not cookies), so CSRF is not applicable for most endpoints. ✅
- **Console.log exposure:** Remove all `console.log` and `console.error` statements in production builds or wrap them behind `import.meta.env.DEV`

**Backend vulnerabilities to fix:**
- **Unauthenticated endpoints:** `GET /api/pet-profile/` returns ALL profiles (no auth check) — this is a data leak. Add auth middleware.
- **No rate limiting:** Add rate limiting on auth endpoints (login, signup) — use FastAPI's `slowapi` library
- **Error message leakage:** Backend error messages sometimes expose internal details. Sanitize error responses.

---

### 3.3 Route Protection — No URL Manipulation Access

#### [NEW] `src/components/common/ProtectedRoute.jsx`
```jsx
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
```

#### [MODIFY] [App.jsx](file:///c:/Users/Irfan%20IR/Documents/IR%20Projects/PetOLife/Module1_petprofile/MVP_V2/src/App.jsx)
- Wrap all authenticated routes with `<ProtectedRoute>`:
  - `/home`, `/create-pet-profile`, `/pet-card`, `/pet-page`
- Public routes (no auth needed): `/landing`, `/login`, `/pet/:petolifeId`
- Add token validation on app startup — call `GET /api/auth/me` with stored token. If invalid/expired → clear localStorage → redirect to `/login`
- Handle Google OAuth callback: if URL contains `#access_token`, parse and store it

---

### 3.4 Session Management

#### [NEW] `src/hooks/useAuth.js` — Custom auth hook
- Provides: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `validateSession()`
- `login()` — stores tokens + user data in localStorage
- `logout()` — clears localStorage (`access_token`, `refresh_token`, `user`, `pets_*`) → redirects to `/login`
- `validateSession()` — calls `GET /api/auth/me`, returns `true/false`. On failure, auto-calls `logout()`
- On app mount, run `validateSession()` once

#### [MODIFY] HomeScreen's Profile tab
- Add a **Logout button** at the bottom of the profile tab
- On click: call `logout()` from `useAuth` hook → clears session → redirects to `/login`

#### Backend session check:
- Add `Authorization` header to all API calls from frontend
- Create a reusable `fetchWithAuth(url, options)` utility that automatically attaches the Bearer token
- Backend endpoints that need auth should validate the token via `supabase.auth.get_user(token)`

---

### 3.5 Rewritten App.jsx Route Map

```
PUBLIC ROUTES:
  /                   → redirect to /landing
  /landing            → LandingPg
  /login              → Login
  /pet/:petolifeId    → PublicPetCard (public QR scan page)

PROTECTED ROUTES (require valid session):
  /home               → HomeScreen (with tabs: home, checklist, records, profile)
  /create-pet-profile → ProfileCreation (steps 1-5, step 5 = success screen)
  /pet-card           → PetCard
```

---

## Open Questions

> [!IMPORTANT]
> **1. Medical Records DB table:** Does the `medical_records` table already have a `user_id` column? The current backend code only stores `pet_profile_id`. We may need to add a `user_id` column to the table — or we can derive the user from the pet profile's `user_id` foreign key. Which approach do you prefer?

> [!IMPORTANT]
> **2. Google OAuth setup:** Is Google OAuth actually configured in your Supabase project? The backend has the endpoint but it will return a 503 error if Google provider isn't configured in Supabase Dashboard. Should I add error handling UI for this case, or is it fully set up?

> [!IMPORTANT]
> **3. Password Reset Email:** For the "Forgot Password" flow, Supabase sends a password reset email. Where should the reset link redirect to? We need a `/reset-password` page on the frontend that captures the new password. Should I build this page?

> [!IMPORTANT]
> **4. Checklist backend tables:** The DB schema shows `daily_task_logs` and `daily_streaks` tables exist. Should I build the Checklist API integration now, or is this truly deferred to a later phase?

---

## Production Readiness Suggestions (1K–3K concurrent, 20–50 RPS)

### Frontend
| Area | Recommendation |
|---|---|
| **Code splitting** | Already using `React.lazy()` ✅ — ensure all route-level components are lazy-loaded |
| **Bundle size** | Audit with `npx vite-bundle-analyzer`. Remove `framer-motion` (not used), `gh-pages` (dev only). Consider replacing `react-icons` with direct SVG (already partially done with lucide-react) |
| **CDN** | Serve static assets via a CDN (Cloudflare, Vercel Edge). Vite builds are already optimized for this. |
| **Image optimization** | Convert all PNG assets to WebP. Add `loading="lazy"` to all `<img>` below the fold. |
| **Service Worker** | Add a basic PWA service worker for offline caching of static assets |
| **Error boundaries** | Add React Error Boundaries around each route to prevent full-page crashes |

### Backend
| Area | Recommendation |
|---|---|
| **Rate limiting** | Add `slowapi` with limits: 5 req/min on `/auth/login`, `/auth/signup`; 30 req/min on other endpoints |
| **Connection pooling** | Supabase client already handles pooling via PostgREST. No changes needed for this scale. |
| **Horizontal scaling** | FastAPI with Uvicorn workers: `uvicorn app.main:app --workers 4` handles ~200 RPS on a 2-core machine |
| **Health check endpoint** | Add `GET /api/health` that returns DB connectivity status — useful for load balancer health probes |
| **Structured logging** | Replace `print()` statements with Python `logging` module. Ship logs to a service (Datadog, Logflare) |
| **File upload limits** | Already has 5MB limit ✅. Add nginx `client_max_body_size 5m` if using reverse proxy. |

### Infrastructure
| Area | Recommendation |
|---|---|
| **Deployment** | Docker Compose (already have Dockerfile) → deploy on Railway, Fly.io, or a VPS with Docker |
| **Database** | Supabase Free tier supports ~500 concurrent connections. For 3K users, consider Supabase Pro ($25/mo) |
| **Storage** | Supabase Storage with a CDN in front for pet photos and medical docs |
| **SSL/TLS** | Mandatory. Use Let's Encrypt via nginx or Cloudflare proxy |
| **Monitoring** | Sentry for error tracking (both frontend + backend). UptimeRobot for uptime monitoring |
| **Backups** | Supabase handles automated backups on Pro tier. For Free tier, set up a daily `pg_dump` cron |

### Security
| Area | Recommendation |
|---|---|
| **HTTPS everywhere** | All API calls must be over HTTPS in production |
| **CORS** | Already tightly scoped ✅ |
| **CSP headers** | Add Content-Security-Policy headers to prevent XSS |
| **Token rotation** | Implement refresh token rotation — when access token expires, use refresh token to get new pair |
| **Input validation** | Add Pydantic validators on all backend models (already partially done) |
| **Audit logging** | Log all auth events (login, signup, password reset) to a separate `auth_audit_log` table |

---

## Verification Plan

### Automated Tests
- `npm run build` — verify no build errors after all changes
- `npm run lint` — verify ESLint passes
- Backend: manual endpoint testing via `curl` or Postman

### Manual Verification
1. Landing page loads, all sections scroll, both modals work (pet parent + vet)
2. "Join as Pet Parent" → navigates to `/login`
3. Registration flow → creates account → 3s success screen → auto-redirect to `/home`
4. Login flow → login → 3s success → `/home`
5. Home with no pets → shows "Add Pet" card, no checklist
6. Create pet profile → 4 steps → review → edit → submit → success screen with QR
7. Home with pets → shows pet cards, profile tab with PetHome + FamilyAccess + Logout
8. Medical Records tab → upload file (validates client-side) → shows in records list
9. Pet Card page → QR links to `/pet/:petolifeId` → public page loads pet data
10. URL manipulation test: typing `/home` while logged out → redirects to `/login`
11. Logout → clears session → redirects to `/login` → can't access `/home` anymore
