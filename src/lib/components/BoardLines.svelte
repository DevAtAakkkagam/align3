<script lang="ts">
  import type { Variant } from '../game/types';
  import { pointPos, VIEW } from '../geometry';

  let { variant }: { variant: Variant } = $props();

  const p = (i: number) => pointPos(i, variant);
  const seg = (a: number, b: number) =>
    `M ${p(a).x} ${p(a).y} L ${p(b).x} ${p(b).y}`;
</script>

<g class="lines" filter="url(#rough)">
  {#if variant === 'roman'}
    <circle cx={VIEW.cx} cy={VIEW.cy} r={30} class="stroke" fill="none" />
    <path d={seg(0, 4)} class="stroke" />
    <path d={seg(1, 5)} class="stroke" />
    <path d={seg(2, 6)} class="stroke" />
    <path d={seg(3, 7)} class="stroke" />
  {:else}
    <path
      d="{seg(0, 2)} {seg(2, 4)} {seg(4, 6)} {seg(6, 0)}"
      class="stroke"
    />
    <path d={seg(1, 5)} class="stroke" />
    <path d={seg(7, 3)} class="stroke" />
    <path d={seg(0, 4)} class="stroke" />
    <path d={seg(2, 6)} class="stroke" />
  {/if}
</g>

<style>
  .stroke {
    stroke: var(--line);
    stroke-width: 1.1;
    stroke-linecap: round;
    fill: none;
  }
</style>
