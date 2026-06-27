# YNova MBS Weekly Mobile Test And Publish Readiness Plan

This is Yaomin's main mobile task for the week of 2026-06-29.

The goal is to deeply understand how YNova MBS behaves when wrapped by
Capacitor, then run the app on Android and iOS, capture screenshot evidence,
and write a clear review of what works, what is blocked, and what must be fixed
before any app-store release path.

This task is for the production YNova MBS app repository, not this
Yaomin-YNova handoff hub. This hub only stores the non-sensitive task note.

## Outcome

By the end of the week, Yaomin should produce one review document with:

- Android screenshots.
- iOS screenshots.
- A completed test checklist.
- A short explanation of what is working.
- A short explanation of what needs engineering attention.
- Blockers, risks, and decisions needed from Tamil.
- A publish-readiness note for Android and iOS.

Do not include student transcripts, recordings, billing data, secrets, provider
keys, production learner screenshots, or private incident details in the output.

## Source Docs To Study First

Read these before opening Android Studio or Xcode:

1. `docs/product/ynova_mbs_architecture.md`
2. `docs/onboarding/ynova_mbs_intern_book.md`
3. `docs/onboarding/ynova_mbs_intern_handoff_review.md`
4. `docs/onboarding/ynova_full_onboarding_guide.md`
5. `docs/engineering/ynova_mbs_capacitor_technical_guide.md`
6. The production MBS repo's `README.md`, `AGENTS.md` or `CLAUDE.md`,
   `package.json`, `capacitor.config.*`, `android/`, and `ios/` folders.

While researching, write down:

- Which repo is the real app repo.
- Which commands the real app repo uses.
- Which environment variables are required.
- Which values are safe for local development.
- Which values must come from Tamil or a secret manager.
- Which tasks require a simulator and which require a real device.

## Mental Model

Use this model when explaining the work:

```text
Vite web app
  -> npm run build
  -> static web assets
  -> npx cap sync
  -> Android and iOS native projects
  -> simulator or device test
  -> review notes
  -> publish readiness decision
```

Capacitor is the mobile container. It does not replace the web app, backend, or
product trust boundaries. If the web app is broken in the browser, fix the web
app first. If the browser works but the mobile app fails, inspect Capacitor
config, permissions, deep links, native logs, safe areas, plugin behavior, and
platform policy.

## Step-By-Step Work

### Step 1: Confirm The Working Repo

Work in the YNova MBS app repository, not this static handoff hub.

Before running commands, confirm:

- The repo name and branch.
- Whether the branch is safe for local testing.
- Whether Android and iOS folders already exist.
- Whether there are local setup instructions for Capacitor.
- Whether Tamil wants testing on simulator only or real devices too.

Record this in the final report:

```text
Repo:
Branch:
Commit:
Date tested:
Tester:
Android target:
iOS target:
```

### Step 2: Install And Verify Web App First

Use the real app repo instructions. If the repo does not define a custom script,
the expected shape is usually:

```bash
npm install
npm run build
npm test
```

Do not skip this step. A mobile wrapper cannot prove the app is healthy if the
web build or tests are failing.

Record:

- Install result.
- Build result.
- Test result.
- Any missing environment variables.
- Any warnings that look release-relevant.

### Step 3: Run The Web App Locally

Start the local dev server using the real MBS repo instructions.

Check at least:

- Landing or first route loads.
- Login or auth entry point appears.
- Main authenticated app shell loads if test credentials are available.
- Home route renders.
- Training route renders.
- Mock test entry route renders.
- Review route renders.
- Profile/settings route renders.
- Mobile-width browser layout is usable.

If the web app fails here, stop and document the web blocker before moving to
Android or iOS.

### Step 4: Sync Capacitor

After the web build passes, sync the native projects.

Use the real repo instructions. The common command is:

```bash
npx cap sync
```

Record:

- Whether sync completed.
- Whether Android sync succeeded.
- Whether iOS sync succeeded.
- Any plugin warnings.
- Any config warnings.
- Any native dependency warnings.

Do not add secrets to native config files.

### Step 5: Android Run

Open the Android project with the real repo instructions. The common command is:

```bash
npx cap open android
```

Then use Android Studio to run the app on the agreed emulator or device.

Check:

- App launches.
- Splash/icon/app name look correct enough for test review.
- First screen renders.
- Login/auth path works or fails with a documented reason.
- Navigation works after login or in accessible public routes.
- Mobile keyboard does not block important inputs.
- Safe areas and bottom navigation are usable.
- Microphone permission appears when recording is tested.
- Recording state is visible before, during, and after recording.
- Audio playback only happens after user action.
- App pause/resume does not break auth or active flow.
- Mock test timer or attempt state refreshes from the backend where applicable.
- Error states are visible and understandable.

Capture screenshots for:

- App launch or first screen.
- Auth screen.
- Home or main shell.
- Training screen.
- Recording permission or recording state.
- Mock test entry or timer state.
- Review screen.
- Profile/settings screen.
- Any Android-specific bug.

### Step 6: iOS Run

Open the iOS project with the real repo instructions. The common command is:

```bash
npx cap open ios
```

Then use Xcode to run the app on the agreed simulator or device.

Check:

- App launches.
- Splash/icon/app name look correct enough for test review.
- First screen renders.
- Login/auth path works or fails with a documented reason.
- Navigation works after login or in accessible public routes.
- iPhone safe areas are respected.
- Keyboard does not trap or cover critical form actions.
- Microphone permission appears when recording is tested.
- `Info.plist` has the required microphone permission wording.
- Recording state is visible before, during, and after recording.
- Audio playback only happens after user action.
- App pause/resume does not break auth or active flow.
- Mock test timer or attempt state refreshes from the backend where applicable.
- Error states are visible and understandable.

