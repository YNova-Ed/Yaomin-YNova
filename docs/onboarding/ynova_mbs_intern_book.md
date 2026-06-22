# YNova MBS Intern Book

![NOVA reading state](../../public/nova-poses/reading.png)

This book is the 0 to 100 guide for a YNova MBS intern. It explains the product, the codebase shape, the implementation choices, common scenarios, mobile packaging through Capacitor, review habits, and how to work safely with Tamil and AI coding agents.

It is intentionally written in simple terms first, then deeper technical terms. Read it in passes:

If you are completely new to the app, read `YNova MBS Beginner Visual Handbook` first. It gives the visual map. This book gives the deeper handoff detail.

1. Read chapters 1 to 4 to understand what YNova MBS is.
2. Read chapters 5 to 9 to understand how the codebase is organized.
3. Read chapters 10 to 14 before reviewing or writing product requirements.
4. Use chapters 15 to 20 as a working checklist during implementation and review.

## Chapter Plan

```text
Part 1: Foundations
  1. What YNova MBS is
  2. What problem it solves
  3. How IELTS Speaking works
  4. How a student moves through the app

Part 2: Product Architecture
  5. The system map
  6. Frontend responsibilities
  7. Backend responsibilities
  8. Data, auth, and privacy responsibilities
  9. AI, memory, scoring, and voice responsibilities

Part 3: Codebase Architecture
  10. Repository structure
  11. Routing and screens
  12. State stores
  13. API clients and backend routes
  14. Tests and release gates

Part 4: Mobile And Capacitor
  15. Web app versus mobile wrapper
  16. Android and iOS project responsibilities
  17. Push, notifications, audio, permissions, and updates

Part 5: Product Management Practice
  18. How to write a good task
  19. How to review a change
  20. How to explain technical tradeoffs in simple language
```

## Chapter 1: What YNova MBS Is

YNova MBS is the main YNova IELTS Speaking product. It helps learners practice IELTS Speaking, receive feedback, remember what they learned, and return with a clear next action.

The product is not just "AI chat." The product is a learning loop:

```text
Practice
  -> Feedback
  -> Memory
  -> Review
  -> Better next practice
```

NOVA is the student-facing AI companion. NOVA should help the learner feel guided, not watched. NOVA should explain next steps, recover from errors, and make progress visible.

## Chapter 2: What Problem It Solves

IELTS Speaking is difficult because students must speak aloud under pressure. They often do not know:

- whether their answer is long enough,
- whether their grammar mistakes are serious,
- whether vocabulary sounds natural,
- how their fluency compares with IELTS expectations,
- what to practice next,
- whether they are improving over time.

YNova MBS exists to reduce that uncertainty. The app should make speaking practice repeatable, less intimidating, and easier to improve from.

In simple terms:

```text
Student fear:
  "I do not know if I am improving."

YNova answer:
  "Here is what you did, here is what it means, and here is what to do next."
```

## Chapter 3: IELTS Speaking Fundamentals

IELTS Speaking has three parts.

Part 1 is short personal questions. The student answers familiar topics such as home, work, study, hobbies, food, weather, or daily routine.

Part 2 is the long turn. The student receives a cue card, prepares briefly, and speaks for a longer answer.

Part 3 is discussion. The examiner asks broader and more abstract follow-up questions related to the Part 2 topic.

The product must respect this structure because each part trains a different skill:

```text
Part 1:
  Quick answer, natural detail, confidence.

Part 2:
  Structure, story, time control, idea expansion.

Part 3:
  Reasoning, examples, comparison, abstract language.
```

IELTS feedback usually considers fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation. YNova can explain these in friendlier language, but the underlying product must stay aligned with the exam.

## Chapter 4: The Student Journey

A normal learner journey looks like this:

```text
Visitor
  |
  v
Landing page
  |
  v
Signup or login
  |
  v
Onboarding
  |
  v
Home
  |
  +-- Training
  +-- Review
  +-- Mock test
  +-- NOVA companion
  +-- Profile
```

The app should always answer one product question:

```text
"What should the student do next?"
```

If a page does not help the student decide, practice, understand feedback, or return later, it probably needs sharper requirements.

## Chapter 5: High-Level System Map

