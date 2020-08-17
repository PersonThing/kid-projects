<canvas bind:this={canvas} {width} {height} />

<script>
	import { createEventDispatcher } from 'svelte'
	import blockStore from '../../stores/block-store'
	import enemyStore from '../../stores/enemy-store'
	import artStore from '../../stores/art-store'

	export let width = 0
	export let height = 0
	export let blocks = []
	export let enemies = null
	export let playing = false
	const artScale = 2

	const dispatch = createEventDispatcher()
	const imageCache = {}

	let canvas
	let context

	$: if (canvas != null) context = canvas.getContext('2d')
	$: if (blocks != null && width != null && height != null && context != null) {
		context.clearRect(0, 0, width, height)
		blocks.forEach(b => drawOnCanvas($blockStore[b.name].graphic, b.x, b.y))
		if (enemies != null) {
			enemies.forEach(e => drawOnCanvas($enemyStore[e.name].graphicStill, e.x, e.y))
		}
		dispatch('draw', canvas)
	}

	function drawOnCanvas(artName, x, y) {
		let art = $artStore[artName]
		let src = art.png
		let drawing = imageCache[artName]

		const drawThisImage = () => {
			const draw = () => context.drawImage(drawing, x, height - y - art.height * artScale)
			if (playing) setTimeout(draw, 100)
			else draw()
		}

		if (drawing == null) {
			drawing = new Image()
			drawing.src = src
			imageCache[artName] = drawing
		}

		if (drawing.complete) {
			drawThisImage()
		} else {
			const oldOnload = drawing.onload
			drawing.onload = () => {
				drawThisImage()
				oldOnload()
			}
		}
	}
</script>
