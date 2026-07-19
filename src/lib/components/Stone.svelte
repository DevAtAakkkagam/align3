<script lang="ts">
  import { Spring } from 'svelte/motion';
  import { game, type Stone } from '../store.svelte';
  import { handPos, nearestPoint, pointPos } from '../geometry';
  import {
    prefersReducedMotion,
    SPRING_FOLLOW,
    SPRING_SETTLE,
    SPRING_SHAKE,
  } from '../motion';

  let { stone }: { stone: Stone } = $props();

  const anchor = $derived(
    stone.at !== null
      ? pointPos(stone.at, game.variant)
      : handPos(stone.player, stone.slot),
  );

  const pos = new Spring(
    stone.at !== null
      ? pointPos(stone.at, game.variant)
      : handPos(stone.player, stone.slot),
    SPRING_SETTLE,
  );

  $effect(() => {
    const a = anchor;
    if (game.dragging !== stone.id) {
      if (prefersReducedMotion()) pos.set(a, { instant: true });
      else pos.target = a;
    }
  });

  const grabbable = $derived(game.canGrab(stone.id));
  const selected = $derived(game.selected === stone.id);
  const lifted = $derived(game.dragging === stone.id);
  const wrongTurn = $derived(
    game.state.phase !== 'won' && stone.player !== game.turn,
  );

  /** Snap radius when releasing a drag, in stage units. */
  const SNAP = 10;
  let moved = false;
  let grabOffset = { x: 0, y: 0 };
  let pointerId = -1;
  // Grabbing reorders the stone to the top of the SVG; a DOM move drops
  // element-level pointer capture, so the drag listens on the window instead.
  let svg: SVGSVGElement | null = null;

  function toStage(e: PointerEvent): { x: number; y: number } {
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      svg!.getScreenCTM()!.inverse(),
    );
    return { x: pt.x, y: pt.y };
  }

  let bodyEl: SVGGElement;
  let shakeTimer: ReturnType<typeof setTimeout>;

  /** Wrong-turn grab: the stone shakes its head, never leaving its point. */
  function refuse() {
    game.denyGrab();
    if (prefersReducedMotion()) {
      bodyEl.animate({ opacity: [1, 0.45, 1] }, { duration: 240, easing: 'ease-out' });
      return;
    }
    clearTimeout(shakeTimer);
    pos.stiffness = SPRING_SHAKE.stiffness;
    pos.damping = SPRING_SHAKE.damping;
    pos.set({ x: anchor.x - 1.7, y: anchor.y }, { instant: true });
    pos.target = anchor;
    shakeTimer = setTimeout(() => {
      if (game.dragging !== stone.id) {
        pos.stiffness = SPRING_SETTLE.stiffness;
        pos.damping = SPRING_SETTLE.damping;
      }
    }, 500);
  }

  function down(e: PointerEvent) {
    if (pointerId !== -1) return;
    if (!grabbable) {
      if (wrongTurn) refuse();
      return;
    }
    svg = (e.currentTarget as SVGGraphicsElement).ownerSVGElement;
    pointerId = e.pointerId;
    const p = toStage(e);
    grabOffset = { x: pos.current.x - p.x, y: pos.current.y - p.y };
    moved = false;
    game.dragging = stone.id;
    pos.stiffness = SPRING_FOLLOW.stiffness;
    pos.damping = SPRING_FOLLOW.damping;
    window.addEventListener('pointermove', moveHandler);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  function moveHandler(e: PointerEvent) {
    if (e.pointerId !== pointerId) return;
    const p = toStage(e);
    const target = { x: p.x + grabOffset.x, y: p.y + grabOffset.y };
    if (Math.hypot(target.x - anchor.x, target.y - anchor.y) > 1.5) moved = true;
    if (prefersReducedMotion()) pos.set(target, { instant: true });
    else pos.target = target;
  }

  function up(e: PointerEvent) {
    if (e.pointerId !== pointerId) return;
    pointerId = -1;
    window.removeEventListener('pointermove', moveHandler);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    game.dragging = null;
    pos.stiffness = SPRING_SETTLE.stiffness;
    pos.damping = SPRING_SETTLE.damping;

    if (!moved) {
      game.toggleSelect(stone.id);
      pos.target = anchor;
      return;
    }
    const p = toStage(e);
    const drop = nearestPoint(p.x + grabOffset.x, p.y + grabOffset.y, game.variant, SNAP);
    if (drop === null || !game.drop(stone.id, drop)) {
      // Illegal: spring home (the bounce-back IS the error message).
      pos.target = anchor;
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<g
  class="stone p{stone.player}"
  class:grabbable
  class:lifted
  class:selected
  transform="translate({pos.current.x} {pos.current.y})"
  onpointerdown={down}
>
  {#if lifted}
    <ellipse class="shadow" cx="0.6" cy="1.6" rx="5.6" ry="4.6" />
  {/if}
  <g class="body" bind:this={bodyEl}>
    {#if stone.player === 0}
      <circle r="5" class="fill" />
      <circle r="3.1" class="rim" fill="none" />
    {:else}
      <rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="1.6" class="fill" transform="rotate(4)" />
      <rect x="-2.7" y="-2.7" width="5.4" height="5.4" rx="0.9" class="rim" fill="none" transform="rotate(4)" />
    {/if}
  </g>
  <!-- generous invisible touch target -->
  <circle r="8" fill="transparent" />
</g>

<style>
  .stone {
    cursor: default;
    touch-action: none;
  }
  .stone.grabbable {
    cursor: grab;
  }
  .stone.lifted {
    cursor: grabbing;
  }

  .p0 .fill {
    fill: var(--p1-stone);
  }
  .p0 .rim {
    stroke: var(--p1-rim);
    stroke-width: 0.7;
    opacity: 0.75;
  }
  .p1 .fill {
    fill: var(--p2-stone);
  }
  .p1 .rim {
    stroke: var(--p2-rim);
    stroke-width: 0.7;
    opacity: 0.8;
  }

  .body {
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lifted .body {
    transform: scale(1.18);
  }
  .selected .body {
    transform: scale(1.12);
  }

  .shadow {
    fill: oklch(0.2 0.02 60 / 0.28);
  }

  @media (prefers-reduced-motion: reduce) {
    .body {
      transition: none;
    }
  }
</style>
