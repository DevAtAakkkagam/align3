# Product

## Register

product

## Users

Two friends or family members sharing one device (phone, tablet, or laptop) at home, in a cafe, or while travelling. Casual, spontaneous play: rounds last 2–5 minutes. No accounts, no network — the device passes between hands or sits between the players. Players may be encountering Terni Lapilli / kattam vilayattu for the first time, so rules must be learnable in one round through the UI itself (highlighted legal moves, clear phase/turn indication).

## Product Purpose

align3 is a 2-player local-hotseat implementation of the ancient Roman board game **Terni Lapilli** (three men's morris), with a setting that switches the board to the **Tamil kattam vilayattu** square variant. The theme switch is a genuine variant switch: the Roman circle board wins along its spokes (4 diameters) and rim arcs (any 3 consecutive rim points); the Tamil square board wins on its 8 straight lines (rows, columns, diagonals) — bent rim triples don't count there. Success looks like: two people finish a round, immediately say "again", and fight over the board style setting.

## Brand Personality

**Warm, tactile, spirited.** Cozy and handmade — pieces feel like real stones sliding into grooves on a floor-drawn board — but with competitive energy between the two players (turn tension, win moments that land with a thump, an inviting rematch). Voice in UI copy: brief, friendly, a little playful; never corporate, never lore-dumping.

## Anti-references

- **Generic SaaS/flat web**: no sterile flat cards, default blues, corporate minimalism, dashboard chrome.
- **Cheap mobile-game clutter**: no coins, popups, neon gradients, fake-3D plastic buttons, reward jingles.
- **Skeuomorphic kitsch**: evoke stone/chalk/floor-drawn texture through restraint (grain, palette, line quality), not 2010s photo-real wood-and-leather textures.

## Design Principles

1. **The board is the app.** One screen carries the whole product; everything else (HUD, settings) stays quiet and peripheral.
2. **Weight you can feel.** Every interaction uses spring physics — pieces lag, glide, overshoot, settle. Motion is the texture; it must respect reduced-motion preferences.
3. **Teach through the board, not text.** Legal moves highlight, illegal drops bounce back, phases announce themselves. No rules modal required to finish a first game.
4. **Two ancient games, honestly told.** Circle and square are distinct historical variants with different win rules — the UI makes that difference visible and celebrated, not hidden.
5. **Handmade over rendered.** Slightly irregular lines, mineral palette, chalk and stone moods — crafted imperfection, never photo-texture realism.

## Accessibility & Inclusion

- WCAG AA contrast for all text and interactive states.
- `prefers-reduced-motion`: replace spring animations with short fades/instant placement.
- Colorblind-safe player identity: pieces differ by **shape + color**, never color alone.
- Touch targets ≥ 44px; drag interactions also work with plain tap-tap fallback where feasible.