Capture screenshots for:

- App launch or first screen.
- Auth screen.
- Home or main shell.
- Training screen.
- Recording permission or recording state.
- Mock test entry or timer state.
- Review screen.
- Profile/settings screen.
- Any iOS-specific bug.

### Step 7: Compare Android, iOS, And Browser

Create a short comparison table:

| Area | Browser | Android | iOS | Notes |
| --- | --- | --- | --- | --- |
| Launch | Pass/Fail | Pass/Fail | Pass/Fail | |
| Auth | Pass/Fail | Pass/Fail | Pass/Fail | |
| Navigation | Pass/Fail | Pass/Fail | Pass/Fail | |
| Training | Pass/Fail | Pass/Fail | Pass/Fail | |
| Recording | Pass/Fail | Pass/Fail | Pass/Fail | |
| Audio playback | Pass/Fail | Pass/Fail | Pass/Fail | |
| Mock test | Pass/Fail | Pass/Fail | Pass/Fail | |
| Review | Pass/Fail | Pass/Fail | Pass/Fail | |
| Profile | Pass/Fail | Pass/Fail | Pass/Fail | |
| Pause/resume | Pass/Fail | Pass/Fail | Pass/Fail | |

Mark something as "Not tested" when it was not tested. Do not turn unknowns
into passes.

### Step 8: Write Findings In Review Order

Use this order:

1. Blockers that prevent running the app.
2. Bugs that prevent a learner from completing a key flow.
3. Mobile-only bugs.
4. Browser bugs discovered during mobile prep.
5. Release risks.
6. Nice-to-have polish.

For each issue, include:

```text
Title:
Platform:
Severity:
Route or screen:
Steps to reproduce:
Expected:
Actual:
Screenshot:
Logs if safe:
Owner guess:
Decision needed:
```

Do not paste secrets, access tokens, full transcripts, private learner content,
or production student screenshots into logs or notes.

## Required Output Document

Yaomin's final output should be a clean document with this structure:

```markdown
# YNova MBS Mobile Test Review - Week Of 2026-06-29

## Summary
One paragraph: what was tested, where, and the overall result.

## Environment
- Repo:
- Branch:
- Commit:
- Date:
- Android device or emulator:
- iOS simulator or device:
- Backend/API target:
- Tester:

## Commands Run
- npm install:
- npm run build:
- npm test:
- npx cap sync:
- Android run:
- iOS run:

## Screenshot Evidence
Add screenshots with short captions. Use non-sensitive test accounts and screens.

## Test Checklist
Use the browser/Android/iOS comparison table.

## What Works
List confirmed working areas.

## What Needs Engineering Attention
List issues in severity order.

## Publish Readiness
Say whether Android and iOS are ready for internal testing, external beta, or
not ready. Explain why.

## Decisions Needed From Tamil
List decisions, secrets, accounts, device access, app-store access, or policy
questions that block next steps.

## Next Week Recommendation
Give 3 to 5 concrete next actions.
```

## Publish App Guideline

Yaomin should not publish the app independently. Publishing requires Tamil's
approval because it can affect users, billing, auth, privacy, app-store
metadata, and production trust.

Use this release ladder:

1. Local web run: app works in browser.
2. Local native run: Android and iOS launch through Capacitor.
3. Internal native test: known testers install and check the core flows.
4. Release candidate: build, tests, mobile checklist, screenshots, and release
   notes are complete.
5. Store submission: Tamil approves metadata, screenshots, privacy answers,
   signing, and rollout.
6. Post-release smoke: confirm install, auth, training, recording, mock test,
   review, and profile still work.

Android publish-readiness questions:

- Is the package id correct?
- Is signing configured outside source control?
- Is the version code incremented?
- Are app name, icon, splash, and adaptive icon acceptable?
- Are microphone and notification permissions justified?
- Are Play Store screenshots and privacy answers accurate?
- Is the build intended for internal testing, closed testing, or production?

iOS publish-readiness questions:

- Is the bundle id correct?
- Is signing handled through the correct Apple team?
- Is the build number incremented?
- Are app name, icon, splash, and launch screen acceptable?
- Is `NSMicrophoneUsageDescription` present and clear?
- Are App Store screenshots and privacy answers accurate?
- Is the build intended for local test, TestFlight, or App Store release?

Do not move from local testing to store submission until:

- `npm run build` passes.
- `npm test` passes.
- Android run has screenshot evidence.
- iOS run has screenshot evidence.
- Auth, microphone, audio, safe area, keyboard, and pause/resume risks have
  been reviewed.
- No secrets are committed.
- No production learner data is included in the review artifact.
- Tamil has approved the release path.

## Definition Of Done

This task is done when:

- Yaomin has read the source docs and the real MBS mobile config.
- The web app has been built and tested.
- Capacitor sync has been attempted and documented.
- Android has been run or the blocker is clearly documented.
- iOS has been run or the blocker is clearly documented.
- Screenshots are captured for both platforms, or blockers explain why not.
- A mobile test review document is ready for Tamil.
- Publish readiness is marked as one of:
  - Not ready.
  - Ready for local developer testing.
  - Ready for internal Android/iOS testing.
  - Ready for TestFlight or Play internal testing.
  - Ready for store submission after Tamil approval.
