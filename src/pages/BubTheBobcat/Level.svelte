<div style="position: absolute; left: {-x}px; bottom: {-y}px;">
	<svg {width} {height} style="transform: scaleY(-1)">
		{#each blocks as b}
			<Block {...b} />
		{/each}
	</svg>
	<slot />
</div>

<!-- <h1 style="position: absolute; top: 200px;">{x}, {y}</h1> -->

<script>
	import { doObjectsIntersect } from './spatial-functions'
	import Block from './Block.svelte'

	export let width = 0
	export let height = 0
	export let blocks = []
	export let x = 0
	export let y = 0
</script>