The current MBS architecture is a web app first, with mobile packaging through Capacitor and backend logic through FastAPI.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 420" role="img" aria-label="YNova MBS high level architecture">
  <rect width="980" height="420" fill="#f8fafc"/>
  <rect x="40" y="40" width="190" height="110" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="135" y="78" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#0f172a">Student</text>
  <text x="135" y="108" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Browser or mobile app</text>
  <rect x="300" y="40" width="220" height="110" rx="8" fill="#fff7ed" stroke="#d97706"/>
  <text x="410" y="75" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#0f172a">Lit + Vite Frontend</text>
  <text x="410" y="105" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Routes, components, stores</text>
  <rect x="600" y="40" width="230" height="110" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="715" y="75" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#0f172a">FastAPI Backend</text>
  <text x="715" y="105" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Scoring, memory, billing, voice</text>
  <rect x="135" y="250" width="180" height="95" rx="8" fill="#f1f5f9" stroke="#64748b"/>
  <text x="225" y="286" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Supabase</text>
  <text x="225" y="314" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Auth, Postgres, Storage</text>
  <rect x="400" y="250" width="180" height="95" rx="8" fill="#fef3c7" stroke="#d97706"/>
  <text x="490" y="286" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">AI Providers</text>
  <text x="490" y="314" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Gemini, Vertex, voice</text>
  <rect x="665" y="250" width="180" height="95" rx="8" fill="#fee2e2" stroke="#dc2626"/>
  <text x="755" y="286" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Stripe / Railway</text>
  <text x="755" y="314" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Payments, hosting, jobs</text>
  <path d="M230 95 H300" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M520 95 H600" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M680 150 C610 210 345 210 260 250" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M710 150 C670 210 555 220 520 250" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M745 150 V250" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

Simple explanation:

- The frontend is what the student sees.
- The backend makes trusted decisions.
- Supabase stores users and learning data.
- AI providers generate scoring, tutoring, and voice features.
- Stripe and hosting tools support payments and deployment.

## Chapter 6: Why The Frontend Exists

The frontend is responsible for the student experience. It should:

- render pages and components,
- collect user input,
- guide navigation,
- show loading, success, and error states,
- call backend APIs,
- manage local UI state,
- keep the interface accessible and responsive.

The frontend should not:

- store provider secrets,
- write with Supabase service-role keys,
- decide paid access,
- decide final mock-test scores,
- duplicate backend scoring prompts,
- pretend static client checks are secure.

Why this boundary exists:

```text
Frontend code is shipped to the user's device.
Anything inside it can be inspected.
Trusted secrets and final decisions belong on the server.
```

## Chapter 7: Why The Backend Exists

The backend owns the trusted product rules. It should:

- authenticate requests,
- validate payloads,
- call AI providers safely,
- assemble learner memory,
- score mock tests and training answers,
- enforce paid gates,
- write service-role database changes,
- handle webhooks,
- hide secrets from the browser.

Simple scenario:

```text
Student submits a paid mock test answer.

Frontend:
  "Here is the answer and attempt id."

Backend:
  "Is the user authenticated?"
  "Is the attempt still valid?"
  "Does the user have access?"
  "Can the answer be scored?"
  "How should the result be stored?"

Frontend:
  "Show the trusted result."
```

## Chapter 8: Data, Auth, And Privacy

IELTS speaking data can be sensitive. Students may mention family, migration goals, school names, jobs, health, money, or personal stress. Treat transcripts, recordings, learner notes, and billing data as private.

YNova MBS uses Supabase for auth and data. The exact schema belongs in the production MBS repo and database migrations, but the mental model is:

```text
User identity
  -> profile and preferences
  -> practice attempts
  -> review items
  -> memory summaries
  -> subscription state
```

Privacy rules:

- Do not put production data into this static documentation repo.
- Do not paste real student transcripts into docs or AI prompts.
- Do not log raw learner speech unless Tamil has approved a redaction strategy.
- Do not store secrets in source files.
- Do not use browser localStorage as a privacy boundary.

## Chapter 9: AI, Memory, Scoring, And Voice

YNova has multiple AI responsibilities. Keep them separate.

```text
Scoring AI:
  evaluates speech against IELTS-like criteria.

Tutor AI:
  explains, nudges, and guides the learner.

Memory:
  summarizes useful learner context for future sessions.

Voice:
  turns speech into text or text into speech.

Development agents:
  help humans build, review, and document the product.
```

The most important implementation rule:

```text
Do not duplicate scoring logic in the frontend.
```

Reason:

- scores must be consistent,
- prompts and parsing must be auditable,
- paid mock tests need server authority,
- provider keys must stay private,
- bug fixes should happen in one place.

