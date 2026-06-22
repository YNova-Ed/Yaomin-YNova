# YNova MBS Capacitor Technical Guide

This guide explains how Capacitor fits into YNova MBS. It is for interns and product reviewers who need enough mobile knowledge to understand implementation plans, review risks, and ask useful questions.

## One-Sentence Summary

Capacitor packages the Vite web app into Android and iOS shells, while the core product logic remains in the web app and backend.

## Mental Model

```text
Vite web app
  |
  | npm run build
  v
Static web assets
  |
  | npx cap sync
  v
android/ and ios/ native projects
  |
  v
Installed mobile app
```

Capacitor is a bridge. It does not remove the need for browser-quality HTML, CSS, routing, auth, and API behavior.

## What Belongs In Web Code

Most YNova MBS behavior should stay in web code:

- routes,
- components,
- stores,
- API clients,
- validation,
- learning flow UI,
- scoring result UI,
- review UI,
- profile screens,
- most design-system behavior.

Reason: one shared implementation can serve web, Android, and iOS.

## What Belongs In Native Configuration

Native platform configuration should cover:

- app id and app name,
- icons and splash assets,
- permissions,
- deep links,
- plugin setup,
- signing and release configuration,
- platform-specific fixes that cannot be handled in web code.

Keep native changes narrow. If a change can be solved cleanly in shared web code, solve it there first.

## Common Mobile Risks

### Microphone Permission

IELTS Speaking requires recording. Mobile platforms require explicit microphone permission.

Review questions:

- Does the app request permission before recording?
- Is the permission message clear?
- What happens if the student denies permission?
- Can the student recover through settings?
- Is the failure state visible and kind?

### Audio Playback

Text-to-speech or feedback audio may be blocked if it starts without a user action.

Review questions:

- Does playback happen after a tap?
- Is there a visible play/pause state?
- Does the UI recover if audio fails?
- Is there a text alternative?

### Auth Redirects And Deep Links

Supabase auth flows may use redirects. Mobile wrappers need correct app links or custom schemes.

Review questions:

- Does login work in the web app first?
- Does login return to the mobile app?
- Does password reset return to the right screen?
- Are redirect URLs configured in Supabase and native manifests?

### Safe Areas And Keyboard

Mobile screens have notches, home indicators, and virtual keyboards.

Review questions:

- Is content hidden under the notch or bottom bar?
- Does the keyboard cover the active input?
- Can forms scroll when the keyboard is open?
- Are primary actions still reachable?

### App Pause And Resume

Students may leave the app during a recording, mock test, or payment flow.

Review questions:

- What state is saved before pause?
- What state is refreshed after resume?
- Is a timed attempt still valid?
- Does the app show a stale-state recovery message?

## Capacitor Scenario: Recording Fails On iOS

```text
Symptom:
  Student taps record, but no recording starts.

Check 1:
  Does recording work in desktop browser?

Check 2:
  Does recording work in mobile Safari?

Check 3:
  Did iOS request microphone permission?

Check 4:
  Does Info.plist contain the microphone usage description?

Check 5:
  Do native logs show a permission or plugin error?

Check 6:
  Does the UI show a useful recovery message?
```

The key reasoning: isolate whether the bug is product code, browser behavior, Capacitor bridge behavior, native permission config, or platform policy.

## Capacitor Scenario: Auth Works On Web But Not Mobile

```text
Symptom:
  Student signs in, but mobile app does not return to the logged-in state.

Likely areas:
  Supabase redirect URL
  deep link configuration
  app scheme
  route parsing
  session persistence
  auth store boot timing
```

Review rule: do not patch the login screen blindly. Trace the full auth path.

## Capacitor Scenario: Mock Test Timer Looks Wrong After Resume

```text
Symptom:
  Student backgrounds app and returns. Timer looks reset or stale.

Correct model:
  Server owns attempt expiry.
  Frontend displays remaining time from server-authoritative data.
  Resume should refresh attempt state.
```

Do not let the mobile client become the source of truth for paid mock-test expiry.

## Release Checklist For Mobile Work

Before a mobile-affecting task is done:

- web build passes,
- web tests pass,
- feature works in browser,
- Android run was checked if Android behavior changed,
- iOS run was checked if iOS behavior changed,
- permissions were reviewed,
- auth redirects were reviewed when auth changed,
- audio behavior was reviewed when voice changed,
- safe-area and keyboard behavior were reviewed,
- no production secrets were added to native config,
- release notes mention mobile risk if relevant.

## Simple Explanation For Product Notes

Use this wording when explaining Capacitor to a non-engineer:

```text
YNova MBS is built as a web app and wrapped for mobile. That lets us share most product code across browser, Android, and iOS. Mobile-specific work is still needed for permissions, app links, audio, safe areas, store builds, and platform testing.
```

## What Not To Do

- Do not duplicate business logic in Android or iOS unless there is a strong platform reason.
- Do not put provider keys or Supabase service-role keys in native app files.
- Do not assume a browser success means mobile release is safe.
- Do not assume a mobile bug requires native code.
- Do not ship audio or auth changes without real device or simulator testing.

## Intern Learning Path

1. Understand the web flow first.
2. Read Capacitor configuration in the MBS repo.
3. Learn how `npm run build` and `npx cap sync` connect.
4. Run the app in Android Studio or Xcode with Tamil's setup guidance.
5. Test microphone, auth, and safe-area behavior.
6. Write down platform-specific failures separately from product-code failures.
