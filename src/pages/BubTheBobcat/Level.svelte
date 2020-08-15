<canvas bind:this={canvas} {width} {height} />

<script>
	// import blockStore from '../../stores/block-store'
	export let width = 0
	export let height = 0
	export let blocks = []

	// preload all graphics
	// import artStore from '../../stores/art-store'
	const imageCache = {}
	// for (let name in $artStore) {
	// 	const art = $artStore[name]
	// 	const drawing = new Image()
	// 	drawing.src = art.png
	// 	imageCache[art.png] = drawing
	// }

	let canvas
	let context
	let drawnBlocks = []

	$: if (canvas != null) context = canvas.getContext('2d')
	$: if (blocks != null && width != null && height != null && context != null) {
		// erase any blocks that are drawn that aren't in the new array
		// const toErase = drawnBlocks.filter(db => !blocks.some(b => db.x == b.x && db.y == b.y && db.png == b.png))
		// const toDraw = blocks.filter(b => !drawnBlocks.some(db => db.x == b.x && db.y == b.y && db.png == b.png))
		// toErase.forEach(b => context.clearRect(b.x, b.y, b.width, b.height))
		// toDraw.forEach(b => {
		context.clearRect(0, 0, width, height)

		blocks.forEach(b => {
			let drawing = imageCache[b.png]
			if (drawing == null) {
				drawing = new Image()
				drawing.src = b.png
				imageCache[b.png] = drawing
			}
			setTimeout(() => {
				context.drawImage(drawing, b.x, height - b.y - b.height)
			}, 50)
		})

		// drawnBlocks = JSON.parse(JSON.stringify(blocks))
	}
</script>
