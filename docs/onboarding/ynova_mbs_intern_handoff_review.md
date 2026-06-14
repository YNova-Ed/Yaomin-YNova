# YNova MBS Intern Review And Handoff Guide

![NOVA reading state](../../public/nova-poses/reading.png)

This document is the intern-facing review of YNova MBS. It is written for Yaomin as a practical handoff guide: what the app is, how the codebase is shaped, what to read first, what not to change casually, how to review work, and how to take over product-management responsibilities from Tamil without losing engineering context.

Use this as the main "everything an intern should know before touching MBS" document.

## Executive Summary

YNova MBS is an AI-tutored IELTS Speaking app. The product goal is simple: help a student practice speaking, get useful IELTS-aligned feedback, remember what they learned, and come back tomorrow with a clear next action.

The technical system is not just a frontend. It is a full product stack:

```text
Student
  |
  v
Lit + Vite web app
  |
  +-- Supabase Auth session
  +-- nanostores state
  +-- local drafts and UI state
  +-- Sentry browser breadcrumbs
  |
  | HTTP / WebSocket
  v
FastAPI backend under server/
  |
  +-- AI scoring routes
  +-- tutor and memory routes
  +-- mock test routes
  +-- profile and billing routes
  +-- STT / TTS / Gemini Live routes
  +-- Sentry server telemetry
  |
  v
Supabase + external providers
  |
  +-- Auth
  +-- Postgres with RLS
  +-- Storage
  +-- Gemini / Vertex AI
  +-- ElevenLabs
  +-- Stripe
  +-- Railway
```

The most important rule: product work must respect boundaries. The frontend guides and renders. The backend owns scoring, paid gates, service-role database writes, provider credentials, and server-authoritative timers.

## Current-State Review

This review is based on the checked-in MBS repo state around 2026-06-15 New Zealand time.

### What Is Strong

- The app has a clear product loop: onboarding -> home -> practice/training/review/mock test -> feedback -> memory -> return.
- The repo has explicit architecture notes in `CLAUDE.md`, `AGENTS.md`, `TASK_TODO.md`, and `LEARNINGS.md`.
- The current `CLAUDE.md` correctly says the FastAPI backend lives inside this repo under `server/`.
- Route handling is centralized in `src/lib/router.ts`.
- State is organized by nanostores under `src/stores/`.
- Backend routes are grouped under `server/routes/`, with business logic under `server/services/`.
- There are strong learned constraints around Lit, happy-dom, auth, route guards, scoring, mock tests, and Supabase behavior.
- The command gates are clear: `npm run build` and `npm test` must pass before a task is considered done.

### What Requires Care

- Some older instructions may still mention a sibling backend repo such as `../YNova-MVP/`. Treat that as stale unless current files prove otherwise. The current repo has backend code under `server/`.
- IELTS scoring is a trust boundary. Do not copy scoring logic into frontend components or docs as executable product logic.
- Mock tests are paid-gated and server-authoritative. Do not let the client decide timer validity, attempt status, or final score.
- Lit and happy-dom have known rendering pitfalls. Inline conditionals and top-level arrays can break tests in non-obvious ways.
- Global CSS does not pierce shadow DOM. Components with buttons or inputs need their own `:focus-visible` rules.
- Auth side effects must react to `authStore`; users may not be authenticated when the app first boots.
- Static docs can easily drift from code. When in doubt, verify `package.json`, `src/lib/router.ts`, `server/main.py`, and recent git history.

## What Yaomin Should Understand First

The app is easier to learn if you separate it into product layers:

```text
Layer 1: Student promise
  Pass IELTS Speaking with repeated, trusted practice.

Layer 2: Daily loop
  Open app -> see next best action -> practice -> receive feedback -> review -> return.

Layer 3: Product surfaces
  Landing, auth, onboarding, home, training, mock test, review, profile, NOVA.

Layer 4: Frontend implementation
  Lit components, route shell, nanostores, API clients, design tokens.

Layer 5: Backend implementation
  FastAPI routes, scoring services, tutor services, Supabase writes, providers.

Layer 6: Operations
  Sentry, Railway, Supabase, Stripe webhooks, tests, release checks.
```

