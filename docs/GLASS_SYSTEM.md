# Glass UI System (design.html)

Reference for the unified glossy/backdrop styling in [`design.html`](../design.html). Same visual design as before — only the **implementation** is centralized.

## Three axes

| Axis | Mechanism | Purpose |
|---|---|---|
| **Frame** | `.glass` + shape modifier | Border, blur, shadow, specular inset, compositing |
| **Fill** | `--glass-bg` / colored variant override | Background opacity/tint — **never** toggled by `@supports` |
| **Dim** | `.modal-scrim` (backdrop dim) | Darkens page behind transient UI (modals, drawer, dialogs) |

### Hard rules

- `@supports` may **only** enable/disable `backdrop-filter`. Never use it to replace `--glass-bg`.
- Never use `.glass-overlay` on navigation UI (tab bar, header). Its dark fill (`rgba(8,10,16,0.52)`) is only for transient flash toasts in-game.
- The **only** solid backgrounds allowed are: page background (`--bg`) and the top header logotype bar. Everything else is glass.

## Tokens (`:root`)

| Token | Role |
|---|---|
| `--glass-fill` | Standard inline glass fill (`rgba(255,255,255,0.08)`) |
| `--glass-fill-fallback` | Opaque fallback when backdrop API unavailable |
| `--glass-fill-overlay` | Darker fill for transient flash overlays (swipe feedback only) |
| `--glass-fill-overlay-fallback` | Opaque fallback for overlay tier |
| `--glass-border`, `--glass-specular`, `--glass-shadow`, `--glass-blur` | Frame chrome |
| `--glass-highlight-line` | Specular top-edge gradient for `::before` |

### Per-component token overrides

Components needing a custom tint or border set CSS custom properties on their class (they come after the utility classes in source order, winning the cascade):

```css
.my-component { --glass-bg: rgba(126,184,247,.1); --glass-border: rgba(126,184,247,.35); }
```

## Class stack recipes

```
Inline glossy tile (home banner, stat card, topic row):
  glass glass-tile glass-highlight glass-interactive

Floating dock / bottom tab bar:
  glass glass-tile glass-highlight           ← dock
  glass glass-pill                           ← pill tab bar (no overlay)

Modal / drawer / dialog panel:
  modal-root > modal-scrim + glass-sheet-shell > glass-sheet-surface glass glass-highlight

Small pill control (back btn, chip, HUD pill):
  glass glass-pill glass-chrome glass-interactive

Full-width action button (review, reset):
  glass glass-pill glass-interactive

Swipe flash toast (transient, in-game only):
  glass glass-pill glass-overlay glass-highlight
```

**Minimum glossy surface:** `glass` alone.

**Per-element custom fill** (no new CSS block needed):

```css
.my-banner { --glass-bg: linear-gradient(135deg, rgba(...), var(--glass-fill)); }
```

## Surface tiers

### Tier A — Glossy (use class stack)

Home banners, practice-dock, bottom tab bar, modal sheets, swipe-flash toasts.  
Stats tab: profile-stat cards, word items, topic rows, review/reset/topic buttons, sign-in unlock blocks.

### Tier B — Chrome (glass glass-pill/tile + glass-chrome)

Back button, practice chips, swipe level buttons, HUD pills, lang dropdown trigger, swipe-setup panel, practice card faces (practice-front/back carry their own glass directly in CSS — no class needed).

### Tier C — Solid (intentionally do NOT add glass)

Quiz choice buttons (cbtn), quiz word card, swipe cards, results card, dictionary/reading-writing rows, progress bar track, offline screen, quiz-prep overlay.

### Tier D — Dim only

`.modal-scrim` on modal roots.

## Compositing notes

- `.glass` has `position:relative` so `::before` in `glass-highlight` always positions relative to the glass element itself.
- `.glass` uses `isolation:isolate` to prevent sibling backdrop bleed.
- **Never add `transform:translateZ(0)` to `.glass` or any global glass modifier.** GPU compositing layers on scrollable-container children break the `position:fixed` nav bar's `backdrop-filter` (black rectangle artifact) and cause scroll-container clipping. `backdrop-filter` promotes its own layer only when it actually paints; no extra hint needed on modern browsers.
- `.glass-sheet-shell .glass-sheet-surface` suppresses the elevation drop-shadow (`--glass-elevation:0 0 0 transparent`) — the outer shell carries the big modal shadow.
- `.glass-interactive` hovers via `::after` overlay — never changes `background` on `:hover` (fixes cross-tile brightening).
- Tab enter animation (`fadeUp`) uses transform only — no opacity on `.tab-panel` (prevents backdrop glitches after tab switch).
- Practice card faces (`.practice-front/.practice-back`) use glass CSS directly without `isolation:isolate` or `transform:translateZ(0)` to preserve the `transform-style:preserve-3d` flip animation.

## Verification checklist

1. Bottom tab bar: frosted translucent pill — not dark, not solid.
2. Practice dock: visible frosted panel; blur with blur-disabled fallback still readable.
3. Stats tab: all cards (stat, word, topic, buttons) appear glassy — no solid dark boxes.
4. Home banners: hover lower grid tiles — upper banners stay uniform (no crop line).
5. Learn ↔ Practice ↔ Learn: no stray specular line on pill banners.
6. Design-lab modals: scrim dims page; panel stays glossy; no double shadow on modal surface.
7. Practice card flip: 3D flip animation works; front/back faces appear glassy.
8. Settings / announcement / error panels: same glass look as stat cards.

## Porting to production

When applying changes from `design.html` to `index.html`, port the glass utility block and class stacks. Skip `@design-only` regions (design-lab panel).
