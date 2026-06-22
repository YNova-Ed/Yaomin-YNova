# YNova MBS Beginner Visual Handbook

![NOVA reading state](../../public/nova-poses/reading.png)

This is the beginner-friendly visual handbook for someone new to YNova MBS. It assumes the reader is smart but new to this codebase, product, and architecture. It explains the system in simple terms first, then shows how the pieces connect.

Use this as the first document before reading the deeper architecture, engineering, design, and handoff guides.

## How To Use This Handbook

Read in this order:

1. Understand what YNova MBS does for a learner.
2. Understand the big system map.
3. Learn the frontend, backend, database, AI, and mobile responsibilities.
4. Learn how one user action travels through the app.
5. Learn how to find the right file when you need to change something.
6. Learn what not to touch until Tamil reviews the plan.

Do not try to memorize every file. The goal is to build a map in your head.

## The Short Version

YNova MBS is an IELTS Speaking practice product.

In plain English:

```text
Student speaks
  -> app records or collects the answer
  -> backend checks rules and calls AI
  -> result is stored safely
  -> student sees feedback
  -> app remembers what to review later
```

The product is not a generic chatbot. It is a structured learning system.

## Beginner Mental Model

Think of the product like a school with different rooms:

```text
Landing page:
  explains why YNova exists.

Auth:
  lets the student enter safely.

Onboarding:
  learns who the student is.

Home:
  tells the student what to do next.

Training:
  gives small speaking practice.

Mock test:
  gives serious exam-style practice.

Review:
  brings weak items back at the right time.

NOVA:
  guides, explains, encourages, and recovers errors.

Profile:
  stores preferences, billing, history, and settings.
```

## Visual 1: Whole Product Map

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 560" role="img" aria-label="Whole YNova MBS product map">
  <rect width="1040" height="560" fill="#f8fafc"/>
  <text x="520" y="36" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="#0f172a">YNova MBS: From Student Action To Learning Memory</text>
  <rect x="45" y="90" width="160" height="80" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="125" y="122" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Student</text>
  <text x="125" y="146" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">speaks, taps, reads</text>
  <rect x="265" y="90" width="180" height="80" rx="8" fill="#fff7ed" stroke="#d97706" stroke-width="2"/>
  <text x="355" y="122" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Frontend</text>
  <text x="355" y="146" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Lit, routes, stores</text>
  <rect x="505" y="90" width="180" height="80" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="595" y="122" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Backend</text>
  <text x="595" y="146" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">FastAPI trusted rules</text>
  <rect x="745" y="90" width="210" height="80" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="850" y="122" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Providers</text>
  <text x="850" y="146" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">AI, voice, billing</text>
  <rect x="145" y="285" width="180" height="80" rx="8" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
  <text x="235" y="317" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Supabase</text>
  <text x="235" y="341" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">auth, data, storage</text>
  <rect x="430" y="285" width="180" height="80" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <text x="520" y="317" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Trust Boundary</text>
  <text x="520" y="341" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">server decides</text>
  <rect x="715" y="285" width="180" height="80" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="805" y="317" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Learning Result</text>
  <text x="805" y="341" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">feedback and review</text>
  <path d="M205 130 H265" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWhole)"/>
  <path d="M445 130 H505" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWhole)"/>
  <path d="M685 130 H745" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWhole)"/>
  <path d="M595 170 V250 C595 270 560 285 525 285" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowWhole)"/>
  <path d="M595 170 C520 235 335 235 250 285" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowWhole)"/>
  <path d="M610 325 H715" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWhole)"/>
  <path d="M805 365 C805 460 125 460 125 175" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowWhole)"/>
  <text x="520" y="460" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0f172a">The loop repeats: practice, feedback, memory, review, next action.</text>
  <defs>
    <marker id="arrowWhole" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## The Five Big Responsibilities

Every feature belongs mostly to one of these buckets.

```text
Frontend:
  What the student sees and clicks.

Backend:
  Trusted business rules, AI calls, scoring, paid gates, and protected writes.

Database:
  Durable learner records, auth identity, review history, and subscriptions.

AI providers:
  Scoring help, tutoring text, memory support, speech-to-text, and text-to-speech.

Humans:
  Product judgment, privacy decisions, review, release, and support.
```

If you are confused, ask: "Which bucket owns this decision?"

