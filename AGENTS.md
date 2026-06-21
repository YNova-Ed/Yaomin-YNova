# AGENTS.md - Yaomin-YNova

Repository instructions for Codex, Claude, Cursor, Copilot, and similar agents.

Yaomin-YNova is a static GitHub Pages onboarding and product handoff hub for
YNova. It is not the production IELTS Speaking app. The production app is
`YNova-MBS`; this repo explains that app and coordinates non-sensitive Tamil /
Yaomin onboarding work.

## Product Boundary

- This repo is static: Vite, JavaScript, Markdown, GitHub Pages, and GitHub
  Issues.
- There is no backend and no real server-side authentication in this repo.
- Do not add Supabase, Stripe, Gemini, ElevenLabs, Railway, or production YNova
  secrets here.
- Do not store student transcripts, recordings, learner notes, billing details,
  incident details, or production screenshots here.
- Shared task state belongs in GitHub Issues. Browser localStorage is only a
  local draft layer.

## First Files To Read

1. `README.md`
2. `src/main.js`
3. `src/data/knowledge-base.json`
4. `src/data/kb.js`
5. `src/data/tasks.json`
6. `scripts/validate-content.mjs`
7. `.github/workflows/pages.yml`
8. `docs/product/free_shared_updates_architecture.md`

## Commands

```bash
npm install
npm run dev
npm test
npm run build
```

Run `npm test` and `npm run build` before declaring the hub clean. The test
script validates knowledge-base metadata, task metadata, document paths, task
doc references, and required NOVA assets.

## Editing Rules

- Keep the hub static unless Tamil explicitly approves a backend.
- Markdown docs under `docs/` are the durable onboarding source of truth.
- When adding a doc, add it to `src/data/knowledge-base.json` and add a matching
  loader in `src/data/kb.js`.
- When adding a seed task, add it to `src/data/tasks.json` and link it to an
  existing `docId`.
- Keep task dates in `YYYY-MM-DD` format.
- Keep task status to `Todo`, `In Progress`, `In Review`, or `Done`.
- Keep priority to `High`, `Medium`, or `Low`.
- Do not put plaintext passwords in source. The current static login is a
  convenience gate only; it is not a privacy boundary.
- Do not add dependencies unless they are needed for the static dashboard and
  the bundle impact is reasonable.

## GitHub Issues Model

- Browser reads public GitHub Issues through the GitHub API.
- Browser writes go through GitHub issue forms, not embedded tokens.
- Label sync is handled by `.github/workflows/sync-issue-labels.yml`.
- Weekly updates are handled by `.github/workflows/weekly-progress.yml`.
- Closing an issue or applying `status:done` marks shared work as complete.

## Deployment

GitHub Pages deploys from `main` through `.github/workflows/pages.yml`.
Do not push directly to `main` unless Tamil asked for that exact release path.
Prefer a branch and PR for non-trivial changes.

