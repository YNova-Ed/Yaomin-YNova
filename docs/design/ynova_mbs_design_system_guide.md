# YNova MBS Design System Guide

![NOVA pointing state](../../public/nova-poses/pointing.png)

This guide explains the YNova MBS design system in product terms. It helps Yaomin review screens, write design requirements, and avoid visual changes that weaken the learning experience.

## Design Goal

YNova should feel focused, warm, trustworthy, and useful. The design should help students practice IELTS Speaking, understand feedback, and return consistently.

The product should not feel like:

- a generic chatbot,
- a toy,
- a loud marketing page inside the app,
- a dashboard full of decorative cards,
- an exam site that creates unnecessary pressure.

## Clay Bright System

The MBS design language is called Clay Bright in existing docs.

Core intent:

```text
Sky:
  primary action, navigation, calm momentum

Amber:
  NOVA, encouragement, learning warmth

Green:
  success, completion, healthy progress

Red:
  risk, destructive actions, exam urgency

Neutral:
  reading, forms, dense product work
```

Use color as a signal, not as decoration.

## NOVA Usage

NOVA is a learning companion and state signal. NOVA should appear when she helps the student understand a moment.

Use examples:

- `wave`: welcome and first-run onboarding,
- `listening`: recording or speech attention,
- `thinking`: model work or scoring in progress,
- `encouraging`: return-to-practice nudge,
- `celebrating`: genuine milestone,
- `correcting`: careful correction,
- `reading`: review and study context,
- `apologetic`: error recovery.

Avoid examples:

- placing NOVA in every card,
- using NOVA to fill empty space,
- celebrating ordinary clicks,
- using a happy state when the product failed,
- covering important content with mascot art.

## Product Surface Principles

### Landing

Landing pages should explain the product promise clearly without unrealistic score guarantees.

Review questions:

- Is the offer obvious?
- Is the IELTS Speaking focus visible?
- Are trust points concrete?
- Is pricing or school value understandable?
- Does the page avoid exaggerated claims?

### Onboarding

Onboarding should collect enough information to personalize practice without feeling like a long form.

Review questions:

- Does each question have a reason?
- Can the student recover from mistakes?
- Is the next step obvious?
- Is progress visible?

### Home

Home is the daily command center.

Review questions:

- Does the student know what to do next?
- Is NOVA using real context?
- Are progress signals honest?
- Is the page calm enough to revisit daily?

### Training

Training should reduce anxiety by breaking speaking practice into stages.

Review questions:

- Is the current stage clear?
- Does the student know what answer length is expected?
- Are examples helpful but not overbearing?
- Is recording state unmistakable?
- Is feedback actionable?

### Mock Test

Mock test should feel more serious and exam-aligned.

Review questions:

- Is timing clear?
- Are paid gates understandable?
- Are expired attempts handled honestly?
- Is scoring feedback structured and credible?
- Is the student told what to improve next?

### Review

Review should feel efficient and light.

Review questions:

- Is one review action obvious?
- Is correction gentle?
- Does the student understand why an item returned?
- Is the flow fast enough for daily use?

### Profile And Settings

Profile should be quiet, predictable, and safe.

Review questions:

- Can students edit important information?
- Are destructive actions clearly separated?
- Is billing information handled safely?
- Are privacy-sensitive fields treated carefully?

## Screen Review Diagram

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 360" role="img" aria-label="Design review loop">
  <rect width="860" height="360" fill="#ffffff"/>
  <rect x="40" y="60" width="160" height="90" rx="8" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="120" y="98" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">User goal</text>
  <text x="120" y="122" text-anchor="middle" font-family="Arial" font-size="12">Why here?</text>
  <rect x="250" y="60" width="160" height="90" rx="8" fill="#fef3c7" stroke="#d97706"/>
  <text x="330" y="98" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Next action</text>
  <text x="330" y="122" text-anchor="middle" font-family="Arial" font-size="12">What now?</text>
  <rect x="460" y="60" width="160" height="90" rx="8" fill="#dcfce7" stroke="#16a34a"/>
  <text x="540" y="98" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Feedback</text>
  <text x="540" y="122" text-anchor="middle" font-family="Arial" font-size="12">What changed?</text>
  <rect x="670" y="60" width="150" height="90" rx="8" fill="#f1f5f9" stroke="#64748b"/>
  <text x="745" y="98" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700">Return</text>
  <text x="745" y="122" text-anchor="middle" font-family="Arial" font-size="12">Why come back?</text>
  <path d="M200 105 H250" stroke="#0f172a" stroke-width="2" marker-end="url(#designArrow)"/>
  <path d="M410 105 H460" stroke="#0f172a" stroke-width="2" marker-end="url(#designArrow)"/>
  <path d="M620 105 H670" stroke="#0f172a" stroke-width="2" marker-end="url(#designArrow)"/>
  <path d="M745 150 C745 270 120 270 120 154" stroke="#0f172a" stroke-width="2" fill="none" marker-end="url(#designArrow)"/>
  <defs>
    <marker id="designArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
  </defs>
</svg>

## Accessibility Rules

Every design requirement should consider:

- keyboard access,
- visible focus,
- clear labels,
- color contrast,
- readable font sizes,
- non-color status cues,
- useful error copy,
- reduced motion where needed,
- mobile viewport behavior.

For voice features, accessibility also means students can understand and recover from audio failures.

## Copy Rules

YNova copy should be direct and kind.

Good:

```text
Your mock test expired. Start a new attempt when you are ready.
```

Weak:

```text
Something went wrong.
```

Good:

```text
Try one more Part 2 answer. Focus on adding one clear example.
```

Weak:

```text
Practice more to improve.
```

## Design Review Checklist

Before approving a UI change, check:

- the user goal is clear,
- the next action is visible,
- loading and error states exist,
- mobile layout is not cramped,
- keyboard users can complete the flow,
- NOVA state matches the moment,
- colors are signals rather than decoration,
- copy is specific and calm,
- sensitive data is not exposed,
- screenshots or browser checks were included for visual changes.

## Intern Design Exercise

For any new screen, Yaomin should write:

```text
Screen:
  What is this screen?

Student goal:
  What is the student trying to do?

Primary action:
  What should be easiest to do?

Secondary action:
  What is allowed but less important?

Empty state:
  What appears when no data exists?

Error state:
  What appears when the system fails?

NOVA state:
  Should NOVA appear? If yes, why?

Mobile risk:
  What may break on a small screen?
```

If those answers are not clear, the design is not ready for implementation.