## Visual 2: Responsibility Matrix

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" role="img" aria-label="Responsibility matrix">
  <rect width="1000" height="500" fill="#ffffff"/>
  <text x="500" y="34" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">Who Owns What?</text>
  <g font-family="Arial" font-size="13" fill="#0f172a">
    <rect x="40" y="70" width="180" height="60" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
    <text x="130" y="98" text-anchor="middle" font-size="16" font-weight="700">Frontend</text>
    <text x="130" y="118" text-anchor="middle">display and input</text>
    <rect x="250" y="70" width="180" height="60" rx="8" fill="#dcfce7" stroke="#16a34a"/>
    <text x="340" y="98" text-anchor="middle" font-size="16" font-weight="700">Backend</text>
    <text x="340" y="118" text-anchor="middle">trusted rules</text>
    <rect x="460" y="70" width="180" height="60" rx="8" fill="#f1f5f9" stroke="#64748b"/>
    <text x="550" y="98" text-anchor="middle" font-size="16" font-weight="700">Database</text>
    <text x="550" y="118" text-anchor="middle">durable records</text>
    <rect x="670" y="70" width="180" height="60" rx="8" fill="#fef3c7" stroke="#d97706"/>
    <text x="760" y="98" text-anchor="middle" font-size="16" font-weight="700">AI Providers</text>
    <text x="760" y="118" text-anchor="middle">generated help</text>
    <rect x="360" y="200" width="280" height="60" rx="8" fill="#fee2e2" stroke="#dc2626"/>
    <text x="500" y="228" text-anchor="middle" font-size="16" font-weight="700">Human Review</text>
    <text x="500" y="248" text-anchor="middle">product, privacy, release judgment</text>
  </g>
  <path d="M130 130 C130 185 360 180 420 200" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowMatrix)"/>
  <path d="M340 130 V200" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowMatrix)"/>
  <path d="M550 130 C550 165 530 178 510 200" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowMatrix)"/>
  <path d="M760 130 C760 185 640 180 580 200" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowMatrix)"/>
  <rect x="70" y="330" width="860" height="95" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="500" y="360" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#0f172a">Beginner Rule</text>
  <text x="500" y="390" text-anchor="middle" font-family="Arial" font-size="14" fill="#334155">Frontend may ask. Backend decides. Database remembers. AI assists. Humans approve the risky decisions.</text>
  <defs>
    <marker id="arrowMatrix" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## Codebase Map For Beginners

The MBS repo can feel large. Use this map before opening files randomly.

```text
YNova-MBS/
  src/
    app-root.ts          The app shell. It decides what screen appears.
    components/          UI pieces. Buttons, pages, cards, flows.
    stores/              Shared state and actions.
    lib/                 Router, API clients, auth helpers, utilities.
    data/                Static IELTS content.
    design/              Tokens, theme, component skin.
    locales/             Translation strings.

  server/
    main.py              FastAPI app setup.
    routes/              HTTP endpoints.
    services/            Business logic, AI/scoring helpers, scheduling.
    prompts/             AI prompt templates.
    data/                Backend static data or fixtures.

  tests/
    unit/component tests
    playwright browser flows

  android/ and ios/
    Capacitor mobile shells.

  docs/
    Product, architecture, audits, and decision notes.
```

## Visual 3: Folder Dependency Graph

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 520" role="img" aria-label="Codebase folder dependency graph">
  <rect width="980" height="520" fill="#f8fafc"/>
  <text x="490" y="34" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">How The Main Folders Relate</text>
  <rect x="60" y="90" width="160" height="70" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="140" y="118" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">components/</text>
  <text x="140" y="140" text-anchor="middle" font-family="Arial" font-size="12">screens and UI</text>
  <rect x="300" y="90" width="160" height="70" rx="8" fill="#fff7ed" stroke="#d97706"/>
  <text x="380" y="118" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">stores/</text>
  <text x="380" y="140" text-anchor="middle" font-family="Arial" font-size="12">state and actions</text>
  <rect x="540" y="90" width="160" height="70" rx="8" fill="#fef3c7" stroke="#d97706"/>
  <text x="620" y="118" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">lib/</text>
  <text x="620" y="140" text-anchor="middle" font-family="Arial" font-size="12">router and clients</text>
  <rect x="760" y="90" width="160" height="70" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="840" y="118" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">server/routes/</text>
  <text x="840" y="140" text-anchor="middle" font-family="Arial" font-size="12">API endpoints</text>
  <rect x="760" y="250" width="160" height="70" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="840" y="278" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">services/</text>
  <text x="840" y="300" text-anchor="middle" font-family="Arial" font-size="12">business logic</text>
  <rect x="520" y="250" width="160" height="70" rx="8" fill="#f1f5f9" stroke="#64748b"/>
  <text x="600" y="278" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Supabase</text>
  <text x="600" y="300" text-anchor="middle" font-family="Arial" font-size="12">auth, db, storage</text>
  <rect x="270" y="250" width="160" height="70" rx="8" fill="#fee2e2" stroke="#dc2626"/>
  <text x="350" y="278" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">providers</text>
  <text x="350" y="300" text-anchor="middle" font-family="Arial" font-size="12">AI, voice, billing</text>
  <rect x="60" y="390" width="860" height="70" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="490" y="420" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700" fill="#0f172a">Read direction for a feature</text>
  <text x="490" y="444" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">UI component -> store/action -> API client -> backend route -> service -> database/provider -> response back to UI</text>
  <path d="M220 125 H300" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFolder)"/>
  <path d="M460 125 H540" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFolder)"/>
  <path d="M700 125 H760" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFolder)"/>
  <path d="M840 160 V250" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFolder)"/>
  <path d="M760 285 H680" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFolder)"/>
  <path d="M760 300 C650 365 455 360 380 320" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowFolder)"/>
  <defs>
    <marker id="arrowFolder" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## How One Click Moves Through The App

