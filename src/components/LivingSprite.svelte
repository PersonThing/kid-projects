<div class="player" style="left: {x}px; bottom: {y}px;">
	{#if !hideHealth}
		<HealthBar {health} {maxHealth} />
	{/if}
	{#if graphic != null}
		<img
			class="graphic drop-shadow"
			src={graphic.png}
			alt={name}
			class:dead={health <= 0}
			style="width: {graphic.width * artScale}px; height: {graphic.height * artScale}px; transform: scaleX({direction}) rotate({rotate}deg);" />
	{/if}
</div>

<script>
	import artStore from '../stores/art-store'
	import HealthBar from './HealthBar.svelte'

	const artScale = 2

	export let name
	export let maxHealth
	export let graphicStill
	export let graphicSpinning
	export let motionGraphics = []
	export let framesPerGraphic = 5
	export let hideHealth = false

	export let vx = 0
	export let vy = 0
	export let y = 0
	export let x = 0
	export let health
	export let frame
	export let spinDegreesPerFrame = 5

	let motionGraphicIndex = 0
	let motionGraphicDelta = 1

	$: usableMotionGraphics = motionGraphics.filter(g => g != null)
	$: motionGraphic = usableMotionGraphics[motionGraphicIndex]

	$: if (frame % framesPerGraphic === 0) {
		// change the graphic every x frames
		if (usableMotionGraphics.length > 1) {
			motionGraphicIndex = Math.max(motionGraphicIndex + motionGraphicDelta, 0)
			if (motionGraphicIndex >= usableMotionGraphics.length - 1 || motionGraphicIndex == 0) motionGraphicDelta = motionGraphicDelta * -1
		} else {
			motionGraphicIndex = 0
		}
	}

	$: graphic =
		spinning && graphicSpinning != null
			? $artStore[graphicSpinning]
			: vx != 0 && motionGraphic != null
			? $artStore[motionGraphic]
			: graphicStill != null
			? $artStore[graphicStill]
			: null

	export let spinning = false

	let direction = 1
	$: if (vx != 0) direction = vx > 0 ? 1 : -1

	$: rotate = spinning ? frame * (spinDegreesPerFrame || 15) : -1 * (vy > 0 ? vy * 3 : vy * 1.5)
</script>

<style>
	.player {
		position: absolute;
	}
	.dead {
		filter: none;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
	}
</style>
