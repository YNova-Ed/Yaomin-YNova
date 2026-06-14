# NOVA pose assets

12 emotion-state PNGs generated from the current NOVA mascot prompt set and
the current MBS-local character guide at
`../../docs/design-docs/nova-character.md`.

The current visual direction is the fluffy golden NOVA: soft fur-like star
body, glossy eyes, pink cheeks, small rounded limbs, and a small sky-blue
speech-bubble charm. The assets should feel like a polished language-learning
mascot, not hand-drawn placeholder art.

## Generation workflow

1. Generate the base reference image first and save as `_reference.png` in this directory.
2. For each of the 12 states (idle, wave, listening, thinking, encouraging, celebrating, correcting, reading, pointing, sleeping, surprised, apologetic), use a distinct prompt that preserves the same furry golden star character and sky-blue speech-bubble charm.
3. Generate on a flat `#00ff00` chroma-key background, then remove the background with the imagegen chroma-key helper.
4. Resize to `640x640` and optimize the PNG so each file remains below the test limit.
5. Update `MANIFEST.json` with the model, generation mode, and final SHA-256 for each pose.

## QA before merging

Run through the acceptance criteria in §"Acceptance criteria" of the prompt spec — every box must be checked. Common drift causes:
- Generator switched mid-batch → rerun with a single model
- Reference sheet not used as conditioning → character drifts pose-to-pose
- Background not transparent → rerun the imagegen chroma-key helper

## File contract

| File | Purpose | Approx size |
|---|---|---|
| `_reference.png` | Style anchor — never shown in product | ~300kb |
| `{state}.png` | One per emotion state | ~280-350kb |
| `MANIFEST.json` | Generation metadata for reproducibility | <5kb |

CSS animations layered on these PNGs in Phase 5 — see design spec §15.6.

## Platform assets

Run `python scripts/generate_nova_platform_assets.py` from the repo root after
changing `_reference.png`. It derives the web favicons/PWA icons, iOS app icon
and splash images, and Android launcher/splash resources from the same NOVA
reference so all platforms stay visually aligned.