Example: the student clicks a button to start or continue a mock test.

```text
Button click
  -> component event handler
  -> store action
  -> API client
  -> backend route
  -> backend service
  -> Supabase/provider
  -> response
  -> store update
  -> component re-renders
```

Each layer has a job:

- The component should not decide paid access.
- The store should not know provider secrets.
- The API client should not invent scoring rules.
- The backend route should validate the request.
- The service should own the real product rule.
- The database should store only what is needed.

## Visual 4: Request Lifecycle

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 340" role="img" aria-label="Request lifecycle">
  <rect width="1040" height="340" fill="#ffffff"/>
  <text x="520" y="34" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">One User Action: UI To Backend And Back</text>
  <g font-family="Arial" fill="#0f172a">
    <rect x="35" y="100" width="125" height="70" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
    <text x="97" y="130" text-anchor="middle" font-size="15" font-weight="700">Component</text>
    <text x="97" y="151" text-anchor="middle" font-size="11">click handler</text>
    <rect x="200" y="100" width="125" height="70" rx="8" fill="#fff7ed" stroke="#d97706"/>
    <text x="262" y="130" text-anchor="middle" font-size="15" font-weight="700">Store</text>
    <text x="262" y="151" text-anchor="middle" font-size="11">state action</text>
    <rect x="365" y="100" width="125" height="70" rx="8" fill="#fef3c7" stroke="#d97706"/>
    <text x="427" y="130" text-anchor="middle" font-size="15" font-weight="700">API Client</text>
    <text x="427" y="151" text-anchor="middle" font-size="11">HTTP call</text>
    <rect x="530" y="100" width="125" height="70" rx="8" fill="#dcfce7" stroke="#16a34a"/>
    <text x="592" y="130" text-anchor="middle" font-size="15" font-weight="700">Route</text>
    <text x="592" y="151" text-anchor="middle" font-size="11">validate</text>
    <rect x="695" y="100" width="125" height="70" rx="8" fill="#dcfce7" stroke="#16a34a"/>
    <text x="757" y="130" text-anchor="middle" font-size="15" font-weight="700">Service</text>
    <text x="757" y="151" text-anchor="middle" font-size="11">business rule</text>
    <rect x="860" y="100" width="140" height="70" rx="8" fill="#f1f5f9" stroke="#64748b"/>
    <text x="930" y="130" text-anchor="middle" font-size="15" font-weight="700">Data/Provider</text>
    <text x="930" y="151" text-anchor="middle" font-size="11">store or call AI</text>
  </g>
  <path d="M160 135 H200" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowRequest)"/>
  <path d="M325 135 H365" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowRequest)"/>
  <path d="M490 135 H530" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowRequest)"/>
  <path d="M655 135 H695" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowRequest)"/>
  <path d="M820 135 H860" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowRequest)"/>
  <path d="M930 170 C930 255 110 255 100 175" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowRequest)"/>
  <text x="520" y="275" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0f172a">Return path: response -> state update -> UI re-render -> student sees useful result.</text>
  <defs>
    <marker id="arrowRequest" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## How To Find The Right File

Use symptoms to choose where to start.

```text
Problem: "The button looks wrong."
Start: src/components/ and src/design/

Problem: "The page URL goes somewhere wrong."
Start: src/lib/router.ts and src/app-root.ts

Problem: "The data is stale or not shared."
Start: src/stores/ and API client in src/lib/

Problem: "The backend returns a bad response."
Start: server/routes/ then server/services/

Problem: "The score is wrong."
Start: server scoring route/service and tests. Do not fix in frontend.

Problem: "Mobile recording fails."
Start: browser recording behavior, then Capacitor permissions and native logs.

Problem: "A paid feature is available for the wrong user."
Start: backend billing/subscription route and service. Do not trust frontend gating.
```

