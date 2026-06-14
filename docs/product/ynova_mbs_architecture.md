# YNova MBS Architecture

This document gives Yaomin a structural overview of YNova MBS: what the app is, where responsibilities live, and how to reason about changes without accidentally duplicating core logic.

Current-state note: older agent instructions may mention a sibling backend repository named `../YNova-MVP/`. The checked-in MBS repo now contains FastAPI backend code under `server/`. Before making any backend assumption, verify the current `CLAUDE.md`, `AGENTS.md`, route files, and recent git history.

## Product Purpose

YNova MBS is an AI-tutored IELTS Speaking app. Its core promise is not "chat with an AI." Its promise is that a student can practice speaking, receive useful IELTS-aligned feedback, build memory over time, and trust the system enough to return daily.

The product has four major learner jobs:

1. Practice IELTS speaking in short structured sessions.
2. Take paid mock tests with scoring and review.
3. Build vocabulary, pronunciation, grammar, and fluency through spaced review.
4. Get personalized help from NOVA, the AI study companion.

## High-Level System

```text
Browser / Capacitor app
  Lit 3 components
  Vite bundle
  nanostores state
  Supabase auth session
  Sentry browser telemetry
        |
        | HTTP / WebSocket
        v
FastAPI server under server/
  Route modules for tutor, mock test, voice, billing, profile
  Gemini text and Live clients
  ElevenLabs STT/TTS routes
  Supabase service-role data access
  Sentry server telemetry
        |
        v
Supabase
  Auth
  Postgres
  RLS
  Storage
        |
        v
External services
  Gemini / Vertex AI
  ElevenLabs
  Stripe
  Railway
```

## Frontend Structure

Important folders:

- `src/app-root.ts`: top-level shell and route renderer.
- `src/lib/router.ts`: path router and `routeFor()` URL generation.
- `src/components/`: Lit components, one component per file.
- `src/stores/`: nanostores atoms and domain actions.
- `src/lib/`: non-UI clients such as auth, scoring, i18n, push, memory, and Sentry.
- `src/data/`: static IELTS content used by the frontend.
- `src/design/`: Clay Bright design tokens and Shoelace skin.
- `src/locales/`: translated strings.
- `tests/`: Vitest unit and component tests.
- `tests/playwright/`: browser-level user flow tests.

The shell is route-driven. `matchRoute(path)` returns a route object:

```ts
{ route: RouteName, params: Record<string, string> }
```

Use `.route`, not the whole return value. `routeFor(name, params)` intentionally throws when required params are missing.

## State Model

MBS uses nanostores. Each domain store should expose:

- A typed state shape.
- Action functions that mutate the atom.
- A single owner for side effects when possible.

Example pattern:

```ts
connectedCallback() {
  super.connectedCallback()
  this._unsub = domainStore.subscribe((state) => {
    this._state = state
    this.requestUpdate()
  })
}

disconnectedCallback() {
  super.disconnectedCallback()
  this._unsub?.()
}
```

Important stores:

- `auth-store`: Supabase session, auth status, JWT access.
- `tutor-store`: NOVA memory bundle and active chat messages.
- `training-store`: active training stage, current round, draft autosave.
- `mock-test-store`: mock test flow state.
- `sparks-store`: motivation and progress signals.
- `subscription-store`: paid subscription state.

## Backend Structure

Backend code lives under `server/`. The route modules are mounted in `server/main.py`.

Representative routes:

- `/api/tutor/memory-bundle`: returns the learner memory bundle.
- `/api/tutor/review-grade`: records review results and updates scheduling state.
- `/api/tutor/companion/context`: produces one contextual NOVA companion line.
- `/api/mock-test/start`: creates or resumes a paid mock test attempt.
- `/api/mock-test/attempts/{id}/submit-part`: scores one IELTS part.
- `/api/mock-test/attempts/{id}/finalize`: computes and persists overall result.
- `/api/profile/*`: profile preferences and learner metadata.
- `/api/billing/*`: Stripe subscription and webhook flows.
- STT/TTS and Gemini WebSocket routes for voice features.

The backend owns AI scoring, memory assembly, paid gates, Supabase service-role writes, and provider credentials.

## AI And Scoring Boundary

Do not duplicate scoring logic in the frontend or in Yaomin-YNova docs. The frontend may format and present scores, but the scoring decision belongs on the server.

Why:

- The server can protect model keys and service-role credentials.
- Scoring needs deterministic prompts, auditability, and consistent parsing.
- Paid gates and attempt expiry must be server-authoritative.
- Product trust depends on one scoring contract, not multiple approximations.

When product work touches scoring, define:

- Which route is called.
- What payload is sent.
- What result is expected.
- What happens on 402, 410, 500, timeout, or model parse failure.
- What user-facing explanation appears.

## Memory Bundle

The memory bundle is NOVA's compact view of the learner:

- Identity: display name, native language, target band, test date.
- Last session: topic, band estimate, affect, closing line.
- Review due items.
- Mastery highlights.
- Student state: streaks, preferred L1 lean, last session time.

The frontend loads this after authentication and uses it to personalize home, review, and companion surfaces. Auth-gated side effects must be triggered from the auth subscriber, not only at boot, because the user may authenticate after the app starts.

## Training Flow

Training is structured by IELTS part and stage:

- Part 1, Part 2, Part 3 each have different round counts and prompts.
- Stages include idea expansion, vocabulary, structure, recording, and final scoring/review surfaces.
- Draft state is autosaved locally so the learner can resume.
- Stage completion updates the training store and advances the route or round.

Product requirements for training must specify:

- IELTS part.
- Stage.
- Prompt source.
- Whether it is local-only or backend-backed.
- What persistence is needed.
- How the learner recovers from errors.

## Mock Test Flow

Mock tests are paid-gated and server-authoritative:

- The server sets `ends_at`.
- The server expires stale attempts.
- The server chooses content.
- The server scores each part.
- The frontend uploads audio to Supabase Storage best-effort and sends transcript/audio path to the backend.

Important error contracts:

- `402`: user needs Pro.
- `410`: attempt expired.
- Other non-OK responses become scoring errors.

The mode discriminator matters. Do not infer mode from missing part data; use the explicit mode.

## Design System

MBS uses the Clay Bright system:

- Sky blue as primary action.
- Amber/gold for NOVA and warm progress moments.
- IELTS red only where risk, urgency, or exam branding requires it.
- Green for success.
- Inter-like typography.
- Clear focus rings.
- Moderate radii, not over-rounded generic SaaS cards.

NOVA has a mascot pose set and an orb state system. Use NOVA where she helps the learner understand, recover, celebrate, or continue. Do not put NOVA everywhere just because assets exist.

## Testing Strategy

Use the narrowest test that catches the risk:

- Pure helpers: unit tests.
- Lit component rendering and interaction: Vitest with happy-dom.
- Route and workflow behavior: Playwright.
- Backend contracts: pytest route tests.
- Production smoke: browser test against deployed app when releasing.

For MBS, always run both:

```bash
npm run build
npm test
```

`npm test` can pass even when TypeScript has unused imports. The build catches those.

## Product Management Checklist

Before starting a feature, Yaomin should identify:

- Route or screen affected.
- Store or backend route affected.
- User-facing copy and localization impact.
- Error states.
- Accessibility impact.
- Observability breadcrumbs or logs.
- Tests needed.
- Launch or rollback risk.

If a feature cannot be explained through this checklist, it is not ready for implementation.

