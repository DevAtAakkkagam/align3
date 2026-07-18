<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: align3
description: Ancient Terni Lapilli / Tamil kattam board game with warm, tactile, spring-driven play
---

# Design System: align3

## 1. Overview

**Creative North Star: "The Floor Between Us"**

Two people crouched over a game scratched into the ground: a Roman soldier's circle carved in paving stone, a Tamil grandmother's square chalked on a red-oxide floor. align3 is that floor, lifted onto a screen. The surface is drenched in the material itself; the board is not a widget sitting on a page, the board IS the page. Everything else (turn indicator, settings) stays peripheral and quiet.

The feel is warm, tactile, spirited: chunky pieces with personality that lag, glide, and settle with spring weight (Threes' bounce, Assemble with Care's handmade warmth). This system explicitly rejects generic SaaS/flat web sterility, cheap mobile-game clutter, and skeuomorphic photo-texture kitsch. Materiality comes from palette, line quality, and motion, never from photo textures.

**Key Characteristics:**
- Drenched surfaces: each theme's floor material fills the viewport
- Two moods, one soul: Roman stone-carved circle vs. Tamil chalk-on-oxide square
- Slightly irregular, hand-drawn line quality on board markings
- Spring-weighted motion as the primary texture
- Peripheral, whisper-quiet chrome

## 2. Colors

**The Drenched Rule.** The surface IS the material. The theme's floor color fills the viewport edge to edge; pieces and the single warm accent pop against it. No white app background, ever.

### Primary
- **Roman Stone** (warm marble/limestone cream family) `[to be resolved during implementation]`: full-viewport surface of the circle theme; board lines carved slightly darker into it.
- **Tamil Oxide** (deep red-oxide floor family) `[to be resolved during implementation]`: full-viewport surface of the square theme; board lines chalked in warm off-white onto it.

### Neutral
- **Chalk** (warm off-white, never #fff) `[to be resolved]`: Tamil board lines, light text on oxide.
- **Charcoal** (warm near-black, never #000) `[to be resolved]`: text on stone, carved line shadows.

### Named Rules
**The Two-Floors Rule.** Each theme owns its own drenched palette; they never mix on screen. Player piece colors are the only constants across both themes and must hold WCAG AA contrast against both floors.

## 3. Typography

**Display Font:** warm, slightly carved serif `[font pairing to be chosen at implementation]`
**Body Font:** clean humanist sans `[to be chosen at implementation]`

**Character:** Ancient without costume. The serif appears rarely (title, win moment) so it lands with ceremony; the sans does the quiet everyday work of the HUD.

### Hierarchy
- **Display** (serif): game title, win banner only.
- **Body / Label** (sans): turn indicator, phase label, settings. Weight contrast ≥ 1.25 scale steps; body ≤ 75ch.

### Named Rules
**The Rare Serif Rule.** The serif is ceremonial. If it appears more than twice on one screen, it has lost its weight.

## 4. Elevation

Flat by default. Depth is conveyed by the material fiction, not shadows: board lines read as carved (stone theme) or chalked (oxide theme); pieces get a single soft contact shadow only while lifted mid-drag, which vanishes on settle. No card shadows, no layered panels.

### Named Rules
**The Lift-Only Rule.** The only shadow in the app belongs to a piece in the player's grip.

## 6. Do's and Don'ts

### Do:
- **Do** drench the viewport in the theme's floor material; the board is the page.
- **Do** give every piece interaction spring weight: lag on drag, overshoot on settle, bounce-back on illegal drop.
- **Do** draw board lines with slight hand-drawn irregularity (carved for Roman, chalked for Tamil).
- **Do** keep player pieces distinct by shape + color, AA-contrasted against both floors.
- **Do** honor `prefers-reduced-motion` with fades/instant placement.

### Don't:
- **Don't** produce "generic SaaS/flat web": no sterile flat cards, default blues, corporate minimalism, dashboard chrome.
- **Don't** produce "cheap mobile-game clutter": no coins, popups, neon gradients, fake-3D plastic buttons, reward jingles (anti-reference: Ludo King-style Play Store board games).
- **Don't** produce "skeuomorphic kitsch": no 2010s photo-real wood/leather/marble textures; material comes from palette and line quality.
- **Don't** use pure #000 or #fff, side-stripe borders, gradient text, or glassmorphism.
- **Don't** put the board inside a card or container; no nested chrome around the play surface.
