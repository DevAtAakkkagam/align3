<script lang="ts">
  import { fade } from 'svelte/transition';
  import { game } from '../store.svelte';
  import { pointPos, RING_R, VIEW } from '../geometry';
  import { POINTS } from '../game/board';
  import BoardLines from './BoardLines.svelte';
  import Stone from './Stone.svelte';

  const targets = $derived(new Set(game.targets));

  /** Active (dragged/selected) stone renders last = on top. */
  const ordered = $derived(
    [...game.stones].sort(
      (a, b) =>
        Number(a.id === game.activeStone) - Number(b.id === game.activeStone),
    ),
  );

  const winPath = $derived.by(() => {
    const line = game.state.winLine;
    if (!line) return null;
    const [a, b, c] = line.map((i) => pointPos(i, game.variant));
    // A rim-arc win on the wheel follows the rim, not a chord. Arc mills are
    // stored in ring order, so trace two 45° clockwise segments a → b → c.
    if (game.variant === 'roman' && !line.includes(8)) {
      const r = RING_R;
      return `M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y} A ${r} ${r} 0 0 1 ${c.x} ${c.y}`;
    }
    return `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`;
  });
</script>

<svg
  viewBox="0 0 {VIEW.w} {VIEW.h}"
  preserveAspectRatio="xMidYMid meet"
  aria-label="align3 board"
>
  <defs>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045 0.07" numOctaves="2" seed="7" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
    </filter>
  </defs>

  {#key game.variant}
    <g transition:fade={{ duration: 350 }}>
      <BoardLines variant={game.variant} />
    </g>
  {/key}

  {#each POINTS as i (i)}
    {@const p = pointPos(i, game.variant)}
    <g class="point" style="transform: translate({p.x}px, {p.y}px)">
      <circle r="1.6" class="dimple" class:glow={targets.has(i)} />
      {#if targets.has(i)}
        <circle r="3.4" class="halo" />
      {/if}
      <circle
        r="6"
        fill="transparent"
        role="button"
        tabindex="-1"
        aria-label="board point {i}"
        onclick={() => game.tapPoint(i)}
      />
    </g>
  {/each}

  {#if winPath}
    <path d={winPath} class="win-line" pathLength="1" />
  {/if}

  {#each ordered as stone (stone.id)}
    <Stone {stone} />
  {/each}
</svg>

<style>
  svg {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  .point {
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .dimple {
    fill: var(--dimple);
    transition: fill 0.2s;
  }
  .dimple.glow {
    fill: var(--glow);
  }

  .halo {
    fill: none;
    stroke: var(--glow);
    stroke-width: 0.5;
    opacity: 0.85;
    animation: breathe 1.3s ease-in-out infinite;
  }

  @keyframes breathe {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.85;
    }
    50% {
      transform: scale(1.22);
      opacity: 0.45;
    }
  }

  .win-line {
    fill: none;
    stroke: var(--glow);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    animation: draw 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .point {
      transition: none;
    }
    .halo {
      animation: none;
    }
    .win-line {
      animation: none;
    }
  }
</style>