## Visual 5: Debugging Decision Tree

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 650" role="img" aria-label="Debugging decision tree">
  <rect width="1040" height="650" fill="#f8fafc"/>
  <text x="520" y="34" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">Where Should A Beginner Start Debugging?</text>
  <rect x="410" y="70" width="220" height="65" rx="8" fill="#ffffff" stroke="#0ea5e9" stroke-width="2"/>
  <text x="520" y="98" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700" fill="#0f172a">What is broken?</text>
  <text x="520" y="120" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Describe the symptom first.</text>
  <rect x="60" y="210" width="180" height="70" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="150" y="238" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700">Visual/UI</text>
  <text x="150" y="260" text-anchor="middle" font-family="Arial" font-size="12">component or CSS</text>
  <rect x="310" y="210" width="180" height="70" rx="8" fill="#fff7ed" stroke="#d97706"/>
  <text x="400" y="238" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700">State/Flow</text>
  <text x="400" y="260" text-anchor="middle" font-family="Arial" font-size="12">store or router</text>
  <rect x="560" y="210" width="180" height="70" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="650" y="238" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700">API/Backend</text>
  <text x="650" y="260" text-anchor="middle" font-family="Arial" font-size="12">route or service</text>
  <rect x="810" y="210" width="180" height="70" rx="8" fill="#fee2e2" stroke="#dc2626"/>
  <text x="900" y="238" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700">Trust/Security</text>
  <text x="900" y="260" text-anchor="middle" font-family="Arial" font-size="12">ask before editing</text>
  <rect x="60" y="390" width="180" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="150" y="420" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700">Read</text>
  <text x="150" y="444" text-anchor="middle" font-family="Arial" font-size="12">component file</text>
  <text x="150" y="462" text-anchor="middle" font-family="Arial" font-size="12">style tokens</text>
  <rect x="310" y="390" width="180" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="400" y="420" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700">Read</text>
  <text x="400" y="444" text-anchor="middle" font-family="Arial" font-size="12">router</text>
  <text x="400" y="462" text-anchor="middle" font-family="Arial" font-size="12">domain store</text>
  <rect x="560" y="390" width="180" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="650" y="420" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700">Read</text>
  <text x="650" y="444" text-anchor="middle" font-family="Arial" font-size="12">server route</text>
  <text x="650" y="462" text-anchor="middle" font-family="Arial" font-size="12">service and tests</text>
  <rect x="810" y="390" width="180" height="80" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="900" y="420" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700">Stop</text>
  <text x="900" y="444" text-anchor="middle" font-family="Arial" font-size="12">write assumption</text>
  <text x="900" y="462" text-anchor="middle" font-family="Arial" font-size="12">ask Tamil</text>
  <path d="M520 135 C430 175 240 175 150 210" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowDebug)"/>
  <path d="M520 135 C480 175 430 175 400 210" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowDebug)"/>
  <path d="M520 135 C560 175 620 175 650 210" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowDebug)"/>
  <path d="M520 135 C670 170 820 175 900 210" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowDebug)"/>
  <path d="M150 280 V390" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowDebug)"/>
  <path d="M400 280 V390" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowDebug)"/>
  <path d="M650 280 V390" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowDebug)"/>
  <path d="M900 280 V390" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowDebug)"/>
  <text x="520" y="565" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0f172a">A good beginner does not guess. A good beginner narrows the problem.</text>
  <defs>
    <marker id="arrowDebug" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## The Product Loop In Detail

YNova should help the learner repeat this loop:

```text
1. Choose or receive a speaking task.
2. Prepare with enough structure.
3. Speak or write an answer.
4. Receive feedback.
5. Save useful learning signals.
6. Review weak items later.
7. Return tomorrow with a clearer next action.
```

What makes this product different from a simple AI chat:

- the app remembers structured learning signals,
- the app uses IELTS-specific flows,
- the app separates practice from mock tests,
- the app treats scoring as a trust boundary,
- the app gives the learner a next action.

## Visual 6: Learning Loop Graph

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-label="Learning loop graph">
  <rect width="900" height="430" fill="#ffffff"/>
  <text x="450" y="34" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">The Learning Loop</text>
  <circle cx="140" cy="170" r="62" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="140" y="165" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Practice</text>
  <text x="140" y="188" text-anchor="middle" font-family="Arial" font-size="12">answer aloud</text>
  <circle cx="330" cy="170" r="62" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="330" y="165" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Feedback</text>
  <text x="330" y="188" text-anchor="middle" font-family="Arial" font-size="12">understand gap</text>
  <circle cx="520" cy="170" r="62" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="520" y="165" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Memory</text>
  <text x="520" y="188" text-anchor="middle" font-family="Arial" font-size="12">store signal</text>
  <circle cx="710" cy="170" r="62" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <text x="710" y="165" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Review</text>
  <text x="710" y="188" text-anchor="middle" font-family="Arial" font-size="12">repeat later</text>
  <path d="M202 170 H268" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowLoop2)"/>
  <path d="M392 170 H458" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowLoop2)"/>
  <path d="M582 170 H648" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowLoop2)"/>
  <path d="M710 232 C710 340 140 340 140 235" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowLoop2)"/>
  <rect x="210" y="285" width="480" height="70" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="450" y="315" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0f172a">Product question</text>
  <text x="450" y="340" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Does this change help the student complete this loop with less confusion?</text>
  <defs>
    <marker id="arrowLoop2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## Frontend Explained For Beginners

