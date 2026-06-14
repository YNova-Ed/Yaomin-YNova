# Collaboration Guidelines

This document defines how Yaomin and Tamil should collaborate while Yaomin ramps into YNova product management and learns the MBS codebase. It is written for a small, high-trust team where decisions move fast, but quality cannot depend on memory or informal chat.

## Collaboration Principles

1. Optimize for clarity over speed when a decision changes product behavior, student trust, pricing, data, or AI output.
2. Write down the decision, not just the conversation. A decision that lives only in chat will be forgotten or misquoted.
3. Separate product intent from implementation guesses. Yaomin should own the user problem and desired outcome; the implementation can be refined with Tamil and AI agents.
4. Make review easy. Every artifact should explain what changed, why it changed, what was considered, and what still needs a decision.
5. Treat uncertainty as useful signal. A precise open question is better than pretending a requirement is known.

## Roles

Tamil owns final product, technical, security, and launch decisions.

Yaomin owns the operating discipline of product handoff:

- Turn rough product ideas into crisp requirements.
- Keep task lists, acceptance criteria, and user-facing decisions current.
- Identify ambiguous flows before engineering starts.
- Capture review feedback and convert it into concrete follow-up.
- Maintain onboarding notes that make the next handoff easier.

AI agents assist with drafting, summarizing, critique, code exploration, implementation, and test generation. They do not replace Tamil's product judgment or Yaomin's responsibility to verify outputs.

## Communication Rhythm

Use a weekly product handoff with a fixed agenda:

1. Decisions made since the last sync.
2. Tasks completed, blocked, or at risk.
3. User or student experience concerns.
4. Engineering risks that need Tamil's judgment.
5. Next week's three highest leverage tasks.

Use asynchronous updates for smaller items:

- Decision log entry for product behavior changes.
- Short task comment for implementation status.
- Review note for bugs, risks, missing tests, or unclear acceptance criteria.
- Escalation note when a blocker affects timeline, quality, security, billing, or student trust.

## How To Ask Tamil For Review

Give Tamil the smallest complete unit of context:

```text
Decision needed:
Options considered:
Recommendation:
User impact:
Engineering impact:
Risk if we choose wrong:
Deadline:
```

Avoid asking "thoughts?" without a recommendation. The recommendation can be wrong, but it gives Tamil something concrete to accept, reject, or reshape.

## Code Review Collaboration

When reviewing code with Tamil, lead with risks:

1. Bugs or incorrect behavior.
2. Security, privacy, or data integrity issues.
3. Student experience regressions.
4. Missing test coverage for changed behavior.
5. Maintainability concerns.
6. Style or naming comments.

Do not start with praise or a general summary when there are findings. A good review protects users first.

Review comments should be specific:

```text
Finding:
File and line:
Why it matters:
Suggested fix:
Verification:
```

## Product Review Collaboration

Product artifacts should answer:

- Who is the learner?
- What job are they trying to complete?
- What emotion or anxiety is present?
- What does the system know about them?
- What must never happen?
- What is the smallest shippable version?
- How will we know it worked?

For YNova, every UX decision is also a pedagogy decision. Empty states, latency, feedback copy, scoring explanations, and bilingual hints all affect whether a student trusts the app.

## AI Agent Collaboration

Use agents deliberately:

- Use Codex for repository exploration, implementation, tests, and local verification.
- Use Claude for strategy, architecture critique, product framing, and second-pass review.
- Use Cursor or Copilot for local editing assistance only when the acceptance criteria are already clear.
- Use NOVA as the runtime learning companion for students, not as a repository-writing agent.

Before accepting AI output, ask:

- Did it read the relevant project files?
- Did it respect current repo instructions?
- Did it invent a backend contract, model behavior, or product claim?
- Did it add hidden risk, new dependency, or untested behavior?
- Did it preserve accessibility, i18n, and observability expectations?

## Documentation Etiquette

Good docs are operational. They should help someone make the next correct decision faster.

Keep docs:

- Dated when the context can become stale.
- Linked to source files or tasks.
- Clear about what is fact, decision, assumption, or open question.
- Short enough to scan, but detailed enough to prevent repeated explanations.

When updating docs, do not rewrite history unless the old statement is wrong and harmful. Prefer adding a "Current state" note that explains what changed.

## Escalation Rules

Escalate to Tamil immediately when work touches:

- Payment, billing, subscription gates, or Stripe.
- Authentication, Supabase RLS, JWTs, or production user data.
- IELTS scoring, AI prompts, memory, or student feedback.
- Production deploys, rollback, monitoring, or incident response.
- Any copy that makes a claim about score improvement, exam results, or AI capability.

Escalation should include the concrete risk and the decision needed. Do not send a vague alarm.

## Definition Of A Good Handoff

A handoff is good when Tamil can understand the state of work in five minutes:

- What changed.
- Why it matters.
- What is verified.
- What is still unknown.
- What decision is needed next.

