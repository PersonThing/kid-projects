<div style="position: absolute; left: {-x}px; bottom: {-y}px; height: {height}px;">
	<!-- static elements (blocks, etc) -->
	<canvas bind:this={staticCanvas} {width} {height} style="transform: scaleY(-1);" />

	<!-- <svg {width} {height} style="transform: scaleY(-1)">
		{#each blocks as b}
			<Block {...b} />
		{/each}
	</svg> -->

	<slot />
</div>

<script>
	import { doObjectsIntersect } from './spatial-functions'
	import Block from './Block.svelte'
	import { onMount } from 'svelte'

	export let width = 0
	export let height = 0
	export let blocks = []
	export let x = 0
	export let y = 0

	let staticCanvas
	onMount(() => {
		// render blocks to static canvas
		let ctx = staticCanvas.getContext('2d')

		// todo allow drawing only visibleBlocks / adding incrementally
		blocks.forEach(b => {
			ctx.beginPath()
			ctx.rect(b.x, b.y, b.width, b.height)
			ctx.fillStyle = b.color
			ctx.fill()

			// draw a line on top
			if (b.interactive) {
				ctx.beginPath()
				ctx.moveTo(b.x, b.y + b.height)
				ctx.lineTo(b.x + b.width, b.y + b.height)
				ctx.strokeStyle = 'black'
				ctx.stroke()
			}
		})
	})
</script>
