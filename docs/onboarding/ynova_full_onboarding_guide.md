# Complete YNova App Onboarding Guide

![NOVA mascot](../../public/nova-brand/nova-furry-star-mascot-transparent.png)

This guide is Yaomin's full onboarding path into YNova. It starts with the simplest possible explanation and then progressively adds product, engineering, AI, design, operations, and product management detail.

Use it in layers. Do not try to memorize everything on day one.

## Layer 1: The Simplest Explanation

YNova helps IELTS Speaking students practice, get feedback, remember what they learned, and return consistently.

MBS is the main app experience. It is:

- A web app first.
- Wrapped for mobile through Capacitor.
- Built with Lit, TypeScript, Vite, Supabase, and FastAPI.
- Powered by AI services for scoring, tutoring, memory, voice, and feedback.

NOVA is the student-facing AI companion. NOVA should feel warm, useful, and trustworthy. NOVA is not decoration. NOVA helps the student move to the next best learning action.

![NOVA reading state](../../public/nova-poses/reading.png)

## Layer 2: What The Student Experiences

A student comes to YNova because IELTS Speaking is stressful. They need to speak aloud, get realistic feedback, improve weak areas, and keep practicing until exam day.

The main experience loop is:

1. Sign up or sign in.
2. Complete onboarding.
3. Land on home.
4. See the next best action.
5. Practice a short training task, review weak items, talk to NOVA, or take a mock test.
6. Receive feedback.
7. Save progress into memory.
8. Return tomorrow with a better next action.

Good product decisions make this loop easier. Bad product decisions add confusion, shame, latency, or mistrust.

## Layer 3: Core Product Surfaces

### Landing And Public Pages

The landing page explains the product promise, school value, pricing, and trust points. It must avoid exaggerated score guarantees.

### Auth And Onboarding

The student signs in through Supabase auth. Onboarding gathers enough information to personalize practice:

- Name.
- Native language.
- Target band.
- Test date.
- Topic interests.
- Preferences such as L1 support.

### Home

Home is the student's daily control center. It should answer:

- What should I do now?
- Why this task?
- How much progress have I made?
- What did NOVA remember from last time?

### Training

Training is structured practice for IELTS Speaking. It breaks work into smaller stages so students are not thrown directly into a full test.

Important ideas:

- Part 1 is short-answer personal topics.
- Part 2 is the cue-card long turn.
- Part 3 is discussion and abstract reasoning.
- Stages help with ideas, vocabulary, structure, recording, and reflection.

### Mock Test

Mock test is closer to the real exam. It is paid-gated, timed, server-authoritative, and scored by backend AI contracts.

The frontend should not decide final scores. It should guide the student, collect speech/transcripts, and render the backend result clearly.

### Review

Review is spaced repetition for vocabulary, pronunciation, cue structures, grammar patterns, and weak signals. It uses scheduling logic so due items come back at the right time.

### Profile And Settings

Profile holds learner identity, preferences, history, billing, and settings. This area must be boring in the best way: clear, safe, reliable, and hard to misuse.

## Layer 4: MBS Codebase Map

The MBS repository is organized around frontend components, stores, typed clients, backend routes, and tests.

```text
src/
  app-root.ts          App shell and route renderer
  components/          Lit web components
  lib/                 Router, auth clients, API clients, i18n, telemetry
  stores/              nanostores domain state
  data/                Static IELTS content
  design/              Clay Bright tokens and Shoelace skin
  locales/             User-visible translations
server/
  main.py              FastAPI app setup and route mounting
  routes/              API endpoints
  services/            Business logic, scoring, SRS, provider clients
  prompts/             AI prompt templates
tests/
  *.test.ts            Vitest component and unit tests
  playwright/          Browser flows
```

If a question is about UI rendering, start in `src/components/`.

If a question is about shared client behavior, start in `src/lib/`.

If a question is about persistent state, start in `src/stores/`.

If a question is about AI, scoring, billing, auth, or database writes, start in `server/routes/` and `server/services/`.

## Layer 5: Frontend Architecture

MBS uses Lit web components. Each component owns a small piece of UI and subscribes to domain state when needed.

The top-level shell is `app-root.ts`. It:

- Initializes theme, Sentry, auth, push, subscriptions, timezone, memory, and sparks.
- Watches route changes.
- Runs route guards.
- Renders route components.
- Shows top navigation, sidebar navigation, mobile tab bar, update banner, and NOVA companion.

Routes are defined in `src/lib/router.ts`. A route match returns:

```ts
{ route: RouteName, params: Record<string, string> }
```

Important rule: use `.route`. Do not treat `matchRoute()` as a string.

## Layer 6: State And Data Flow

The app uses nanostores.

Important stores:

- `auth-store`: current Supabase session and JWT.
- `tutor-store`: memory bundle and NOVA messages.
- `training-store`: active training session and local draft.
- `mock-test-store`: mock test flow state.
- `sparks-store`: daily motivation/progress layer.
- `subscription-store`: paid plan state.

Typical flow:

```text
Component mounts
  subscribes to store
  renders current state
User acts
  component dispatches event or calls store action
Store updates
  component re-renders
Backend call succeeds/fails
  store or component updates state
  Sentry breadcrumb records important action
```

## Layer 7: Backend Architecture

The backend is FastAPI under `server/`.

Representative modules:

- `server/main.py`: app creation, CORS, middleware, route mounting, static fallback.
- `server/routes/tutor.py`: memory bundle, companion context, review grade, training progress.
- `server/routes/mock_test.py`: paid mock-test attempts, scoring, finalization, attempt listing.
- `server/routes/profile.py`: learner profile and preferences.
- `server/routes/billing.py`: Stripe checkout and webhook flows.
- `server/routes/stt.py` and `server/routes/tts.py`: voice services.
- `server/gemini_live.py`: Gemini Live WebSocket support.
- `server/services/scoring_service.py`: scoring orchestration.
- `server/services/srs.py`: spaced repetition scheduling.

Backend routes authenticate, validate, apply product rules, call providers, write to Supabase, and return typed responses.

## Layer 8: AI Architecture

YNova has several AI layers:

### Scoring AI

Scores IELTS speaking responses. This must be deterministic enough to be trusted and observable enough to debug.

### Tutor AI

Provides contextual support through NOVA. It should use the memory bundle and route context carefully.

### Voice AI

Speech-to-text and text-to-speech support spoken practice. Voice should never autoplay without user action.

### Agentic Development AI

Codex, Claude, Cursor, and Copilot help build the product. They are not runtime product features.

### Memory

Memory is not a magic chatbot memory. It is a structured learner snapshot assembled by backend contracts so the product can personalize safely.

![NOVA thinking state](../../public/nova-poses/thinking.png)

## Layer 9: The Memory Bundle

The memory bundle may include:

- Identity.
- Native language.
- Target band.
- Test date.
- Topic interests.
- Last session summary.
- Review items due.
- Mastery highlights.
- Streak state.
- Preferred L1 lean.

NOVA and home surfaces should use memory only when it is actually present. Do not invent facts about the student.

## Layer 10: Design System And NOVA

YNova uses Clay Bright:

- Sky blue for primary action.
- Amber/gold for NOVA and warm progress.
- Red for danger or exam urgency.
- Green for success.
- Neutral surfaces for clarity.

NOVA states:

- `wave`: welcome.
- `reading`: learning and docs.
- `listening`: student speech.
- `thinking`: AI work.
- `encouraging`: gentle nudge.
- `celebrating`: real milestone.
- `apologetic`: recovery after failure.

![NOVA celebrating state](../../public/nova-poses/celebrating.png)

## Layer 11: Product Management Responsibilities

Yaomin's PM job is to make the system easier to build and easier to trust.

For each task, identify:

- User problem.
- Current behavior.
- Desired behavior.
- Affected routes.
- Affected stores.
- Affected backend routes.
- Copy and localization impact.
- Accessibility impact.
- Observability needed.
- Test plan.
- Open decisions.

Do not hand engineering a vague idea. Hand engineering a decision-ready artifact.

## Layer 12: Common YNova Gotchas

### Gotcha: Static Auth Is Not Real Security

The Yaomin-YNova hub uses simple client-side auth for convenience. Do not store secrets, production data, learner transcripts, or payment data in this hub.

### Gotcha: Backend Contracts Move

Some old docs mention a sibling backend repo. The current MBS repo has backend code under `server/`. Always verify current repo state.

### Gotcha: `npm test` Is Not Enough

MBS requires both:

```bash
npm run build
npm test
```

The build catches TypeScript errors and unused imports that tests can miss.

### Gotcha: Lit And happy-dom Have Edge Cases

Avoid inline conditionals next to event handlers. Keep wrappers stable. Use `svg` for SVGs. Add per-component focus styles.

### Gotcha: Student Copy Must Translate

If copy appears in MBS UI, it probably needs i18n keys across locales.

## Layer 13: First 30 Days For Yaomin

### Week 1: Orientation

- Read this guide.
- Read the architecture overview.
- Run the app locally.
- Add questions as review notes in this hub.
- Observe one code review.

### Week 2: Product Surfaces

- Map the home flow.
- Map training stages.
- Map mock-test modes.
- Review how pricing and paid gates work.
- Draft one small PRD.

### Week 3: AI And Memory

- Study memory bundle fields.
- Trace one NOVA companion request.
- Trace one mock-test scoring request.
- Write an agent boundary diagram.

### Week 4: Ownership

- Own a small product requirement from draft to review.
- Maintain task board and decision log.
- Write release notes for a small change.
- Identify one documentation gap and fix it.

## Layer 14: How To Review Work

Use this order:

1. Is the user behavior correct?
2. Is student trust protected?
3. Is data safe?
4. Is the backend/frontend boundary correct?
5. Are failure states handled?
6. Are accessibility and mobile considered?
7. Are tests enough?
8. Is the implementation simpler than the problem requires?

## Layer 15: Glossary

MBS: Main YNova IELTS Speaking app.

NOVA: The student-facing YNova companion.

FSRS: Spaced repetition scheduling algorithm family.

RLS: Row Level Security in Supabase.

JWT: Auth token used to authenticate API calls.

Sentry: Observability tool for frontend and backend errors/breadcrumbs.

Capacitor: Wrapper that lets the web app run as iOS and Android apps.

Mock test: Paid, timed IELTS-style speaking assessment.

Memory bundle: Backend-built student context used for personalization.

## Final Mental Model

YNova is not just an AI wrapper. It is a learning system:

```text
Student speaks
  YNova listens
  Backend scores and remembers
  NOVA explains and guides
  Review schedules weak items
  Home chooses the next best action
  Student returns tomorrow
```

Every product task should strengthen that loop.

