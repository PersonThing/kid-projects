<canvas bind:this={canvas} {width} {height} style="position: absolute; bottom: 0px; left: 0px;" />

<script>
	export let width = 0
	export let height = 0
	export let blocks = []

	let canvas

	let drawnBlocks = []

	const imageCache = {}

	$: if (blocks != null && canvas != null) {
		let ctx = canvas.getContext('2d')

		// erase any blocks that are drawn that aren't in the new array
		const toErase = drawnBlocks.filter(db => !blocks.some(b => db.x == b.x && db.y == b.y && db.png == b.png))
		const toDraw = blocks.filter(b => !drawnBlocks.some(db => db.x == b.x && db.y == b.y && db.png == b.png))

		toErase.forEach(b => ctx.clearRect(b.x, b.y, b.width, b.height))

		toDraw.forEach(b => {
			if (b.png) {
				let drawing = imageCache[b.png]
				if (drawing == null) {
					drawing = new Image()
					drawing.src = b.png
					imageCache[b.png] = drawing
					drawing.onload = () => ctx.drawImage(drawing, b.x, b.y)
				} else {
					ctx.drawImage(drawing, b.x, b.y)
				}
			} else {
				// temporarily supporting old data format with colors instead of pngs
				ctx.beginPath()
				ctx.rect(b.x, b.y, b.width, b.height)
				ctx.fillStyle = b.color
				ctx.fill()
				// draw a line on top
				ctx.beginPath()
				ctx.moveTo(b.x, b.y + b.height)
				ctx.lineTo(b.x + b.width, b.y + b.height)
				ctx.strokeStyle = 'black'
				ctx.stroke()
			}
		})

		drawnBlocks = JSON.parse(JSON.stringify(blocks))
	}
</script>
