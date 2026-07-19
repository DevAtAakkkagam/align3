<script lang="ts">
  import { fade } from 'svelte/transition';
  import { game } from '../store.svelte';
  import type { Variant } from '../game/types';

  let open = $state<'none' | 'board' | 'restart'>('none');
  let pending = $state<Variant | null>(null);
  let chromeEl: HTMLDivElement;

  function onOutside(e: PointerEvent) {
    if (open !== 'none' && !chromeEl.contains(e.target as Node)) {
      open = 'none';
      pending = null;
    }
  }

  function clickRestart() {
    if (!game.inProgress) {
      game.reset();
      open = 'none';
      return;
    }
    open = open === 'restart' ? 'none' : 'restart';
  }

  function confirmRestart() {
    game.reset();
    open = 'none';
  }

  function toggleBoard() {
    pending = null;
    open = open === 'board' ? 'none' : 'board';
  }

  function pick(v: Variant) {
    if (v === game.variant) {
      open = 'none';
      return;
    }
    if (game.inProgress && pending !== v) {
      pending = v;
      return;
    }
    game.setVariant(v);
    open = 'none';
    pending = null;
  }
</script>

<svelte:window onpointerdown={onOutside} />

<div class="chrome" bind:this={chromeEl}>
  {#if open === 'restart'}
    <div class="pop" transition:fade={{ duration: 120 }}>
      <span>Start over?</span>
      <button class="mini" onclick={confirmRestart}>Yes</button>
    </div>
  {:else if open === 'board'}
    <div class="pop boards" transition:fade={{ duration: 120 }}>
      <button
        class="board-pick"
        class:current={game.variant === 'roman'}
        onclick={() => pick('roman')}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="14" />
          <path d="M10.1 10.1 L29.9 29.9 M29.9 10.1 L10.1 29.9 M20 6 V34 M6 20 H34" />
        </svg>
        <strong>Roman circle</strong>
        <small>wins along spokes and rim</small>
      </button>
      <button
        class="board-pick"
        class:current={game.variant === 'tamil'}
        onclick={() => pick('tamil')}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="7" y="7" width="26" height="26" />
          <path d="M7 7 L33 33 M33 7 L7 33 M20 7 V33 M7 20 H33" />
        </svg>
        <strong>Tamil square</strong>
        <small>wins on straight lines</small>
      </button>
      {#if pending}
        <div class="note">
          Rules differ — switching restarts the round.
          <button class="mini" onclick={() => pick(pending!)}>Switch</button>
        </div>
      {/if}
    </div>
  {/if}

  <a class="icon" aria-label="Aakkagam Games home" href="https://games.aakkagam.com/">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 11 12 4.5 19.5 11M6.5 9.5V19h11V9.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </a>
  <a class="icon" aria-label="send feedback" href="mailto:admin@aakkagam.com?subject=Feedback%20from%20align3">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v12H4z M4 6l8 7 8-7"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </a>
  <button class="icon" aria-label="restart game" onclick={clickRestart}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 12a7 7 0 1 1-2.05-4.95M17 3v4.2h-4.2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
  <button class="icon" aria-label="switch board" onclick={toggleBoard}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {#if game.variant === 'roman'}
        <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8" />
      {:else}
        <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8" />
      {/if}
    </svg>
  </button>
</div>

<style>
  .chrome {
    position: fixed;
    right: 8px;
    bottom: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .icon {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: var(--ink-dim);
    cursor: pointer;
    padding: 0;
  }
  .icon:hover {
    color: var(--ink);
  }
  .icon svg {
    width: 21px;
    height: 21px;
  }

  .pop {
    position: absolute;
    bottom: 96px;
    right: 0;
    background: var(--chrome-bg);
    border: 1px solid var(--line-soft);
    border-radius: 12px;
    padding: 12px;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    font-size: 0.9rem;
  }

  .boards {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .board-pick {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: auto auto;
    column-gap: 10px;
    align-items: center;
    text-align: left;
    font: inherit;
    color: var(--ink);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 8px 10px;
    cursor: pointer;
    min-height: 44px;
  }
  .board-pick:hover {
    border-color: var(--line-soft);
  }
  .board-pick.current {
    border-color: var(--ink-dim);
  }
  .board-pick svg {
    grid-row: 1 / 3;
    width: 34px;
    height: 34px;
  }
  .board-pick svg :is(circle, rect, path) {
    fill: none;
    stroke: var(--ink-dim);
    stroke-width: 1.6;
  }
  .board-pick strong {
    font-weight: 800;
    font-size: 0.88rem;
  }
  .board-pick small {
    color: var(--ink-dim);
    font-size: 0.76rem;
  }

  .note {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: var(--ink-dim);
    white-space: normal;
    max-width: 210px;
  }

  .mini {
    font: inherit;
    font-weight: 800;
    font-size: 0.82rem;
    color: var(--ink);
    background: transparent;
    border: 1.5px solid var(--ink);
    border-radius: 999px;
    padding: 6px 16px;
    cursor: pointer;
  }
</style>
