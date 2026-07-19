# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm test` — run tests once (Vitest)
- `npm run test:watch` — watch mode
- Single test file: `npx vitest run src/lib/game/rules.test.ts`; filter by name: `npx vitest run -t "pattern"`

Deployment is GitHub Pages via `.github/workflows/deploy.yml` on push to main; it runs tests, then builds with `--base=/align3/`.

## What this is

A 2-player local-hotseat implementation of Terni Lapilli (three men's morris) in Svelte 5 + TypeScript + Vite. No router, no backend, no accounts — a single screen. Two board variants that are **genuinely different games, not skins**: the Roman circle wins on 4 spokes plus any 3 consecutive rim points (arcs); the Tamil square wins only on the 8 straight lines of a 3×3 grid. `PRODUCT.md` and `DESIGN.md` define the product intent and design system — read them before UI/visual work.

## Architecture

Three layers, strictly ordered: pure game logic → reactive store → components.

- `src/lib/game/` — **pure, framework-free logic.** Board topology is 9 points: indices 0–7 walk the outer ring clockwise, 8 is the center. Both variants share one movement graph (ring neighbors + center, `board.ts`); only the win lines (`mills(variant)`) differ. `rules.ts` has immutable state transitions (`place`/`move` return a new `GameState` or `null` when illegal). This is the only layer with unit tests.
- `src/lib/store.svelte.ts` — singleton `game` instance of a class using Svelte 5 runes (`$state`, `$derived.by`). Bridges rules to UI: tracks 6 `Stone` objects (hand slot vs. board point), drag/tap-tap selection, legal-target highlighting, and persists the chosen variant to `localStorage`. `drop()` returning `false` means "illegal — bounce the stone back".
- `src/lib/geometry.ts` — all positions live in an abstract 100×150 portrait viewBox (`VIEW`); `pointPos(i, variant)` maps point indices to circle or grid coordinates. Components render in these units, never pixels.
- `src/lib/components/` — `App.svelte` (layout + turn strips; Player 2's strip is rotated 180° to face them across the device), `Stage.svelte` (board + drag handling), `Stone.svelte` (spring-animated pieces), `Chrome.svelte` (restart/variant popups), `WinBanner.svelte`.

Theming: `App.svelte` sets `data-variant` on `<main>`; CSS custom properties in `src/app.css` swap the entire palette (Roman stone vs. Tamil red-oxide). The two themes never mix.

## Conventions that matter

- Svelte 5 runes syntax throughout (`$state`, `$derived`, `onclick=` — not `on:click`).
- Motion is spring-based (tuning in `src/lib/motion.ts`) and must respect `prefers-reduced-motion` (springs snap, CSS falls back to fades).
- Teach through the board, not text: legal moves highlight, illegal drops bounce back. Every interaction needs a tap-tap fallback alongside drag.
- Accessibility floors from PRODUCT.md: WCAG AA contrast, player identity by shape + color (never color alone), touch targets ≥ 44px.
