# Free Shared Updates Architecture

This document explains how Yaomin-YNova stays cheap to host while still supporting shared weekly progress updates and shared task updates.

## Decision

Keep the site hosted on GitHub Pages, but use GitHub Issues as the durable shared task/update layer.

GitHub Pages remains static. GitHub Issues provides shared state.

## Why

The first version used localStorage. That is useful for a quick dashboard, but localStorage is not shared:

```text
Tamil's browser localStorage != Yaomin's browser localStorage
```

If Tamil creates a task locally, Yaomin cannot see it unless Tamil exports JSON and sends it manually.

GitHub Issues solves this for free:

- Durable task records.
- Shared between Tamil and Yaomin.
- Review comments.
- Labels for priority and status.
- Closing issues to mark work complete.
- Weekly progress issues.
- GitHub Actions automation.
- No paid server.

## Architecture

```text
Tamil / Yaomin
    |
    v
Browser
    |
    v
GitHub Pages static app
    |
    | read-only public GitHub API call
    v
GitHub Issues
    |
    +-- task issues
    +-- weekly update issues
    +-- labels
    +-- comments
    +-- open / closed state

GitHub Actions
    |
    +-- issue label sync workflow
    +-- scheduled weekly workflow
    +-- creates weekly progress issue
```

## Browser Write Boundary

The dashboard deliberately does not write directly to GitHub Issues from the browser.

```text
Read path:
  Browser -> unauthenticated GitHub Issues API -> dashboard cards

Write path:
  Browser -> GitHub issue form -> GitHub authenticated session

Automation path:
  GitHub Actions -> GITHUB_TOKEN -> weekly progress issue
  GitHub Actions -> GITHUB_TOKEN -> task labels
```

This keeps tokens out of the static bundle. If the dashboard embedded a GitHub token, anyone could inspect the JavaScript bundle and use that token.

## UI Flow

```text
Dashboard
  |
  +-- Local task board
  |     quick browser-only drafts
  |
  +-- Shared Weekly And Task Updates
        |
        +-- Refresh
        |     reads latest GitHub issues
        |
        +-- GitHub task
        |     opens task issue template
        |
        +-- Weekly update
              opens weekly update template
```

## UX Model

Use local dashboard tasks for fast drafts.

Use GitHub task issues for shared work that Tamil and Yaomin both need to see.

Use weekly update issues for the official progress record.

```text
Draft locally
  -> decide it matters
  -> create GitHub issue
  -> discuss in comments
  -> close when done
  -> weekly workflow summarizes progress
```

## Label Sync

GitHub Issue Forms do not automatically turn dropdown values into labels.

Yaomin-YNova uses `.github/workflows/sync-issue-labels.yml` to keep new task issues readable by the dashboard:

```text
Task issue opened or edited
  |
  v
sync-issue-labels workflow
  |
  +-- reads Area from the issue form body
  +-- reads Priority from the issue form body
  +-- applies area:* and priority:* labels
  +-- adds status:todo if no status label exists
```

Task status remains label-driven. Move work by changing `status:todo`, `status:in-progress`, `status:in-review`, or by closing the issue when done.

## GitHub Issue Labels

Task labels:

```text
task
status:todo
status:in-progress
status:in-review
status:done
priority:high
priority:medium
priority:low
area:onboarding
area:product
area:engineering
area:ai-architecture
```

Weekly update labels:

```text
weekly-update
```

## Task Issue Shape

```text
Title:
  Read the complete YNova onboarding guide

Labels:
  task, status:todo, priority:high, area:onboarding

Body:
  Goal
  Context
  Acceptance criteria
  Linked docs
  Due date

Comments:
  Tamil review
  Yaomin progress notes
```

## Weekly Update Shape

```text
Title:
  Weekly Progress Update - 2026-06-15

Labels:
  weekly-update

Body:
  Summary
  Completed
  In progress
  In review
  Blockers
  Decisions needed from Tamil
  Next week focus
```

## Security Boundaries

This is free and practical, but it is not private.

If the GitHub repository is public, GitHub Issues are public.

If the repository becomes private, the static dashboard cannot read private issues without a backend token broker. At that point use Supabase Auth, a GitHub App backend, or Linear.

Do not store:

- Student transcripts.
- Student recordings.
- Private learner notes.
- Secrets or passwords.
- Billing details.
- Incident details.

The dashboard login is a convenience gate. It is not real server-side security.

## When To Upgrade

Upgrade to Supabase Auth and a database when:

- The updates must be private.
- Yaomin needs edit-in-place from the dashboard.
- You need row-level permissions.
- You need structured reporting.
- You need task history beyond GitHub comments and labels.

The upgraded architecture would be:

```text
GitHub Pages or hosted frontend
    |
    v
Supabase Auth
    |
    v
Supabase Postgres
    |
    +-- tasks table
    +-- weekly_updates table
    +-- comments table
    +-- row-level security
```

## Recommendation

For onboarding, GitHub Issues is the right first shared-state layer.

It is free, durable, familiar to engineers, and simple enough that Yaomin can learn product/task operations without a custom backend.

## Operational Commands

Run these only from a trusted local machine or GitHub Actions environment:

```bash
GITHUB_REPOSITORY=YNova-Ed/Yaomin-YNova GITHUB_TOKEN=$(gh auth token) npm run seed:issues
GITHUB_REPOSITORY=YNova-Ed/Yaomin-YNova GITHUB_TOKEN=$(gh auth token) npm run weekly:update
```

The first command creates shared task issues from `src/data/tasks.json` without duplicating existing issue titles. The second command creates or updates the current week's weekly progress issue.
