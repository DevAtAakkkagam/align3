# Design Brief: align3 game screen

## 1. Feature Summary
The entire app: a single game screen where two people share one device to play Terni Lapilli (Roman circle board, default) or Tamil kattam vilayattu (square board, via settings). Drag-and-drop stones with spring weight; the theme switch is a genuine rules-variant switch.

## 2. Primary User Action
Drag (or tap) a stone onto a point. Everything on screen serves making the current legal move obvious and satisfying.

## 3. Design Direction
- **Color strategy:** Drenched (per DESIGN.md). Roman Stone cream floor / Tamil Oxide red floor fill the viewport; board lines carved vs chalked.
- **Scene sentence:** Two friends at a cafe table with a phone lying flat between them under warm indoor light, leaning in, teasing each other between moves. → Theme is the floor material itself: light warm stone (Roman), deep warm oxide (Tamil). No separate dark mode.
- **Anchors:** Threes (chunky piece personality, bounce), Assemble with Care (handmade warmth). Anti: Ludo King-style clutter.

## 4. Scope
Production-ready. One screen (game + inline settings flyout), fully interactive, polish-until-ships: all states, reduced motion, responsive, AA contrast.

## 5. Layout Strategy
- **Face-to-face:** device lies flat between players. Board centered and dominant (~70% of the short axis). Each player gets a thin HUD strip on their own edge; the far player's strip is rotated 180°. Portrait-first; on wide/desktop screens the strips move to left/right edges rotated toward each "side" or fall back to upright top/bottom.
- Chrome is a corner whisper: restart + board-switch icons near P1's corner; board switch opens a tiny inline flyout with two board miniatures (circle/square) and a one-line rules note ("circle wins through the center · square wins on any line").
- No containers, no cards. The floor runs edge to edge; the board is drawn directly on it.

## 6. Key States
- **Placement phase:** each player's HUD shows their 3 unplaced stones as a hand; empty legal points breathe faintly on your turn.
- **Movement phase:** grabbing a stone highlights adjacent empty points (chalk/carve glow); non-adjacent points stay inert.
- **Active turn:** current player's HUD strip warms/brightens; the other dims. Turn hint microcopy sits in the active strip, facing that player.
- **Invalid drop:** stone springs back to origin with a small shake; no error text.
- **Win:** winning line draws itself along the carved/chalked groove, stones give a settle-thump, serif banner faces the winner ("Marcus wins" style: "Player 1 aligns three"), one 'Again' action facing both (mirrored). Loser's strip stays visible, dimmed.
- **Theme switch mid-game:** board morphs (points spring to new coords, lines crossfade); a confirm note only if a game is in progress, since win rules change → restart required.
- **Reduced motion:** springs replaced by ~150ms fades/instant placement; win line appears without draw-on.
- **First run:** no modal. Phase hint text is the only teacher ("Place your 3 stones" → "Slide to a joined point").

## 7. Interaction Model
- Drag with pointer capture: stone lags springily behind finger, soft contact shadow while lifted (the app's only shadow), snaps to nearest legal point within radius on release, else springs home.
- Tap-tap fallback: tap stone → legal points glow → tap destination.
- Placement phase: drag from your hand strip onto any empty point (or tap point directly).
- Corner icons: restart asks nothing mid-placement, asks one inline confirm if a game is underway. Board flyout: tap miniature → morph + restart.
- All interactive targets ≥ 44px.

## 8. Content Requirements
- Phase hints: "Place your 3 stones" / "Slide a stone to a joined point" (≤ 6 words, per-player orientation).
- Win banner: "Three in a row!" + player identity (color+shape glyph, not just color).
- Board flyout labels: "Roman circle — wins along spokes and rim" / "Tamil square — wins on straight lines".
- Restart confirm: "Start over?" Voice: brief, friendly, playful; no lore dumps.
- Player identity: Player 1 / Player 2 with distinct stone shape + color (colorblind-safe).

## 9. Recommended References
- impeccable reference/product.md (register)
- DESIGN.md seed (Drenched, Rare Serif, Lift-Only rules)
- motion guidance: spring params per interaction (drag-follow stiffer, settle softer)

## 10. Open Questions
- Exact palette values (resolve during implementation against AA contrast on both floors).
- Font pairing (carved-feel serif + humanist sans; pick at implementation).
- Desktop wide-layout HUD placement: side strips vs top/bottom (decide at responsive pass).
- Stone shapes for P1/P2 (e.g., round river stone vs squared tile).
