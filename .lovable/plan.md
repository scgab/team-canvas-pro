# Wheewls — End‑to‑End Enhancement Plan

A staged plan to upgrade your shift‑planning + project management app. Each phase ships independently so you can pause/reorder. Nothing here removes existing tools — all changes are additive or refactors behind the same UI.

## Snapshot of what exists today
- React 18 + Vite + Tailwind + shadcn, Supabase backend (30+ tables, RLS, edge functions)
- Modules: Projects, Tasks/Kanban/Gantt, Calendar, Shift Planning, Team, Meetings, AI Tools, Workflow Automations, Chatbot, Subscriptions (Stripe), Google Calendar, Gemini AI
- Pain points visible in the codebase: very large components (Kanban 641, MakeShifts 641, ShiftsOverview 652, QuickActionModals 526), duplicated data layers (`services/database.ts` vs `services/teamData.ts`), no React Query usage despite being installed, ad‑hoc loading states, no test suite, mixed auth/team scoping patterns.

---

## Phase 1 — Foundation & Code Health (1–2 days)
Goal: stop bleeding before adding features.
1. **Adopt React Query everywhere.** Replace manual `useEffect + useState` data fetching with `useQuery`/`useMutation` hooks (`useProjects`, `useTasks`, `useShifts`, `useCalendarEvents`, `useTeamMembers`). Centralized cache fixes most "stale data" bugs.
2. **Collapse duplicate data layers.** Keep `TeamDataService` as the single source of truth; deprecate overlapping methods in `services/database.ts`. Add team‑scoping helper so no caller forgets `team_id`.
3. **Split god‑components.** Break Kanban, MakeShifts, ShiftsOverview, QuickActionModals into ≤200‑line subcomponents (column, card, filters, header, dialog).
4. **Error + loading primitives.** Add `<PageSkeleton>`, `<ErrorBoundary>`, `<EmptyState>` and use across pages.
5. **Strict TS pass.** Turn on `noImplicitAny`/`strictNullChecks` for `src/services` and `src/hooks`; remove `any` from new hooks.

## Phase 2 — Security & Data Integrity (1 day)
1. Run `supabase--linter` + security scan; fix any RLS gaps surfaced.
2. Audit RLS for every team‑scoped table — guarantee `team_id = current user's team` on SELECT/INSERT/UPDATE/DELETE.
3. Move admin/role checks to a `user_roles` table + `has_role()` SECURITY DEFINER function (your guidelines require this pattern).
4. Add server‑side validation triggers for shift overlaps and event time ranges instead of client‑only checks.

## Phase 3 — Shift Planning UX (2–3 days)
1. **Drag‑and‑drop assignment** in Weekly + Monthly views (already have dnd‑kit via Kanban).
2. **Conflict detection** badges (overlap, exceeds weekly hours, on declared unavailability).
3. **Templates & recurring shifts** (e.g. "every Mon 07–15 for 12 weeks") on top of new custom Shift Types.
4. **Auto‑scheduler v1** (Gemini): given availabilities + rules, propose a week's plan, user approves before write.
5. **Shift swap requests** flow with notifications.
6. **Print/export** weekly schedule to PDF + CSV.

## Phase 4 — Calendar & Meetings (1–2 days)
1. Two‑way Google Calendar sync (currently mostly one‑way) with conflict resolution.
2. ICS feed per user (subscribe in Apple/Outlook).
3. Meeting summary workflow: surface AI summaries inline + "send to attendees" button (extend existing automation).
4. Reminders via email/push 24h + 1h before.

## Phase 5 — Projects, Tasks & Collaboration (2 days)
1. Real Gantt dependencies (FS/SS/FF/SF) + critical path highlight.
2. Task comments + @mentions with notifications.
3. File attachments per task using existing `documentation` storage bucket (per‑team folder).
4. Saved filters + per‑user board views.
5. Activity log per project.

## Phase 6 — AI Layer (1–2 days)
1. Centralize Gemini calls in one `ai-gateway` edge function with rate limiting + audit log.
2. Chatbot upgrades: tool‑use (create task, book shift, query schedule) via function‑calling, scoped to the user's team and permissions.
3. "Insights" panel on Dashboard: weekly summary, anomalies (uncovered shifts, overdue tasks).
4. Smart search across projects/tasks/notes/meetings.

## Phase 7 — Performance (1 day)
1. Route‑level code splitting (`React.lazy` for every page) — currently all imported eagerly in `App.tsx`.
2. Add DB indexes on hot filters: `shifts(team_id, date)`, `tasks(team_id, status)`, `calendar_events(team_id, date)`.
3. Memoize heavy lists; virtualize Kanban + shift tables (`@tanstack/react-virtual`).
4. Replace per‑page polling with Supabase Realtime channels for shifts/tasks/messages.

## Phase 8 — Notifications & Mobile (1 day)
1. Unified notification center (in‑app + email + optional web push).
2. PWA: installable, offline read for today's shifts + cached schedule.
3. Mobile‑first polish on Calendar/Shifts (current layouts assume desktop).

## Phase 9 — Quality & Observability (1 day)
1. Vitest + React Testing Library on hooks and critical flows (auth, create shift, create task).
2. Playwright smoke test for login → create shift → see on calendar.
3. Sentry (or Logflare via Supabase) for client + edge function errors.
4. Edge‑function structured logging + dashboards.

## Phase 10 — Monetization Polish (0.5 day)
1. Gate premium features (auto‑scheduler, AI insights, advanced exports) via existing Stripe `useSubscription`.
2. Usage meter UI on Settings.
3. Trial banner + upgrade CTA when limits hit.

---

## Suggested execution order
Phase 1 → 2 → 7 (quick wins) → 3 → 6 → 4 → 5 → 8 → 9 → 10.

## Technical notes
- Keep all DB changes via `supabase--migration`; never edit `types.ts`.
- New tables likely needed: `shift_swap_requests`, `task_comments`, `task_attachments`, `notifications`, `activity_log`, `user_roles`, `shift_templates`.
- All new tables get RLS keyed on `team_id` + `has_role()` where admin‑only.
- Use existing `lovable-ai-gateway` pattern; do not introduce new AI provider keys.

## Out of scope (call out before starting)
- Migrating off Supabase to Lovable Cloud (not possible, project already external).
- Native mobile app (PWA covers most of it).

Tell me which phase to start with — I'd recommend Phase 1 + the Phase 7 lazy‑loading change as the first PR since they unblock everything else.
