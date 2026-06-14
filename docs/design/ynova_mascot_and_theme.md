# YNova Mascot And Theme

This hub includes the current YNova NOVA mascot assets and a lightweight version of the MBS Clay Bright theme so Yaomin's onboarding space feels connected to the product.

## Asset Sources

Copied from the MBS repository:

- `public/nova-brand/nova-mark-transparent-2048.png`
- `public/nova-brand/nova-furry-star-mascot-transparent.png`
- `public/nova-poses/*.png`
- `public/nova-poses/MANIFEST.json`
- `public/nova-poses/README.md`

These assets are project-owned YNova artifacts. Do not replace them with generic stock mascots.

## NOVA Pose Inventory

The hub ships all current NOVA pose states:

- `idle`
- `wave`
- `listening`
- `thinking`
- `encouraging`
- `celebrating`
- `correcting`
- `reading`
- `pointing`
- `sleeping`
- `surprised`
- `apologetic`

Use states deliberately:

- `idle`: neutral presence.
- `wave`: welcome and first-run onboarding.
- `listening`: user is speaking or being heard.
- `thinking`: model or scoring work is happening.
- `encouraging`: nudge without pressure.
- `celebrating`: genuine milestone.
- `correcting`: corrective feedback with care.
- `reading`: docs, review, or learning mode.
- `pointing`: guide attention to a next action.
- `sleeping`: paused or inactive state.
- `surprised`: unexpected result or discovery.
- `apologetic`: error recovery.

Do not use NOVA as filler. The mascot should communicate product state or emotional tone.

## Clay Bright Theme

MBS uses a restrained Clay Bright system:

```css
--blue-500: #0ea5e9;
--blue-700: #0369a1;
--yellow-400: #fbbf24;
--yellow-600: #d97706;
--red-500: #dc2626;
--green-600: #16a34a;
--nova-gold: #fbbf24;
```

Design intent:

- Sky blue for primary action and navigation.
- Amber/gold for NOVA, warmth, and learning momentum.
- Red for danger, IELTS urgency, or destructive actions.
- Green for success and completed work.
- Neutral white/gray surfaces for operational clarity.

Avoid:

- Purple-dominant gradients.
- Beige or cream dominance.
- Decorative blobs.
- Giant rounded generic cards.
- Overusing mascot imagery in dense operational surfaces.

## Dashboard Theme Use

The Yaomin-YNova dashboard uses:

- White and soft gray surfaces in light mode.
- Deep navy and slate surfaces in dark mode.
- YNova sky for selected navigation and primary buttons.
- NOVA gold only in mascot and progress accents.
- Small, stable radii for dashboard controls.
- Inter-like system typography.

The dashboard is intentionally more operational than marketing-like. Yaomin should be able to scan tasks, docs, priority, due dates, and context without visual noise.

## Accessibility

Mascot images must have meaningful `alt` text when the state matters. If an image is decorative, use empty alt text. The dashboard state strip names every pose because it is teaching Yaomin the state inventory.

Do not rely on color alone for priority or status. Pair color with text, labels, or icons.