## Chapter 10: Repository Structure

The production MBS repo is documented as having this shape. Always verify against the current MBS repo before editing, because the source repo can evolve.

```text
YNova-MBS/
  src/
    app-root.ts
    components/
    lib/
    stores/
    data/
    design/
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

How to read this:

- `src/` is the web frontend.
- `server/` is the FastAPI backend.
- `tests/` is frontend and browser verification.
- `docs/` is product and engineering history.
- `android/` and `ios/` are Capacitor native projects.
- `public/` contains static assets.

## Chapter 11: Routes And Screens

Routing turns a URL into a screen. In MBS, `src/lib/router.ts` is the map.

Simple example:

```text
/home
  -> route: "home"
  -> app-root renders home view

/mock-test/results/123
  -> route: "mock-test-results"
  -> params: { id: "123" }
  -> app-root renders results view with that id
```

Important rule:

```text
matchRoute(path).route
```

Do not treat the whole `matchRoute()` result as a string. It returns an object because route params matter.

Why this implementation is useful:

- it keeps navigation predictable,
- it lets the app validate missing params,
- it helps tests assert route behavior,
- it avoids every component inventing its own URL parsing.

## Chapter 12: Components

Components are the UI building blocks. MBS uses Lit web components. A component should usually own one screen, panel, card, or interaction.

Good component behavior:

- receive data through properties or stores,
- render clear HTML,
- handle local events,
- unsubscribe from stores when removed,
- show loading and error states,
- keep focus states accessible.

Bad component behavior:

- direct provider calls,
- hidden business rules,
- copy-pasted scoring logic,
- untracked timers,
- no keyboard access,
- user-visible English strings that bypass localization.

Scenario:

```text
Need to add a "practice again" button to a score screen.

Good:
  Component renders a button.
  Button calls the existing navigation helper.
  Text uses localization.
  Test checks button and route.

Bad:
  Component manually rewrites window.location.
  Text is hardcoded in one language.
  Button has no focus style.
```

## Chapter 13: Stores

Stores hold domain state. MBS uses nanostores, so a store can be subscribed to by multiple components.

Simple model:

```text
Store:
  "Here is the current state."

Action:
  "Here is the only supported way to change that state."

Component:
  "I subscribe, render, and call actions when the user acts."
```

Why this exists:

- multiple screens can share the same source of truth,
- tests can exercise state without rendering the whole app,
- components stay smaller,
- side effects become easier to locate.

Common store domains:

- auth session,
- tutor and memory,
- training flow,
- mock test flow,
- review items,
- subscription state,
- sparks and motivation.

## Chapter 14: API Clients And Backend Routes

API clients translate frontend actions into HTTP calls. Backend routes translate HTTP calls into trusted product behavior.

Typical flow:

```text
Component
  -> calls store action
  -> store calls API client
  -> API client calls backend route
  -> backend validates and performs work
  -> response returns
  -> store updates
  -> component re-renders
```

Why not call `fetch()` everywhere?

- contracts become scattered,
- errors become inconsistent,
- retries and auth headers get duplicated,
- tests become harder,
- product behavior becomes harder to audit.

When Yaomin writes a requirement, include:

- route or screen,
- backend endpoint if needed,
- request fields,
- response fields,
- loading state,
- empty state,
- failure state,
- test expectation.

## Chapter 15: Tests And Release Gates

Testing is not ceremony. It is how the team protects student trust.

Use the smallest test that catches the risk:

```text
Pure helper:
  unit test

Lit component:
  component test with happy-dom

Navigation flow:
  Playwright test

Backend route:
  pytest route/service test

Release smoke:
  manual or automated browser check
```

Required MBS gate:

```bash
npm run build
npm test
```

For this static Yaomin-YNova hub:

```bash
npm test
npm run build
```

## Chapter 16: Capacitor Fundamentals

Capacitor wraps the web app inside native Android and iOS shells.

Simple explanation:

```text
The app is still mostly web code.
Capacitor gives it a mobile container and access to selected native APIs.
```

Capacitor does not magically turn web code into a fully native app. The web build still matters. CSS responsiveness still matters. Auth redirects still matter. Audio permissions still matter.

Typical Capacitor workflow:

```text
npm run build
  -> creates web assets

npx cap sync
  -> copies web assets and plugin config into android/ and ios/

Open Android Studio or Xcode
  -> build, sign, run, test native behavior