The frontend is the part the student sees in the browser or mobile wrapper.

It is responsible for:

- showing screens,
- collecting input,
- routing the user,
- showing loading and error states,
- calling backend APIs,
- rendering feedback clearly,
- staying keyboard and mobile friendly.

It is not responsible for:

- final scoring,
- payment authority,
- provider secrets,
- service-role database writes,
- deciding whether a paid attempt is valid.

## Component Anatomy

Most components should follow this pattern:

```text
Imports
  -> component class
  -> properties and local state
  -> store subscription in connectedCallback
  -> cleanup in disconnectedCallback
  -> event handlers
  -> render method
  -> styles
```

When reviewing a component, ask:

- What state does it read?
- What action does it trigger?
- What happens while loading?
- What happens when the backend fails?
- Can a keyboard user do the same thing?
- Does the copy come from localization where needed?

## Backend Explained For Beginners

The backend is the trusted part of the system.

It is responsible for:

- validating requests,
- checking auth,
- checking paid access,
- calling AI or voice providers,
- parsing and storing results,
- assembling learner memory,
- writing with service-role permissions,
- handling webhooks.

The backend should be boring and strict. That is good. Strict backend rules prevent trust problems.

## Visual 7: Trust Boundary

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 420" role="img" aria-label="Frontend backend trust boundary">
  <rect width="940" height="420" fill="#f8fafc"/>
  <text x="470" y="36" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">Trust Boundary: What The Browser Can And Cannot Decide</text>
  <rect x="55" y="95" width="330" height="210" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="220" y="130" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#0f172a">Browser / Frontend</text>
  <text x="95" y="170" font-family="Arial" font-size="14" fill="#0f172a">Can:</text>
  <text x="115" y="198" font-family="Arial" font-size="13" fill="#334155">show UI, collect input, call APIs</text>
  <text x="95" y="238" font-family="Arial" font-size="14" fill="#0f172a">Cannot:</text>
  <text x="115" y="266" font-family="Arial" font-size="13" fill="#334155">protect secrets or decide final trust</text>
  <rect x="555" y="95" width="330" height="210" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="720" y="130" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#0f172a">Server / Backend</text>
  <text x="595" y="170" font-family="Arial" font-size="14" fill="#0f172a">Can:</text>
  <text x="615" y="198" font-family="Arial" font-size="13" fill="#334155">check auth, scoring, billing, writes</text>
  <text x="595" y="238" font-family="Arial" font-size="14" fill="#0f172a">Must:</text>
  <text x="615" y="266" font-family="Arial" font-size="13" fill="#334155">validate, log safely, hide secrets</text>
  <line x1="470" y1="80" x2="470" y2="340" stroke="#dc2626" stroke-width="3" stroke-dasharray="10 8"/>
  <text x="470" y="370" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700" fill="#dc2626">Never move protected decisions left of this line.</text>
</svg>

## Data And Privacy Explained

Learner data can be sensitive even when it looks ordinary. A speaking answer may reveal family, money, immigration goals, school, job, health, or personal stress.

Privacy ladder:

```text
Public:
  product docs, generic examples, non-sensitive screenshots.

Internal:
  task notes, architecture notes, non-sensitive onboarding docs.

Sensitive:
  learner profile details, subscription state, private notes.

Highly sensitive:
  transcripts, recordings, billing details, secrets, provider keys.
```

Rule for this Yaomin-YNova hub:

```text
Do not store sensitive or highly sensitive production data here.
```

## Visual 8: Data Sensitivity Ladder

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-label="Data sensitivity ladder">
  <rect width="900" height="430" fill="#ffffff"/>
  <text x="450" y="36" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">Data Sensitivity Ladder</text>
  <rect x="130" y="310" width="640" height="60" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="450" y="346" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Public: generic docs and examples</text>
  <rect x="170" y="235" width="560" height="60" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="450" y="271" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Internal: onboarding and task notes</text>
  <rect x="210" y="160" width="480" height="60" rx="8" fill="#fef3c7" stroke="#d97706"/>
  <text x="450" y="196" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Sensitive: learner profile and subscription</text>
  <rect x="250" y="85" width="400" height="60" rx="8" fill="#fee2e2" stroke="#dc2626"/>
  <text x="450" y="121" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Highly sensitive: transcripts, audio, secrets</text>
  <text x="450" y="398" text-anchor="middle" font-family="Arial" font-size="14" fill="#334155">This static hub should stay in the public/internal range only.</text>
</svg>

## AI Explained For Beginners

AI is not one thing in YNova. It appears in different jobs:

```text
Scoring:
  helps evaluate an IELTS-style answer.

Tutor:
  explains and nudges through NOVA.

Memory:
  helps summarize what the learner needs later.

Voice:
  speech-to-text and text-to-speech.

Development agents:
  Codex, Claude, Cursor, Copilot helping humans build the app.
```

