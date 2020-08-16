<canvas bind:this={canvas} {width} {height} />

<script>
	import blockStore from '../../stores/block-store'
	import artStore from '../../stores/art-store'

	export let width = 0
	export let height = 0
	export let blocks = []

	const imageCache = {}

	let canvas
	let context

	$: if (canvas != null) context = canvas.getContext('2d')
	$: if (blocks != null && width != null && height != null && context != null) {
		context.clearRect(0, 0, width, height)
		blocks.forEach(b => {
			let drawing = imageCache[b.name]
			const drawThisBlock = () => context.drawImage(drawing, b.x, height - b.y - b.height)
			if (drawing == null) {
				drawing = new Image()
				drawing.src = $artStore[$blockStore[b.name].graphic].png
				imageCache[b.name] = drawing
			}

			if (drawing.complete) {
				drawThisBlock()
			} else {
				const oldOnLoad = drawing.onload
				drawing.onload = () => {
					oldOnLoad()
					drawThisBlock()
				}
			}
		})
	}
</script>