Do not start by reading every file. Start by understanding which layer a question belongs to.

## Product Mental Model

YNova is not a generic chatbot. It is a structured learning product.

The student does not open YNova to be impressed by AI. The student opens YNova because:

- speaking practice is uncomfortable,
- IELTS criteria are hard to interpret,
- human tutoring is expensive,
- they need feedback quickly,
- they need confidence before a real exam,
- they need continuity between sessions.

Every feature should answer at least one of these questions:

- Does this help the student speak more?
- Does this help the student understand what to improve?
- Does this help the student return tomorrow?
- Does this reduce confusion, shame, or anxiety?
- Does this preserve trust in scores and feedback?

If a proposed feature does not answer one of those questions, it is probably not a high-priority MBS feature.

## Main User Journey

```text
Public visitor
  |
  +-- Landing / pricing / schools
  |
  v
Auth
  |
  +-- Login
  +-- Signup
  +-- Reset password
  +-- Email verification
  |
  v
Onboarding
  |
  +-- About
  +-- Native language
  +-- Target band
  +-- Topic interests
  +-- Test date
  +-- Review
  |
  v
Home
  |
  +-- Daily quest
  +-- Memory-informed next step
  +-- Streak and progress signals
  +-- NOVA companion
  |
  +-- Training
  +-- Mock test
  +-- Review
  +-- Word flash
  +-- Profile
```

The home page is the product's daily command center. If Yaomin is reviewing a product change, she should ask: "After this change, does the student know what to do next?"

## Codebase Map

```text
YNova-MBS/
  src/
    app-root.ts
    components/
    lib/
    stores/
    data/
    design/
    i18n/
    locales/
  server/
    main.py
    routes/
    services/
    prompts/
    data/
    tests/
  tests/
    *.test.ts
    playwright/
  docs/
    audit/
    audits/
    design-docs/
    product-specs/
    superpowers/
  scripts/
  public/
  android/
  ios/
```

### First Files To Read

Read these in order:

1. `CLAUDE.md`
2. `AGENTS.md`
3. `TASK_TODO.md`
4. `LEARNINGS.md`
5. `package.json`
6. `src/lib/router.ts`
7. `src/app-root.ts`
8. `server/main.py`
9. `src/stores/auth-store.ts`
10. `server/routes/tutor.py`
11. `server/routes/mock_test.py`
12. `server/services/scoring_service.py`

The goal is not memorization. The goal is to build a map.

## Frontend Architecture

MBS uses Lit 3 web components and TypeScript.

The frontend is organized around these responsibilities:

```text
src/app-root.ts
  owns app boot, route render, global side effects

src/components/*
  owns UI surfaces and local interaction

src/stores/*
  owns domain state and action functions

src/lib/*
  owns API clients, auth helpers, router, telemetry, utilities

src/design/*
  owns design tokens and Shoelace skin

src/locales/*
  owns translated user-visible strings
```

### App Root

`src/app-root.ts` is the top-level shell. It:

- imports the home view eagerly,
- lazy-loads other heavy views through `<lazy-view>`,
- initializes Sentry and chunk recovery,
- initializes auth,
- bootstraps push and local notifications,
- loads timezone, subscription, profile preferences, memory bundle, and sparks after auth,
- listens for custom `navigate` events,
- renders the right route view.

Intern rule: do not add random boot side effects in components if the effect belongs to app boot or auth boot. Put it where the lifecycle is clear.

### Router

Routes live in `src/lib/router.ts`.

```ts
matchRoute(pathname) => { route: RouteName, params: Record<string, string> }
routeFor(name, params) => string
navigate(name, params) => void
```

Important rule:

```text
matchRoute(path).route
```

Do not treat `matchRoute(path)` itself as a string.

`routeFor()` intentionally throws if a required route parameter is missing. Do not hide that error. A bad route should fail during development instead of navigating a student to a broken screen.

### Components

Major component groups:

- Landing and public: `landing-view`, `pricing-view`, `schools-view`, `help-center`, legal views.
- Auth: `login-view`, `signup-view`, `reset-view`, `verify-view`.
- Onboarding: `onboarding-about`, `onboarding-language`, `onboarding-target`, `onboarding-interests`, `onboarding-test-date`, `onboarding-review`, `onboarding-shell`.
- Daily app: `home-view`, `daily-quest-card`, `streak-widget`, `word-of-the-day`, `sparks-bar`.
- Training: `training-view`, `training-stage-shell`, `training-stage-s1` through `training-stage-s5`, `training-stage-final`.
- Mock test: `mock-test-view`, `mock-test-flow`, `mock-test`, `mock-test-results`.
- Review: `review-flow`, `review-card`, `review-card-vocab`, `review-card-phoneme`, `review-card-grammar`, `review-card-cue`.
- NOVA: `nova-companion`, `nova-chat`, `nova-orb`, `nova-avatar`, `nova-hello`.
- Profile: `profile-view`, `profile-settings`, `profile-history`, `profile-billing`.

### Component Review Checklist

When reviewing a frontend change, check:

- Does every user-visible string go through the i18n helper or locale files?
- Does the component have a local `:focus-visible` style if it has interactive elements?
- Does it avoid inline conditional templates next to event handlers?
- Does it avoid top-level array rendering without a wrapper?
- Does it dispatch `navigate` events instead of calling router functions directly from deeply nested UI?
- Does it handle loading, empty, error, and success states?
- Does it add Sentry breadcrumbs for important user actions without PII?
- Does it work on mobile widths?

## State Model

MBS uses nanostores.

Important stores:

```text
auth-store
  session, status, getJwt(), initAuth()

tutor-store
  memory bundle, NOVA messages, companion context

training-store
  active part/stage, draft state, round progress

mock-test-store
  mock test flow state

review-store
  due cards, review grading

subscription-store
  paid plan and billing state

sparks-store
  daily motivation and progress signals

theme-store
  light/dark mode
```

Typical component pattern:

```ts
connectedCallback() {
  super.connectedCallback()
  this._unsub = someStore.subscribe((state) => {
    this._state = state
    this.requestUpdate()
  })
}

disconnectedCallback() {
  super.disconnectedCallback()
  this._unsub?.()
}
```

`store.subscribe()` fires immediately with current state. Calling `store.get()` first is usually redundant.

## Backend Architecture

The FastAPI backend lives in `server/`.

```text
server/main.py
  app setup, middleware, CORS, read-only gate, static fallback, route mounting

server/routes/
  HTTP API contracts

server/services/
  business logic and provider wrappers

server/prompts/
  AI prompt templates

server/data/
  authoritative review/training content where backend owns content

server/tests/
  pytest route and service tests
```

### Backend Route Groups

```text
/api/status
  health and status checks

/api/auth
  auth-related server contracts

/api/tutor
  memory bundle, tutor context, review grading, training progress

/api/mock-test
  paid mock test start, fetch, submit part, finalize, list

/api/profile
  learner profile and preferences

/api/billing
  Stripe checkout, subscription state, webhooks

/api/events
  session/product event logging

/api/notifications
  push token and notification flows

/api/stt and /api/tts
  voice provider routes

/api/word-flash
  word flash and vocabulary flows

/api/contact and /api/waitlist
  public lead capture
```

### Middleware And Operational Gates

`server/main.py` includes:

- Sentry initialization before app creation,
- rate limiting,
- reCAPTCHA setup where configured,
- CORS origin resolution,
- startup guard enforcement,
- read-only mode middleware,
- static cache headers,
- gzip middleware,
- route mounting,
- static SPA serving.

The read-only gate is important. When `READ_ONLY_MODE=true`, unsafe writes return `503` except Stripe webhooks. This is an operational safety switch, not a feature flag.

## API Boundaries

Use this rule:

```text
Frontend asks.
Backend decides.
Database records.
Frontend explains.
```

Examples:

- Frontend asks for a mock-test attempt. Backend creates or resumes the attempt.
- Frontend submits transcript/audio path. Backend scores the part.
- Frontend renders a score. Backend owns score calculation.
- Frontend shows due review cards. Backend or shared service owns scheduling truth.
- Frontend sends profile preferences. Backend validates and persists.
- Frontend displays subscription state. Backend/Stripe own the truth.