Do not mix these up. A prompt that is good for a friendly companion message is not automatically good for scoring. A scoring result is not automatically safe as a memory summary.

## Visual 9: AI Role Map

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 460" role="img" aria-label="AI role map">
  <rect width="980" height="460" fill="#f8fafc"/>
  <text x="490" y="36" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">AI Roles In YNova MBS</text>
  <rect x="60" y="95" width="170" height="85" rx="8" fill="#fee2e2" stroke="#dc2626"/>
  <text x="145" y="128" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Scoring AI</text>
  <text x="145" y="153" text-anchor="middle" font-family="Arial" font-size="12">trust-sensitive</text>
  <rect x="285" y="95" width="170" height="85" rx="8" fill="#fef3c7" stroke="#d97706"/>
  <text x="370" y="128" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Tutor AI</text>
  <text x="370" y="153" text-anchor="middle" font-family="Arial" font-size="12">guidance and copy</text>
  <rect x="510" y="95" width="170" height="85" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="595" y="128" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Memory</text>
  <text x="595" y="153" text-anchor="middle" font-family="Arial" font-size="12">structured summary</text>
  <rect x="735" y="95" width="170" height="85" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="820" y="128" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Voice</text>
  <text x="820" y="153" text-anchor="middle" font-family="Arial" font-size="12">STT and TTS</text>
  <rect x="260" y="280" width="460" height="75" rx="8" fill="#ffffff" stroke="#64748b"/>
  <text x="490" y="311" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Backend Orchestration</text>
  <text x="490" y="336" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Routes and services decide which AI job is being requested.</text>
  <path d="M145 180 C180 245 290 250 345 280" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowAI)"/>
  <path d="M370 180 V280" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowAI)"/>
  <path d="M595 180 V280" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowAI)"/>
  <path d="M820 180 C790 245 690 250 635 280" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowAI)"/>
  <text x="490" y="405" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0f172a">Beginner rule: identify the AI job before changing prompt, parsing, or UI copy.</text>
  <defs>
    <marker id="arrowAI" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## Mobile And Capacitor Explained

Capacitor wraps the web app into Android and iOS shells.

Simple model:

```text
Web app is the product body.
Capacitor is the mobile container.
Native config gives permissions and platform behavior.
```

Do not assume mobile bugs are always native bugs. First check:

1. Does it work in desktop browser?
2. Does it work in mobile browser?
3. Does it work after Capacitor sync?
4. Do native permissions exist?
5. Do platform logs show a plugin error?

## Visual 10: Web To Mobile Packaging

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 360" role="img" aria-label="Capacitor packaging flow">
  <rect width="940" height="360" fill="#ffffff"/>
  <text x="470" y="36" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">How Web Code Becomes A Mobile App</text>
  <rect x="80" y="105" width="170" height="80" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="165" y="137" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Vite Build</text>
  <text x="165" y="160" text-anchor="middle" font-family="Arial" font-size="12">web assets</text>
  <rect x="315" y="105" width="170" height="80" rx="8" fill="#fff7ed" stroke="#d97706"/>
  <text x="400" y="137" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Cap Sync</text>
  <text x="400" y="160" text-anchor="middle" font-family="Arial" font-size="12">copy and config</text>
  <rect x="550" y="105" width="170" height="80" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="635" y="137" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Native Project</text>
  <text x="635" y="160" text-anchor="middle" font-family="Arial" font-size="12">Android / iOS</text>
  <rect x="755" y="105" width="125" height="80" rx="8" fill="#fef3c7" stroke="#d97706"/>
  <text x="817" y="137" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700">Device</text>
  <text x="817" y="160" text-anchor="middle" font-family="Arial" font-size="12">test release</text>
  <path d="M250 145 H315" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowCap)"/>
  <path d="M485 145 H550" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowCap)"/>
  <path d="M720 145 H755" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowCap)"/>
  <rect x="175" y="250" width="590" height="58" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="470" y="282" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#0f172a">If the web app is broken, fix web first. If only mobile is broken, inspect permissions, plugins, links, and platform logs.</text>
  <defs>
    <marker id="arrowCap" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## How To Make A Change Without Getting Lost

Use this routine for every task.

```text
1. Write the user problem in one sentence.
2. Name the screen or route.
3. Name the data involved.
4. Find the component.
5. Find the store/action.
6. Find the API client if one exists.
7. Find the backend route if one exists.
8. Identify loading, empty, success, and error states.
9. Make the smallest change that solves the problem.
10. Run the correct checks.
11. Write what changed and what is still risky.
```

