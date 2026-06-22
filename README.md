# Yaomin-YNova

Yaomin-YNova is a static GitHub Pages onboarding and product handoff hub for YNova. It combines a markdown knowledge base with a Notion and Linear inspired dashboard so Tamil can assign work, Yaomin can track progress, and the product context around YNova MBS and the AI agent architecture stays easy to read.

The site is intentionally static. Task changes are stored in browser localStorage and can be exported as JSON. There is no backend, no user secrets, and no production YNova data in this repository.

## Hosting And GitHub About

Hosted site:

```text
https://ynova-ed.github.io/Yaomin-YNova/
```

Recommended GitHub repository About fields:

```text
Description:
  Static GitHub Pages onboarding and product handoff hub for YNova MBS.

Website:
  https://ynova-ed.github.io/Yaomin-YNova/

Topics:
  ynova, ielts-speaking, onboarding, product-handoff, github-pages, static-site
```

The hosted site is public/static unless the GitHub repository visibility and Pages settings say otherwise. Do not treat the lightweight login screen as a secure privacy boundary.

## Authentication

The online hub includes a lightweight login gate for Tamil and Yaomin. It is suitable for reducing casual public access, but it is not real server-side authentication because GitHub Pages serves static files. The password is never stored in plaintext in the source, but static bundles can still be inspected or bypassed by a determined person.

Do not store sensitive data here:

- Student transcripts or recordings.
- Supabase keys, provider keys, or passwords.
- Payment, billing, or Stripe details.
- Private learner notes.
- Production incident details.

If this hub needs true privacy later, move it behind a real auth provider such as Supabase Auth, Clerk, Auth0, or a private internal GitHub repository.

## Quick Start

```bash
npm install
npm run dev
npm test
npm run build
```

GitHub Pages deployment is handled by `.github/workflows/pages.yml` on pushes to `main`.

## Repository Tree

```text
Yaomin-YNova/
  .github/
    ISSUE_TEMPLATE/
      config.yml
      task.yml
      weekly_update.yml
    workflows/
      pages.yml
      sync-issue-labels.yml
      weekly-progress.yml
  docs/
    ai_architecture/
      Agents.md
      Claude.md
    design/
      dashboard-concept.png
      ynova_mbs_design_system_guide.md
      ynova_mascot_and_theme.md
    engineering/
      code_guidelines.md
      ynova_mbs_capacitor_technical_guide.md
    onboarding/
      collaboration_guidelines.md
      ynova_mbs_beginner_visual_handbook.md
      ynova_mbs_intern_book.md
      ynova_mbs_intern_handoff_review.md
      ynova_full_onboarding_guide.md
    product/
      free_shared_updates_architecture.md
      ynova_mbs_architecture.md
  public/
    nova-brand/
      nova-furry-star-mascot-transparent.png
      nova-mark-transparent-2048.png
    nova-poses/
      MANIFEST.json
      README.md
      _reference.png
      apologetic.png
      celebrating.png
      correcting.png
      encouraging.png
      idle.png
      listening.png
      pointing.png
      reading.png
      sleeping.png
      surprised.png
      thinking.png
      wave.png
  scripts/
    copy-docs.mjs
    create-weekly-update.mjs
    seed-github-issues.mjs
    sync-issue-labels.mjs
    validate-content.mjs
  src/
    data/
      kb.js
      knowledge-base.json
      tasks.json
    main.js
    styles.css
  .gitignore
  index.html
  package-lock.json
  package.json
  postcss.config.cjs
  tailwind.config.js
  vite.config.js
```

## Product Decisions

- Static dashboard first: GitHub Pages can host it with no server cost or secrets.
- Markdown is the source of truth for durable onboarding knowledge.
- localStorage is the draft task state layer for this browser.
- GitHub Issues is the free shared task and weekly update layer for Tamil and Yaomin.
- Lightweight static authentication gates the UI for Tamil and Yaomin, but does not claim to secure confidential data.
- NOVA mascot assets are copied from YNova MBS so the hub keeps the same product identity without inventing a separate brand.
- The dashboard imports markdown with Vite `?raw` for fast in-app navigation and copies the `docs/` directory into `dist/docs` during build so raw markdown links also work on GitHub Pages.

## Shared Updates

The dashboard reads GitHub Issues through the public GitHub API and renders a shared progress panel. It does not write to GitHub from browser JavaScript because static sites cannot safely hold write tokens.

```text
GitHub Pages dashboard
  |
  +-- localStorage
  |     browser-only draft tasks
  |
  +-- GitHub Issues API
        shared task issues
        weekly progress issues
        review comments
```

Create shared work with the `GitHub task` button in the dashboard or the issue template in GitHub. `.github/workflows/sync-issue-labels.yml` keeps area and priority labels aligned with the issue form. Weekly progress is created by `.github/workflows/weekly-progress.yml` every Monday morning New Zealand time and can also be run manually from the Actions tab.

To seed non-sensitive onboarding tasks into GitHub Issues from the local task list:

```bash
GITHUB_REPOSITORY=YNova-Ed/Yaomin-YNova GITHUB_TOKEN=$(gh auth token) npm run seed:issues
```

## Operational Notes

- Run `npm test` before publishing. The validation script checks knowledge-base metadata, task references, and required mascot assets.
- Do not put credentials, learner data, Supabase keys, exported transcripts, or production screenshots into this repository.
- When adding a new markdown document, add metadata in `src/data/knowledge-base.json`, add a loader in `src/data/kb.js`, and connect any seed tasks through `docId`.
- If the dashboard later needs private shared state, use Supabase Auth and Postgres RLS before storing sensitive data here.
