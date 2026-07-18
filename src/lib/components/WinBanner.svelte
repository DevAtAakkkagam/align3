<script lang="ts">
  import { fade } from 'svelte/transition';
  import { game } from '../store.svelte';
  import { prefersReducedMotion } from '../motion';

  const winner = $derived(game.state.winner);
  const delay = prefersReducedMotion() ? 0 : 450;
  const dur = prefersReducedMotion() ? 0 : 220;
</script>

<div class="veil" class:flip={winner === 1} transition:fade={{ duration: dur, delay }}>
  <div class="panel">
    <h1>Three in a row!</h1>
    <p>
      <svg viewBox="-6 -6 12 12" class="glyph" aria-hidden="true">
        {#if winner === 0}
          <circle r="5" fill="var(--p1-stone)" />
          <circle r="3.1" fill="none" stroke="var(--p1-rim)" stroke-width="0.7" />
        {:else}
          <rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="1.6" fill="var(--p2-stone)" transform="rotate(4)" />
          <rect x="-2.7" y="-2.7" width="5.4" height="5.4" rx="0.9" fill="none" stroke="var(--p2-rim)" stroke-width="0.7" transform="rotate(4)" />
        {/if}
      </svg>
      Player {winner === 0 ? 1 : 2} takes the round
    </p>
    <button class="again" onclick={() => game.reset()}>Again</button>
  </div>
</div>

<style>
  .veil {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .panel {
    pointer-events: auto;
    background: var(--chrome-bg);
    border: 1px solid var(--line-soft);
    border-radius: 14px;
    padding: 22px 34px 24px;
    text-align: center;
    color: var(--ink);
    animation: thump 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .flip .panel {
    transform: rotate(180deg);
  }

  @keyframes thump {
    from {
      scale: 1.08;
    }
    to {
      scale: 1;
    }
  }

  h1 {
    font-family: var(--serif);
    font-weight: 600;
    font-size: 1.7rem;
    letter-spacing: 0.03em;
    margin: 0 0 10px;
  }

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0 0 18px;
    font-size: 0.95rem;
  }

  .glyph {
    width: 20px;
    height: 20px;
  }

  .again {
    font: inherit;
    font-weight: 800;
    color: var(--ink);
    background: transparent;
    border: 1.5px solid var(--ink);
    border-radius: 999px;
    padding: 10px 30px;
    min-height: 44px;
    cursor: pointer;
  }
  .again:hover {
    background: var(--floor);
  }

  @media (orientation: landscape) {
    .flip .panel {
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      animation: none;
    }
  }
</style>
