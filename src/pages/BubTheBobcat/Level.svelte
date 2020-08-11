<div style="position: absolute; left: {-x}px; bottom: {-y};">
	{#each blocks as b}
		<Block {...b} />
	{/each}
	<slot />
</div>

<!-- <h1 style="position: absolute; top: 200px;">{x}, {y}</h1> -->

<script>
	import { doObjectsIntersect } from './spatial-functions'
	import Block from './Block.svelte'

	export let blocks = []
	export let x = 0
	export let y = 0
</script>
