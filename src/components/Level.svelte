<canvas bind:this={canvas} {width} {height} />

<script>
	import { createEventDispatcher } from 'svelte'
	import project from '../stores/active-project-store'

	export let width = 0
	export let height = 0
	export let blocks = []
	export let enemies = null
	export let playing = false

	const dispatch = createEventDispatcher()
	const imageCache = {}

	let canvas
	let context

	$: if (canvas != null) {
		context = canvas.getContext('2d')
	}
	$: if (blocks != null && width != null && height != null && context != null) {
		context.clearRect(0, 0, width, height)
		context.imageSmoothingEnabled = false
		blocks.forEach(b => drawOnCanvas($project.blocks[b.name].graphic, b.x, b.y))
		if (enemies != null) {
			enemies.forEach(e => drawOnCanvas($project.enemies[e.name].graphics.still, e.x, e.y))
		}
		dispatch('draw', canvas)
	}

	function drawOnCanvas(artName, x, y) {
		let art = $project.art[artName]
		let src = art.png
		let image = imageCache[artName]

		const drawThisImage = () => {
			const draw = () => {
				const dx = x
				const dy = height - y - art.height
				// if animated, only draw first frame
				const dw = art.animated ? art.frameWidth : art.width
				const dh = art.height
				context.drawImage(image, 0, 0, dw, dh, dx, dy, dw, dh)
			}
			if (playing) setTimeout(draw, 100)
			else draw()
		}

		if (image == null) {
			image = new Image()
			image.src = src
			imageCache[artName] = image
		}

		if (image.complete) {
			drawThisImage()
		} else {
			const oldOnload = image.onload
			image.onload = () => {
				if (typeof oldOnload === 'function') oldOnload()
				drawThisImage()
			}
		}
	}
</script>

<style>
	canvas {
		display: block;
	}
</style>