## Visual 11: Feature Work Checklist

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 500" role="img" aria-label="Feature work checklist">
  <rect width="980" height="500" fill="#f8fafc"/>
  <text x="490" y="36" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">Safe Feature Workflow</text>
  <g font-family="Arial" fill="#0f172a">
    <rect x="70" y="85" width="160" height="65" rx="8" fill="#ffffff" stroke="#0ea5e9"/>
    <text x="150" y="112" text-anchor="middle" font-size="15" font-weight="700">1. Problem</text>
    <text x="150" y="133" text-anchor="middle" font-size="11">user need</text>
    <rect x="290" y="85" width="160" height="65" rx="8" fill="#ffffff" stroke="#0ea5e9"/>
    <text x="370" y="112" text-anchor="middle" font-size="15" font-weight="700">2. Map</text>
    <text x="370" y="133" text-anchor="middle" font-size="11">screen and data</text>
    <rect x="510" y="85" width="160" height="65" rx="8" fill="#ffffff" stroke="#0ea5e9"/>
    <text x="590" y="112" text-anchor="middle" font-size="15" font-weight="700">3. Boundary</text>
    <text x="590" y="133" text-anchor="middle" font-size="11">frontend or backend</text>
    <rect x="730" y="85" width="160" height="65" rx="8" fill="#ffffff" stroke="#0ea5e9"/>
    <text x="810" y="112" text-anchor="middle" font-size="15" font-weight="700">4. Change</text>
    <text x="810" y="133" text-anchor="middle" font-size="11">smallest diff</text>
    <rect x="180" y="250" width="160" height="65" rx="8" fill="#dcfce7" stroke="#16a34a"/>
    <text x="260" y="277" text-anchor="middle" font-size="15" font-weight="700">5. Test</text>
    <text x="260" y="298" text-anchor="middle" font-size="11">right level</text>
    <rect x="410" y="250" width="160" height="65" rx="8" fill="#fef3c7" stroke="#d97706"/>
    <text x="490" y="277" text-anchor="middle" font-size="15" font-weight="700">6. Review</text>
    <text x="490" y="298" text-anchor="middle" font-size="11">risk first</text>
    <rect x="640" y="250" width="160" height="65" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
    <text x="720" y="277" text-anchor="middle" font-size="15" font-weight="700">7. Ship</text>
    <text x="720" y="298" text-anchor="middle" font-size="11">with notes</text>
  </g>
  <path d="M230 117 H290" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFeature)"/>
  <path d="M450 117 H510" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFeature)"/>
  <path d="M670 117 H730" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFeature)"/>
  <path d="M810 150 C810 220 300 220 260 250" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#arrowFeature)"/>
  <path d="M340 282 H410" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFeature)"/>
  <path d="M570 282 H640" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowFeature)"/>
  <text x="490" y="405" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0f172a">Never skip the boundary step. Most dangerous bugs come from putting a decision in the wrong layer.</text>
  <defs>
    <marker id="arrowFeature" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## Beginner Scenario: Add A Profile Field

Imagine the task is: "Let students edit school name in profile settings."

Do not start by coding. First map it:

```text
User problem:
  Student needs to correct school name.

Screen:
  Profile settings.

Frontend:
  profile settings component, validation, save button, error copy.

Store/client:
  profile store or API helper.

Backend:
  profile route that accepts allowed fields.

Database:
  learner profile table or metadata field.

Tests:
  validation test, API contract test, manual save/refresh check.
```

Questions to ask Tamil:

- Is school required or optional?
- Can the student clear it?
- Is it visible to schools or only learner profile?
- Does it need localization?
- Does it affect onboarding?

## Beginner Scenario: Fix A Mock Test Error

Imagine the bug is: "Student sees generic error after mock test attempt expires."

Map it:

```text
Symptom:
  Mock test shows generic error.

Likely contract:
  Backend returns 410 for expired attempt.

Frontend job:
  branch on 410 and show expired-attempt recovery copy.

Backend job:
  own attempt expiry and return consistent status.

Do not:
  let frontend decide expiry by local clock only.
```

Why this matters: mock tests are paid and trust-sensitive. Students need honest recovery, not vague failure.

## Beginner Scenario: Change A NOVA Message

Imagine the task is: "Make NOVA more encouraging on home."

Map it:

```text
Question 1:
  Is this static UI copy or generated AI copy?

Question 2:
  Does it use learner memory?

Question 3:
  Could it imply a false score guarantee?

Question 4:
  Does it need localization?
```

Good NOVA copy:

```text
Try one Part 2 answer today. Focus on one clear example.
```

Weak NOVA copy:

```text
You will definitely improve your band score soon.
```

## Testing For Beginners

Use the narrowest test that catches the risk.

```text
Text formatting helper:
  unit test.

Component interaction:
  component test.

Route flow:
  Playwright browser test.

Backend route:
  API route test.

Scoring or billing:
  backend-focused test plus manual review.
```

For this static onboarding hub:

