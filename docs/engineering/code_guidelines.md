# Engineering Code Guidelines

These guidelines define the engineering bar for work related to YNova MBS and the Yaomin-YNova hub. The standard is production readiness, not demo readiness.

## Non-Negotiable Standards

- No `any` to silence TypeScript. Fix the type or isolate uncertainty behind a narrow typed boundary.
- No swallowed errors without logging or an explicit fallback reason.
- No hardcoded production URLs, secrets, access tokens, Supabase keys, or model keys.
- No duplication of AI scoring logic in frontend code or documentation repos.
- No user-visible English strings in MBS templates without i18n keys.
- No UI change is done until accessibility and mobile behavior have been considered.
- No task is complete until the required verification has run and the result is recorded.

## Git Workflow

Use small branches with clear names:

```text
codex/short-outcome-name
yaomin/product-handoff-task-name
fix/specific-bug-name
```

Commit messages should explain the user or system outcome:

```text
feat(onboarding): add interests and school editing PRD
fix(mock-test): preserve mode discriminator during resume
docs(ai): clarify agent review gates
```

Do not use `git add -A` when working in a shared or dirty tree. Stage specific files so secrets, local artifacts, and unrelated changes are not committed.

Before requesting review, include:

- Summary of intent.
- Files changed.
- Verification commands and results.
- Known gaps or follow-up.
- Screenshots for UI changes.

## Required Verification For MBS Code

Before calling a code task complete in MBS:

```bash
npm run build
npm test
```

For UI changes, also run the app and drive the golden path and one edge case in a browser.

For backend changes, run the relevant pytest suite in the backend package and verify the API contract from the frontend caller.

For the Yaomin-YNova static hub:

```bash
npm test
npm run build
```

The validation script checks that docs, task metadata, and required NOVA assets are present.

## TypeScript And Lit Practices In MBS

MBS uses Lit 3 web components. Respect the project gotchas:

- Use `svg` from `lit` for SVG elements.
- Avoid inline conditionals adjacent to event handlers.
- Keep conditional outer wrappers static.
- Do not assume `@query` refs exist on the same tick as a state change.
- Add per-component `:focus-visible` rules because global CSS does not pierce Shadow DOM.
- Remember that `store.subscribe(cb)` fires immediately, so calling `store.get()` first is usually redundant.

State belongs in domain stores under `src/stores/`. Components should subscribe in `connectedCallback()` and unsubscribe in `disconnectedCallback()`.

## API Boundary Rules

Frontend code calls backend contracts. It does not reimplement backend decisions.

Examples:

- Mock test scoring belongs behind `/api/mock-test/*`.
- Tutor memory belongs behind `/api/tutor/memory-bundle`.
- Review scheduling and FSRS state belong in backend services and database functions.
- Voice STT/TTS should go through existing ElevenLabs and backend token flows.

When a payload shape is uncertain, read the backend route and tests. Do not infer the contract from UI assumptions.

## i18n Rules

For MBS:

- Use `t(key)` from `src/lib/i18n.ts` for user-visible strings.
- Add keys to every locale file.
- Preserve placeholders exactly.
- Avoid copy that is idiomatic only in English when the concept must translate.

The Yaomin-YNova hub is internal and English-only for now, but product docs should still call out when a user-facing MBS requirement needs localization.

## Accessibility Rules

Every interactive control needs:

- A keyboard path.
- A visible focus state.
- A useful accessible name.
- Sufficient contrast.
- No dependence on color alone.

For speech practice and scoring surfaces, accessibility also means:

- Clear recording states.
- Non-audio alternatives where possible.
- Error copy that explains next steps.
- No autoplay voice without explicit user action.

## Observability Rules

New MBS user flows should emit useful Sentry breadcrumbs for important user actions and failure states. Breadcrumbs must not include:

- Email addresses.
- Full transcripts.
- Learner-generated personal content.
- Payment secrets.
- Access tokens.

Log enough backend context to debug a production failure without reproducing it locally. Include route, high-level mode, attempt id where safe, and error class. Do not log raw learner speech unless Tamil has explicitly approved a redaction strategy.

## Security And Privacy

Assume learner data is sensitive. IELTS speaking transcripts may include personal history, immigration goals, school names, family details, or health context.

Do:

- Keep secrets in environment variables.
- Use Supabase RLS and service-role keys only on the server.
- Validate inputs at API boundaries.
- Avoid storing unnecessary raw audio or transcripts.
- Prefer least privilege and explicit allowlists.

Do not:

- Paste production data into AI prompts.
- Store credentials in markdown docs.
- Commit `.env` files.
- Let frontend code call model providers directly with private keys.

## Dependency Policy

Every new dependency needs a reason:

- What problem does it solve?
- Why is native platform code or existing project code insufficient?
- What is the bundle, maintenance, and security cost?
- How will it be tested?

Small static tools can use simple dependencies when they materially improve safety. For example, Yaomin-YNova uses `marked` and `dompurify` to render local markdown safely.

## Production-Ready Definition

A change is production-ready when:

- The behavior matches the acceptance criteria.
- The code follows existing architecture.
- Tests cover the risky path.
- Build and test commands pass.
- UI is keyboard accessible and responsive.
- Failure states are visible and useful.
- Observability exists for important actions.
- Documentation or task notes explain any remaining risk.

