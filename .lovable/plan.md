## App Audit — Standard-Level Improvements

Here's what I found reviewing your student portal. Nothing here is broken — these are gaps you'd typically close before considering the app "production-standard."

### 1. SEO & Metadata (index.html)
- `<title>` is `student-dashboard`, description is `student-dashboard`, og:description is `"t"`, twitter tags contain the wrong content.
- Fix: proper app title (e.g. "Student Portal — <University>"), real meta description (<160 chars), matching `og:title`/`og:description`/`og:type=website`/`twitter:card=summary_large_image`, `lang` per your audience, favicon.
- Add per-page `<title>` updates (Dashboard, Profile, Courses, etc.) via a small `useDocumentTitle` hook.

### 2. Authentication hardening
- **No `/forgot-password` and `/reset-password` pages.** Students who forget their password have no recovery path.
- **No email verification / account status messaging** on login failures beyond the generic toast.
- **Password rules:** Register only checks length ≥ 6. Standard is ≥ 8 with complexity, plus a "show strength" indicator and confirm-match live feedback.
- **Session timeout UX:** Interceptor refreshes silently, but there's no warning banner before forced logout on refresh failure.
- **Remember me / stay signed in** toggle is missing on Login.

### 3. Route & error handling
- `NotFound` is rendered inside `ProtectedRoute` — unauthenticated users hitting a bad URL get bounced to login instead of a 404.
- Public 404 should be outside `ProtectedRoute`.
- **No Error Boundary** wrapping `<Routes>`. A single render error today = white screen.
- **No global loading skeleton** for lazy pages; consider `React.lazy` + `Suspense` to shrink initial bundle (all 19 pages ship in one chunk today).

### 4. Data-fetching consistency
- `@tanstack/react-query` is installed and set up (`QueryClientProvider`) but most pages use raw `useEffect` + service calls. Migrating to `useQuery`/`useMutation` gives you caching, retries, background refetch, and removes a lot of duplicate loading/error state.
- Add default `queryClient` options: `staleTime`, `retry`, `refetchOnWindowFocus: false` where appropriate.

### 5. Forms & validation
- `react-hook-form` + `zod` + `@hookform/resolvers` are all installed but Login/Register/Support/Profile forms use manual `useState` + ad-hoc validation.
- Standard: move to `useForm` + `zodResolver` for consistent inline errors, disabled-submit-until-valid, and typed payloads.

### 6. Accessibility (a11y)
- Password show/hide `<button>` has no `aria-label` (screen readers announce nothing).
- Form inputs mostly OK (Label wired via htmlFor), but confirm all icon-only buttons in Sidebar/TopBar have `aria-label`.
- Ensure focus ring is visible in dark mode (check `--ring` token contrast).
- Add `skip-to-content` link for keyboard users.

### 7. Security posture
- Tokens in `localStorage` are XSS-readable. Standard is httpOnly cookies from the backend; if you must keep localStorage, add a strict CSP header via `vercel.json`.
- No CSP / security headers configured in `vercel.json`.
- `console.error` leaks in production build — strip via Vite `esbuild.drop: ['console','debugger']` for prod builds only.
- Dependency audit: run `bun audit` / check for known CVEs (axios, jspdf versions).

### 8. Environment & config
- `.env` is checked in — verify no secrets there and add `.env.example` for onboarding.
- `VITE_API_URL` has a hardcoded Render fallback; production should require the env var and fail fast if missing.

### 9. UX polish
- **Empty states**: courses/notifications/payments lists likely show a blank area when empty — add illustrations + CTA.
- **Loading skeletons** instead of spinners on Dashboard/Courses/Results for perceived speed.
- **Toast noise**: on every 401 the interceptor triggers a toast; ensure it doesn't stack when multiple requests fail simultaneously.
- **Pagination or virtualization** on Course History / Notifications if lists can grow beyond ~50 rows.
- **Offline handling**: no `navigator.onLine` awareness; a small banner when offline helps.

### 10. Print / PDF flows
- `PrintableResultLayout` and `HostelReceipt` use `html2canvas` + `jspdf`. Ensure they render off-DOM (invisible container) and that fonts embed correctly — otherwise PDFs look different across browsers.

### 11. Testing & quality gates
- No tests present. Standard: at minimum a Vitest smoke test per route ("renders without crashing") and one E2E happy path (login → dashboard) via Playwright.
- Add `lint-staged` + a CI check on push.

### 12. Observability
- No error tracking (Sentry/LogRocket). A single `window.onerror` + `unhandledrejection` reporter would surface issues you can't reproduce locally.
- Add basic analytics (page views) if you need adoption metrics.

---

### Suggested priority
1. **Fix `index.html` SEO tags + add password reset pages** (user-visible / trust)
2. **Move NotFound out of ProtectedRoute + add ErrorBoundary + lazy-load routes** (stability + perf)
3. **Migrate forms to react-hook-form/zod** (consistency, fewer bugs)
4. **Migrate data fetching to react-query** (caching, less code)
5. **Security headers in `vercel.json` + drop console in prod** (hardening)
6. **A11y sweep + loading skeletons + empty states** (polish)
7. **Sentry + a few Vitest/Playwright tests** (long-term health)

Tell me which of these you want me to implement (all, a subset, or the top-priority group) and I'll build a focused plan for it.