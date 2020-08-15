<canvas bind:this={canvas} {width} {height} />

<script>
	export let width = 0
	export let height = 0
	export let blocks = []

	let canvas
	let context
	const imageCache = {}
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
			if (b.png) {
				let drawing = imageCache[b.png]
				if (drawing == null) {
					drawing = new Image()
					drawing.onload = () => context.drawImage(drawing, b.x, height - b.y)
					drawing.src = b.png
					imageCache[b.png] = drawing
				} else if (drawing.complete) {
					context.drawImage(drawing, b.x, height - b.y)
				} else {
					drawing.onload = () => {
						context.drawImage(drawing, b.x, height - b.y)
					}
				}
			} else {
				// temporarily supporting old data format with colors instead of pngs
				context.beginPath()
				context.rect(b.x, height - b.y - b.height, b.width, b.height)
				context.fillStyle = b.color
				context.fill()
				// draw a line on top
				context.beginPath()
				context.moveTo(b.x, height - b.y - b.height)
				context.lineTo(b.x + b.width, height - b.y - b.height)
				context.strokeStyle = 'black'
				context.stroke()
			}
		})

		// drawnBlocks = JSON.parse(JSON.stringify(blocks))
	}
</script>