```

Intern rule:

```text
If it breaks in the browser, fix the web app first.
If it only breaks after native packaging, inspect Capacitor config, native permissions, plugin versions, and platform logs.
```

## Chapter 17: Mobile Responsibilities

Mobile adds new failure modes:

- microphone permissions,
- notification permissions,
- deep links and auth redirects,
- keyboard covering inputs,
- safe-area insets,
- offline or flaky networks,
- app pause/resume,
- background audio restrictions,
- platform signing,
- store release rules.

Scenario:

```text
Student taps record on iOS and nothing happens.

Check:
  Is the button enabled?
  Did the browser version work?
  Did iOS request microphone permission?
  Is the permission string configured?
  Is there a platform log?
  Does the app show a useful recovery message?
```

## Chapter 18: How To Write A Good Task

A useful task is not "fix profile." A useful task says what outcome is needed and how to verify it.

Template:

```text
Title:
  Add editable school name to profile settings

Problem:
  Students cannot correct the school associated with their account.

Scope:
  Profile settings UI, profile API contract, validation, saved state.

Acceptance criteria:
  Student can edit school name.
  Empty school name is allowed only if product approves.
  Save errors are visible.
  The updated value appears after refresh.

Verification:
  Unit or component test for validation.
  Manual browser check.
  npm run build.
  npm test.
```

Good tasks reduce guesswork. They also make code review faster because reviewers can compare behavior against explicit criteria.

## Chapter 19: How To Review A Change

Review in severity order.

1. Could this break core learning or paid access?
2. Could this expose private data or secrets?
3. Could this create wrong scoring or misleading feedback?
4. Could this block signup, login, practice, review, mock tests, or billing?
5. Could this fail on mobile or keyboard-only usage?
6. Are tests missing for the risky path?
7. Is the code harder to maintain than necessary?

Review comments should be specific:

```text
Weak:
  "This is confusing."

Useful:
  "This component treats a 410 expired mock-test response as a generic network error, so students will not know the attempt expired. Please branch on 410 and show the existing expired-attempt recovery copy."
```

## Chapter 20: Explaining Tradeoffs Simply

An intern should be able to explain engineering choices without hiding behind jargon.

Examples:

```text
Why does scoring happen on the server?
  Because scores must be trusted, consistent, and protected from client tampering.

Why use stores?
  Because multiple screens need the same state and we do not want every component to invent its own version.

Why use Capacitor instead of two native apps immediately?
  Because the product can share one web codebase while still shipping mobile wrappers and selected native features.

Why not write GitHub issues directly from this static hub?
  Because a static site cannot safely keep a write token secret.

Why run build and tests?
  Because tests catch behavior regressions and the build catches TypeScript and bundling problems that tests may miss.
```

## Full Codebase Reading Path

Use this order when onboarding into the production MBS repo:

```text
1. Read CLAUDE.md and AGENTS.md
2. Read README or setup docs
3. Read package.json scripts
4. Read src/lib/router.ts
5. Read src/app-root.ts
6. Read src/stores/auth-store.ts
7. Read the store for the feature area
8. Read the component for the screen
9. Read the API client called by the store/component
10. Read server/main.py
11. Read the relevant server/routes module
12. Read the relevant server/services module
13. Read tests for the feature area
14. Run build and tests
15. Write notes about unknowns before changing code
```

## Common Scenario Walkthroughs

### Scenario A: Student Completes Onboarding

```text
User action:
  Student enters language, target band, interests, and test date.

Frontend:
  Renders onboarding screens.
  Validates obvious empty or invalid fields.
  Sends profile data through the correct client/store.

Backend:
  Validates authenticated user.
  Saves profile preferences.
  Updates learner memory inputs.

Result:
  Home can personalize next actions.
```

Why implemented this way: onboarding data affects personalization, so it must become trusted profile state instead of remaining local UI state.

### Scenario B: Student Takes A Mock Test

```text
User action:
  Student starts a paid mock test.

Frontend:
  Shows timed flow and records answers.
  Sends attempt operations to backend.
  Displays 402, 410, loading, and scoring errors clearly.

Backend:
  Confirms subscription.
  Creates or resumes attempt.
  Owns expiry time.
  Scores each part.
  Stores final result.

Result:
  Student receives a result they can trust.
```

Why implemented this way: paid attempts and final scores must be server-authoritative.

### Scenario C: NOVA Gives A Companion Message

```text
User action:
  Student visits home or review.