```bash
npm test
npm run build
```

For MBS production app work, follow the MBS repo instructions. Existing docs say the usual gate is:

```bash
npm run build
npm test
```

## What To Learn In The First Week

Day 1:

- Open the hub.
- Read this handbook.
- Read the MBS intern book.
- Write a personal map of the product loop.

Day 2:

- Read the architecture overview.
- Trace one route from URL to component.
- Trace one task from component to backend route.

Day 3:

- Read code guidelines.
- Learn how tests are run.
- Review one existing task or PR and write risks first.

Day 4:

- Read the design-system guide.
- Review one screen for next action, mobile, error, and accessibility.

Day 5:

- Read the Capacitor guide.
- Write down mobile risks for auth, recording, and app resume.

End of week output:

```text
1. Product loop summary.
2. Codebase map.
3. Five architecture questions.
4. One UI review.
5. One mobile risk list.
6. One small task proposal.
```

## Visual 12: First Week Learning Plan

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 380" role="img" aria-label="First week learning plan">
  <rect width="980" height="380" fill="#ffffff"/>
  <text x="490" y="36" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#0f172a">First Week Learning Plan</text>
  <g font-family="Arial" fill="#0f172a">
    <rect x="45" y="90" width="160" height="90" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
    <text x="125" y="122" text-anchor="middle" font-size="16" font-weight="700">Day 1</text>
    <text x="125" y="148" text-anchor="middle" font-size="12">read and map</text>
    <rect x="230" y="90" width="160" height="90" rx="8" fill="#fff7ed" stroke="#d97706"/>
    <text x="310" y="122" text-anchor="middle" font-size="16" font-weight="700">Day 2</text>
    <text x="310" y="148" text-anchor="middle" font-size="12">trace routes</text>
    <rect x="415" y="90" width="160" height="90" rx="8" fill="#dcfce7" stroke="#16a34a"/>
    <text x="495" y="122" text-anchor="middle" font-size="16" font-weight="700">Day 3</text>
    <text x="495" y="148" text-anchor="middle" font-size="12">tests and review</text>
    <rect x="600" y="90" width="160" height="90" rx="8" fill="#fef3c7" stroke="#d97706"/>
    <text x="680" y="122" text-anchor="middle" font-size="16" font-weight="700">Day 4</text>
    <text x="680" y="148" text-anchor="middle" font-size="12">design review</text>
    <rect x="785" y="90" width="160" height="90" rx="8" fill="#fee2e2" stroke="#dc2626"/>
    <text x="865" y="122" text-anchor="middle" font-size="16" font-weight="700">Day 5</text>
    <text x="865" y="148" text-anchor="middle" font-size="12">mobile risks</text>
  </g>
  <path d="M205 135 H230" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWeek)"/>
  <path d="M390 135 H415" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWeek)"/>
  <path d="M575 135 H600" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWeek)"/>
  <path d="M760 135 H785" stroke="#0f172a" stroke-width="2" marker-end="url(#arrowWeek)"/>
  <rect x="175" y="250" width="630" height="75" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="490" y="281" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#0f172a">End of week output</text>
  <text x="490" y="306" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Product loop summary, codebase map, questions, UI review, mobile risk list, and one small task proposal.</text>
  <defs>
    <marker id="arrowWeek" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## Glossary For A New Intern

```text
API:
  A contract for frontend and backend to talk.

Auth:
  How the system knows who the user is.

Backend:
  Server code that owns trusted rules.

Capacitor:
  Tool that wraps the web app into Android and iOS apps.

Component:
  A reusable or screen-level UI block.

Frontend:
  Browser/mobile-web code the user sees.

Mock test:
  Serious timed IELTS-style exam practice.

NOVA:
  YNova's AI companion and mascot.

Provider:
  External service such as AI, voice, billing, or hosting.

RLS:
  Supabase Row Level Security. It limits database row access.

Service-role key:
  Powerful backend-only Supabase key. Never expose it to frontend.

Store:
  Shared frontend state plus actions.

Trust boundary:
  The line between untrusted client behavior and trusted server decisions.
```

## Beginner Checklist Before Touching Code

Before editing MBS code, answer:

- What user problem am I solving?
- Is it frontend-only, backend-only, or both?
- Does it touch scoring, billing, auth, transcripts, recordings, or secrets?
- Which route or screen is affected?
- Which store or API client is affected?
- Which backend route or service is affected?
- What should happen on loading, success, empty, and error?
- What test or manual check proves it works?
- What should Tamil review?

If you cannot answer these, do not start coding yet.

## Final Beginner Rule

Do not be embarrassed to be new. Be dangerous only if you guess silently.

A strong beginner writes down:

```text
I think this change belongs in [layer].
I found these files.
I think the risk is [risk].
I will verify with [test/check].
I need Tamil to decide [product question].
```

That is how you become useful quickly without breaking the product.