Do not move a backend decision into frontend code because it feels faster. That creates drift and trust problems.

## AI Architecture

YNova uses AI in multiple roles:

```text
Runtime AI
  |
  +-- Scoring AI
  |     IELTS-aligned assessment and feedback
  |
  +-- Tutor AI
  |     NOVA companion, coaching, explanation
  |
  +-- Voice AI
  |     STT and TTS
  |
  +-- Memory-informed personalization
        compact learner state used carefully

Development AI
  |
  +-- Codex
  +-- Claude
  +-- Cursor
  +-- Copilot
```

Do not confuse development agents with runtime product agents. Codex and Claude help build the app. NOVA is the product experience.

### Scoring

Scoring is high trust and high risk.

`server/services/scoring_service.py` is designed around deterministic model calls, input hashes, rubric versions, prompt versions, and audit logging.

Intern rule: scoring changes need a written contract:

- route affected,
- input payload,
- output shape,
- rubric/prompt version impact,
- failure behavior,
- audit behavior,
- tests,
- product copy.

### Memory

The memory bundle is a structured summary of the learner. It can include:

- name or display identity,
- native language,
- target band,
- test date,
- topic interests,
- last session context,
- review due items,
- mastery highlights,
- streak state,
- preferred L1 lean.

Memory must not invent facts. If a field is missing, UI should gracefully say less.

### Voice

Voice features are sensitive because they involve permission prompts, latency, audio quality, provider failures, and student anxiety.

Review voice features for:

- permission handling,
- fallback behavior,
- no unexpected autoplay,
- clear recording state,
- transcript confidence,
- provider timeout behavior,
- privacy and data retention assumptions.

![NOVA listening state](../../public/nova-poses/listening.png)

## Training Flow

Training is structured IELTS practice, not a free chat.

```text
Training route
  |
  +-- choose IELTS part
  |
  +-- choose or rotate topic/set
  |
  +-- stage shell
        |
        +-- S1 ideas
        +-- S2 vocabulary
        +-- S3 structure
        +-- S4 recording
        +-- S5 review/retry
        +-- final report
```

Product requirements for training should state:

- IELTS part,
- learner goal,
- source of prompts,
- stage affected,
- store affected,
- backend route affected,
- what is saved locally,
- what is saved remotely,
- error and offline behavior,
- accessibility expectations,
- tests.

## Mock Test Flow

Mock test is closer to the real exam and has stricter contracts.

```text
Start attempt
  |
  v
Server picks mode/content and sets ends_at
  |
  v
Frontend records or collects transcript per part
  |
  v
submit-part route scores each part
  |
  v
finalize route computes overall score
  |
  v
Results page explains score, feedback, and next steps
```

Important contracts:

- Paid gate: `402` means the user needs Pro.
- Expiry: `410` means the attempt expired.
- Timer: server owns `ends_at`.
- Mode: use explicit `mode`; do not infer from missing part data.
- Audio upload: best effort. Scoring should not be blocked by storage outage unless the route contract says it must.
- Result display: clear feedback beats decorative score UI.

## Review And SRS

Review is where learning compounds.

Review cards can cover:

- vocabulary,
- pronunciation,
- grammar patterns,
- cue structures,
- weak-topic prompts.

The scheduling logic must be consistent. Avoid ad hoc "show this again later" logic in components. If an intern needs to change review behavior, they should first read:

- `server/services/srs.py`,
- `server/services/review_content.py`,
- `server/routes/tutor.py`,
- review card components under `src/components/`.

## Billing And Paid Gates

Billing is a trust and revenue boundary.

Important principles:

- Stripe webhooks must be idempotent.
- Frontend cannot be the source of truth for paid status.
- Paid-only routes must be enforced server-side.
- Billing copy must be accurate and conservative.
- Do not log payment details or sensitive customer data.

If a feature affects subscription state, review both frontend and backend paths.

## Supabase Model

Supabase provides:

- Auth,
- Postgres,
- RLS,
- Storage,
- service-role access from backend only.

Client-side code can use public Supabase client behavior where appropriate. Service-role keys must never enter frontend code.

When reviewing data changes:

- identify table affected,
- check RLS impact,
- check migrations,
- check backfill needs,
- check rollback path,
- check test coverage,
- check whether the frontend assumes a field always exists.

## Design System

YNova uses a Clay Bright product language:

- Sky blue for primary action.
- Amber/gold for NOVA warmth and encouragement.
- IELTS red only for risk, urgency, or exam-related emphasis.
- Green for success.
- Neutral surfaces for clarity.
- Inter-like typography.
- Moderate radius.
- Clear focus rings.

NOVA should carry product meaning. Use mascot states when they help the learner:

- listening: recording or voice attention,
- thinking: analysis or feedback generation,
- reading: docs, review, or learning,
- celebrating: genuine completion,
- apologetic: error recovery,
- pointing: guidance or next step.

Do not use NOVA as random decoration on every panel.

![NOVA pointing state](../../public/nova-poses/pointing.png)

## Accessibility Requirements

Accessibility is not optional because students may be on low-cost devices, small screens, weak networks, and English as a second language.

Check:

- keyboard navigation,
- visible focus,
- touch target size,
- screen-reader labels,
- reduced motion,
- color contrast,
- meaningful empty states,
- no text overlap on mobile,
- clear error recovery,
- no essential information hidden only in color.

Shadow DOM note: global `:focus-visible` does not pierce components. Each interactive component must define its own focus style.

## Internationalization

MBS uses `@lit/localize` and a custom `t()` helper.

Intern rules:

- Do not hardcode user-visible English in templates.
- Add new keys to all locale files.
- Preserve placeholders exactly, such as `{name}` or `{count}`.
- Keep error copy plain and helpful.
- Bilingual scaffolding is core product behavior, not an optional extra.

## Observability

New surfaces should emit Sentry breadcrumbs for important user actions.

Good breadcrumbs:

- route changed,
- mock test started,
- recording started or stopped,
- scoring submitted,
- review graded,
- subscription flow started,
- profile saved.

Bad breadcrumbs:

- email addresses,
- transcripts,
- full student answers,
- payment details,
- raw provider responses with personal data.

## Engineering Workflow

Before a non-trivial task:

```text
1. Read TASK_TODO.md.
2. Read LEARNINGS.md.
3. Check recent git log.
4. Identify affected route/component/store/backend route.
5. Write or update the smallest useful spec.
6. Implement.
7. Run npm run build.
8. Run npm test.
9. For UI, run the app and smoke the flow in a browser.
10. Summarize what changed, how it was verified, and what risk remains.
```

For backend changes, also run the relevant pytest tests under `server/tests/` when possible.

## PRD Checklist For Yaomin

Every product request should answer:

- What student problem does this solve?
- Which route or screen changes?
- Which component owns the UI?
- Which store owns state?
- Which backend route is called?
- Which table or storage bucket is affected?
- Does this need localization?
- Does this need paid gating?
- Does this need Sentry breadcrumbs?
- What happens on slow network?
- What happens on provider failure?
- What happens if the user is not authenticated?
- What should Tamil review before implementation?
- What tests prove it works?

## Code Review Checklist For Yaomin

Lead with risks and bugs, not summaries.

Review in this order:

1. Correctness: does it do the requested behavior?
2. Student safety: can it confuse, shame, block, or mislead a learner?
3. Boundary safety: did frontend take over backend decisions?
4. Auth and data: can unauthenticated users reach something they should not?
5. Error handling: are failures visible and recoverable?
6. Accessibility: can keyboard and screen-reader users operate it?
7. i18n: are strings localizable?
8. Observability: can Tamil debug production?
9. Tests: do tests cover the risk, not just the happy path?
10. Maintainability: is the code in the right module?

Review comment format:

```text
[Severity] File/line: concrete issue.
Why it matters: user/business/technical impact.
Suggested fix: smallest safe correction.
Verification: test or manual check that proves it.
```

## Common Failure Modes

### Stale Architecture Assumptions

Symptom:

```text
Doc says backend is in a sibling repo.
Code shows backend under server/.
```

Fix:

```text
Trust current code, CLAUDE.md, and git history over stale notes.
```

### Frontend Reimplements Backend Rules

