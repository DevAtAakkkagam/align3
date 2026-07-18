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
</script>

<main data-variant={game.variant}>
  <div class="strip flip" class:active={playing && game.turn === 1}>
    <svg viewBox="-6 -6 12 12" class="glyph" aria-hidden="true">
      <rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="1.6" fill="var(--p2-stone)" transform="rotate(4)" />
      <rect x="-2.7" y="-2.7" width="5.4" height="5.4" rx="0.9" fill="none" stroke="var(--p2-rim)" stroke-width="0.7" transform="rotate(4)" />
    </svg>
    <span class="who">Player 2</span>
    {#if playing && game.turn === 1}
      <span class="hint">{hint}</span>
    {/if}
  </div>

  <div class="stage">
    <Stage />
  </div>

  <div class="strip" class:active={playing && game.turn === 0}>
    <svg viewBox="-6 -6 12 12" class="glyph" aria-hidden="true">
      <circle r="5" fill="var(--p1-stone)" />
      <circle r="3.1" fill="none" stroke="var(--p1-rim)" stroke-width="0.7" />
    </svg>
    <span class="who">Player 1</span>
    {#if playing && game.turn === 0}
      <span class="hint">{hint}</span>
    {/if}
  </div>

  <Chrome />

  {#if game.state.phase === 'won'}
    <WinBanner />
  {/if}
</main>

<style>
  main {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--floor);
    color: var(--ink);
    transition: background 0.4s ease;
  }

  .strip {
    height: 52px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
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
    width: 15px;
    height: 15px;
    opacity: 0.55;
    transition: opacity 0.25s;
  }
  .active .glyph {
    opacity: 1;
  }

  .who {
    font-weight: 800;
    font-size: 0.88rem;
    letter-spacing: 0.02em;
  }

  .hint {
    font-size: 0.85rem;
  }
  .hint::before {
    content: '·';
    margin-right: 9px;
    opacity: 0.5;
  }

  .stage {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
  }

  @media (orientation: landscape) {
    main {
      flex-direction: row;
    }
    .strip {
      height: auto;
      width: 64px;
      flex-direction: column;
    }
    .strip.flip {
      transform: none;
    }
    .hint {
      writing-mode: vertical-rl;
      max-height: 45vh;
    }
    .hint::before {
      margin-right: 0;
    }
  }
</style>