Frontend:
  Sends route context and available state.

Backend or AI service:
  Uses learner memory carefully.
  Generates a short useful companion line.

Frontend:
  Shows the line with the right NOVA state.
```

Why implemented this way: NOVA should be contextual, but she should not invent facts or expose raw private data unnecessarily.

### Scenario D: Student Reviews A Due Item

```text
User action:
  Student answers a vocabulary, grammar, cue, or pronunciation card.

Frontend:
  Presents the card and captures result.

Backend:
  Updates scheduling state.
  Decides when the item should return.

Result:
  Review stays useful without overwhelming the student.
```

Why implemented this way: spaced repetition is a product rule, not just a visual checkbox.

### Scenario E: Static Hub Creates A Shared Task

```text
User action:
  Tamil opens the Yaomin-YNova dashboard and clicks GitHub task.

Browser:
  Opens GitHub issue form.

GitHub:
  Authenticates write action.
  Stores issue and comments.
  Workflows sync labels.

Dashboard:
  Reads public issue state back through GitHub API.
```

Why implemented this way: the static hub must not embed a GitHub write token.

## Diagrams To Remember

### Learning Loop

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260" role="img" aria-label="YNova learning loop">
  <rect width="760" height="260" fill="#ffffff"/>
  <circle cx="130" cy="130" r="58" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="130" y="126" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Practice</text>
  <text x="130" y="148" text-anchor="middle" font-family="Arial" font-size="12">Speak aloud</text>
  <circle cx="310" cy="130" r="58" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="310" y="126" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Feedback</text>
  <text x="310" y="148" text-anchor="middle" font-family="Arial" font-size="12">Know what changed</text>
  <circle cx="490" cy="130" r="58" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="490" y="126" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Memory</text>
  <text x="490" y="148" text-anchor="middle" font-family="Arial" font-size="12">Keep useful context</text>
  <circle cx="650" cy="130" r="58" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <text x="650" y="126" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Review</text>
  <text x="650" y="148" text-anchor="middle" font-family="Arial" font-size="12">Return smarter</text>
  <path d="M188 130 H250" stroke="#0f172a" stroke-width="2" marker-end="url(#loopArrow)"/>
  <path d="M368 130 H430" stroke="#0f172a" stroke-width="2" marker-end="url(#loopArrow)"/>
  <path d="M548 130 H592" stroke="#0f172a" stroke-width="2" marker-end="url(#loopArrow)"/>
  <path d="M650 188 C650 235 130 235 130 190" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#loopArrow)"/>
  <defs>
    <marker id="loopArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

### Responsibility Split

```text
Frontend owns:
  experience, forms, routes, state display, accessibility

Backend owns:
  trust, scoring, paid gates, provider calls, service-role writes

Database owns:
  durable records, auth identity, review history, subscriptions

AI owns:
  generated feedback, tutoring language, scoring assistance

Humans own:
  product judgment, review, release decisions, privacy boundaries
```

## Glossary

```text
Capacitor:
  Tool that packages the web app into native Android and iOS shells.

FastAPI:
  Python backend framework used for trusted API routes.

Lit:
  Web component library used for MBS frontend components.

Nanostores:
  Small state-management library used by the frontend.

NOVA:
  YNova's AI companion and mascot.

RLS:
  Row Level Security in Supabase. It limits what database rows a user can access.

Sentry:
  Error and telemetry tool for debugging production problems.

Service role:
  Powerful backend-only Supabase key. Never expose it to frontend code.

Static hub:
  This Yaomin-YNova repository. It hosts docs and onboarding state, not production data.
```

## Intern Definition Of Ready

Before Yaomin starts an implementation task, she should be able to answer:

- What user problem is this solving?
- Which screen or route changes?
- Which store changes?
- Which backend route changes?
- What data is read or written?
- What happens on loading, empty, error, and success states?
- What privacy risk exists?
- What tests will prove it works?
- What should Tamil review?

## Intern Definition Of Done

A task is done when:

- acceptance criteria are met,
- build and tests pass,
- mobile or responsive behavior is checked when relevant,
- errors are useful,
- accessibility is not worse,
- no secrets or production data were added,
- documentation or task notes explain the decision,
- Tamil can review the change without guessing intent.

## Final Rule

When unsure, do not guess silently. Write down the assumption, verify the source file, and ask Tamil for the product decision if the code does not already answer it.
