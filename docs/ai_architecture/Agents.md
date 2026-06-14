# AI Agent System

YNova uses AI in two different ways:

1. Development agents help build, review, and operate the product.
2. Runtime AI features help students practice IELTS speaking.

These categories must not be blurred. Development agents may edit repositories and draft plans. Runtime AI features must obey product contracts, safety boundaries, privacy rules, and backend control.

## Agent Roles

### Tamil

Tamil is the human decision owner. AI agents can recommend, draft, and implement, but Tamil owns final product, technical, launch, and business judgment.

### Yaomin

Yaomin is the product management owner in training. Her role is to make ambiguity visible, keep tasks organized, convert feedback into requirements, and verify that AI-generated work serves the product.

### Codex

Codex is the repository-aware coding agent. Use it for:

- Reading code.
- Implementing scoped changes.
- Running tests.
- Inspecting local browser behavior.
- Creating or updating files.
- Producing review findings grounded in file and line references.

Codex should not invent requirements when repo context can answer the question.

### Claude

Claude is best used for architectural critique, product framing, strategy, and deep review. Claude should challenge weak assumptions and help Tamil and Yaomin decide what is worth building.

Claude is not a source of truth unless its output is checked against the repository and current product decisions.

### Cursor And Copilot

Cursor and Copilot are local editing accelerators. They are useful when the implementation target is already clear. They are risky when used to explore product intent or architecture without reading the repo.

### NOVA

NOVA is the runtime student-facing study companion. NOVA should help learners practice, recover from mistakes, understand feedback, and continue sessions. NOVA is not a general repository assistant and should not expose internal implementation details to students.

## Development Agent Workflow

Use this loop:

1. Read current instructions and task context.
2. Inspect relevant files.
3. State assumptions and risks.
4. Make the smallest coherent change.
5. Run verification.
6. Summarize what changed and what remains.

For large work, split agents by responsibility:

- Planner: requirements, constraints, tradeoffs.
- Implementer: code and tests.
- Reviewer: bug/risk review.
- Verifier: browser, build, and test checks.

Do not let multiple agents edit the same files without a clear owner. Agent overlap creates hidden merge and reasoning conflicts.

## Runtime AI Architecture

Runtime AI should be backend mediated:

```text
Frontend component
  sends route context, transcript, or task input
        |
        v
FastAPI route
  authenticates user
  validates payload
  applies product policy
  calls model provider
  parses structured result
  logs safe telemetry
        |
        v
Frontend renders approved result
```

The browser must not hold provider secrets. The browser should render model output only after it passes backend schema and policy checks.

## Agent Policy Boundaries

Agents may:

- Summarize code.
- Draft PRDs.
- Propose architecture.
- Generate tests.
- Implement scoped changes.
- Suggest observability.
- Prepare review comments.

Agents must not:

- Commit secrets.
- Paste production learner data into prompts.
- Bypass paid gates.
- Reimplement scoring on the frontend.
- Make medical, legal, immigration, or guaranteed-score promises.
- Autonomously deploy production changes without Tamil approval.

## Prompt And Tool Strategy

Good agent prompts include:

- The goal.
- The repo or files to inspect.
- Constraints.
- Definition of done.
- Required verification.
- Things that must not change.

Bad prompts ask an agent to "improve" a system without naming the user outcome, constraints, or review bar.

Use tools intentionally:

- Search code before assuming.
- Prefer existing tests before writing new fixtures.
- Use browser verification for UI.
- Use structured output for model calls that feed product behavior.
- Store durable decisions in markdown, not only in chat.

## Creative Agent Development

Creativity is useful when it produces a better student experience, not when it produces novelty for its own sake.

Creative AI agent work should start from:

- Student anxiety.
- IELTS learning mechanics.
- Memory and habit formation.
- Bilingual scaffolding.
- Feedback trust.
- Error recovery.

Creative ideas should still pass engineering review:

- Can we observe it?
- Can we test it?
- Can we explain it to a student?
- Can we roll it back?
- Does it preserve privacy?
- Does it reduce or increase cognitive load?

## Multi-Agent Integration Strategies

Use handoff artifacts:

- Architecture note.
- Task checklist.
- Acceptance criteria.
- Test plan.
- Review findings.
- Decision log.

Use explicit gates:

- Human approval for product policy.
- Build and test before merge.
- Browser smoke for UI.
- Security review for auth, billing, and data.
- Prompt review for scoring, feedback, and student-facing AI copy.

Use a single source of truth:

- Product decisions in docs or tickets.
- Implementation in code.
- Backend contracts in route files and tests.
- Current work in task tracker.

If an agent output conflicts with source code, source code wins until Tamil decides to change it.

## Agent Failure Modes

Watch for:

- Confident hallucinated APIs.
- Missing i18n.
- Generic product copy.
- Unverified "done" claims.
- Hidden dependency additions.
- Reimplemented backend logic.
- Privacy leaks in logs or prompts.
- UI that works only on a laptop viewport.

The fix is not "use fewer agents." The fix is stronger contracts, better review, and explicit verification.

