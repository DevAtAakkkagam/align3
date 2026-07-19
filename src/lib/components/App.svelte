<script lang="ts">
  import { game } from '../store.svelte';
  import Stage from './Stage.svelte';
  import Chrome from './Chrome.svelte';
  import WinBanner from './WinBanner.svelte';

  const hint = $derived(
    game.state.phase === 'placement'
      ? 'Place your 3 stones'
      : game.state.phase === 'movement'
        ? 'Slide a stone to a joined point'
        : '',
  );

  const playing = $derived(game.state.phase !== 'won');

  /* Wrong-turn grab: the on-turn strip pulses once to say "their move". */
  let strips: (HTMLDivElement | null)[] = [null, null];
  let announce = $state('');
  let announceTimer: ReturnType<typeof setTimeout>;
  let seenDenials = 0;

  $effect(() => {
    if (game.denied === seenDenials) return;
    seenDenials = game.denied;
    const strip = strips[game.turn];
    if (strip) {
      // remove + reflow + re-add so rapid grabs restart the one-shot animation
      strip.classList.remove('nudged');
      void strip.offsetWidth;
      strip.classList.add('nudged');
    }
    clearTimeout(announceTimer);
    announce = `It's Player ${game.turn + 1}'s turn`;
    announceTimer = setTimeout(() => (announce = ''), 1500);
  });
</script>

<main data-variant={game.variant}>
  <div
    class="strip flip"
    class:active={playing && game.turn === 1}
    bind:this={strips[1]}
  >
    <svg viewBox="-6 -6 12 12" class="glyph" aria-hidden="true">
      <rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="1.6" fill="var(--p2-stone)" transform="rotate(4)" />
      <rect x="-2.7" y="-2.7" width="5.4" height="5.4" rx="0.9" fill="none" stroke="var(--p2-rim)" stroke-width="0.7" transform="rotate(4)" />
    </svg>
    <div class="label">
      <span class="who">Player 2</span>
      {#if playing && game.turn === 1}
        <span class="hint">{hint}</span>
      {/if}
    </div>
  </div>

  <div class="stage">
    <Stage />
  </div>

  <div
    class="strip"
    class:active={playing && game.turn === 0}
    bind:this={strips[0]}
  >
    <svg viewBox="-6 -6 12 12" class="glyph" aria-hidden="true">
      <circle r="5" fill="var(--p1-stone)" />
      <circle r="3.1" fill="none" stroke="var(--p1-rim)" stroke-width="0.7" />
    </svg>
    <div class="label">
      <span class="who">Player 1</span>
      {#if playing && game.turn === 0}
        <span class="hint">{hint}</span>
      {/if}
    </div>
  </div>

  <Chrome />

  <div class="sr-only" aria-live="polite">{announce}</div>

  {#if game.state.phase === 'won'}
    <WinBanner />
  {/if}
</main>

<style>
  main {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--floor);
    background-image: var(--floor-pattern);
    color: var(--ink);
    transition: background-color 0.4s ease;
  }

  /* The floor is a material, not a fill: mineral grain plus worn, darker edges.
     Flat gray noise carried in alpha lifts the dark oxide and dusts the pale stone. */
  main::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(
        130% 96% at 50% 46%,
        transparent 54%,
        oklch(0.18 0.05 45 / 0.16) 100%
      ),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.5 0 0 0 0 0.45 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size:
      100% 100%,
      160px 160px;
    background-repeat: no-repeat, repeat;
  }

  .strip {
    min-height: 58px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding-inline: 16px;
    padding-block: 7px;
    color: var(--ink-dim);
    transition: color 0.25s;
  }

  .strip.flip {
    transform: rotate(180deg);
  }

  .strip.active {
    color: var(--ink);
  }

  .glyph {
    width: 17px;
    height: 17px;
    opacity: 0.55;
    transition: opacity 0.25s;
  }
  .active .glyph {
    opacity: 1;
  }

  /* .nudged is applied via classList (one-shot restart needs a reflow), so
     it never appears in the template: keep it out of Svelte's scoping. */
  .strip:global(.nudged) .glyph {
    animation: bob 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .strip:global(.nudged) .who {
    animation: flare 0.55s ease-out;
  }

  @keyframes bob {
    30% {
      transform: translateY(-3.5px) scale(1.3);
    }
    65% {
      transform: translateY(1px) scale(0.96);
    }
  }

  @keyframes flare {
    30% {
      color: var(--glow);
    }
  }

  .label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .who {
    font-weight: 800;
    font-size: 0.74rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .hint {
    font-size: 1.02rem;
    font-weight: 650;
    color: var(--ink);
    text-wrap: balance;
  }

  .stage {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .strip:global(.nudged) .glyph {
      animation: none;
    }
  }

  /* chrome clearance only where the corner icons can actually collide */
  @media (max-width: 600px) {
    .strip {
      padding-inline: 58px;
    }
  }

  @media (orientation: landscape) {
    main {
      flex-direction: row;
    }
    .strip {
      min-height: 0;
      width: 76px;
      flex-direction: column;
      padding-inline: 0;
      padding-block: 24px;
    }
    .strip.flip {
      transform: none;
    }
    .label {
      flex-direction: row-reverse;
      align-items: center;
      gap: 5px;
    }
    .who,
    .hint {
      writing-mode: vertical-rl;
    }
    .hint {
      max-height: 45vh;
    }
  }

  @media (orientation: landscape) and (max-height: 600px) {
    .strip {
      padding-block: 104px;
    }
  }
</style>