Symptom:

```text
Component computes score, paid gate, attempt expiry, or review scheduling independently.
```

Fix:

```text
Move the decision back to backend or shared service contract.
```

### Lit Test Breakage From Template Shape

Symptom:

```text
Event handler receives wrong data.
Conditional content disappears in happy-dom.
Top-level array render is missing.
```

Fix:

```text
Use static outer wrappers, top-level render branches, hidden permanent elements, or wrapped arrays.
```

### Auth Side Effect Runs Too Early

Symptom:

```text
Memory, profile, sparks, subscription, or timezone call fails at boot because JWT is null.
```

Fix:

```text
Trigger auth-gated effects from authStore subscription after status becomes authed.
```

### Score Trust Drift

Symptom:

```text
Prompt, rubric, parsing, or frontend display changes without audit/version awareness.
```

Fix:

```text
Define scoring contract and update tests, prompt version, and review copy deliberately.
```

## First 30 Days For Yaomin

### Days 1-3: Orientation

- Read this guide.
- Read the complete YNova app onboarding guide.
- Read `CLAUDE.md`, `TASK_TODO.md`, and `LEARNINGS.md`.
- Open the app locally.
- Draw the main user journey from memory.
- Write five questions for Tamil.

### Days 4-7: Product Map

- Walk through landing, signup/login, onboarding, home, training, mock test, review, and profile.
- For each route, write the likely owner component and store.
- Identify three UX points where a student might feel confused.
- Identify three moments where NOVA should or should not appear.

### Week 2: Engineering Map

- Trace one frontend API call from component to `src/lib` client to backend route.
- Trace one backend route from `server/main.py` to route handler to service.
- Trace one review card from content source to UI rendering.
- Run `npm run build` and `npm test`.
- Shadow one code review.

### Week 3: Product Ownership

- Draft a small PRD for a low-risk improvement.
- Include route, component, store, backend route, copy, a11y, i18n, tests, and rollout notes.
- Create or update a GitHub issue for the task.
- Ask Tamil to review the PRD before implementation.

### Week 4: Handoff Readiness

- Own weekly progress updates.
- Maintain the GitHub task board.
- Triage incoming requests into product, engineering, design, AI, or ops.
- Keep decisions documented.
- Escalate anything touching scoring, billing, auth, provider keys, production data, or student privacy.

## Tamil To Yaomin Handoff Checklist

Use this when Tamil transfers responsibility for a product area.

```text
Area:
Owner:
Current status:
Relevant route(s):
Relevant component(s):
Relevant store(s):
Relevant backend route(s):
Relevant table(s):
Known risks:
Open decisions:
Current GitHub issue:
Acceptance criteria:
How to verify:
What Tamil must approve:
```

Do not accept a handoff without "how to verify." If nobody can say how to verify the work, the task is not ready.

## What Not To Touch Without Tamil Review

- Scoring prompts, parsing, or rubric versions.
- Stripe billing flow or webhooks.
- Supabase RLS policies.
- Service-role backend writes.
- Auth session lifecycle.
- Mock-test attempt expiry or paid gates.
- Production environment variables.
- Push notification scheduling.
- Audio recording/upload privacy behavior.
- Any flow that stores or processes student speech content.

## Decision Rules

When uncertain, use this decision tree:

```text
Does this affect student trust, score, billing, auth, privacy, or production data?
  |
  +-- yes -> require Tamil review before shipping
  |
  +-- no
        |
        v
Does this affect route, store, backend contract, or persisted data?
  |
  +-- yes -> write a short spec and run build/test
  |
  +-- no
        |
        v
Is this copy, docs, or low-risk UI polish?
  |
  +-- yes -> make small scoped change, verify visually if UI
```

## Final Mental Model

Think of MBS as a learning system, not a set of screens.

```text
Student intent
  -> product surface
  -> component
  -> store/client
  -> backend route
  -> service/provider/database
  -> result
  -> feedback and next action
  -> memory/review loop
```

The intern job is to keep that loop coherent.

When Yaomin can explain where a change sits in that chain, what can fail, how the student recovers, and how Tamil verifies it, she is ready to own that product area.
