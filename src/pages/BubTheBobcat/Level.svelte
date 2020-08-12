<!-- static elements (blocks, etc) -->
<canvas bind:this={staticCanvas} {width} {height} style="transform: scaleY(-1); position: absolute; bottom: 0px; left: 0px;" />

<script>
	import { doObjectsIntersect } from './spatial-functions'
	import { onMount } from 'svelte'

	export let width = 0
	export let height = 0
	export let blocks = []

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
