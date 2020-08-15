<div class="player" style="left: {x}px; bottom: {y}px;">
	<HealthBar {health} {maxHealth} />
	{#if graphic != null}
		<img
			class="graphic"
			src={graphic.png}
			alt={name}
			style="width: {graphic.width}px; height: {graphic.height}px; transform: scaleX({direction}) rotate({rotate}deg);" />
	{/if}
</div>

<script>
	import artStore from '../../stores/art-store'
	import HealthBar from './HealthBar.svelte'

	export let name
	export let maxHealth
	export let graphicStill

	export let vx = 0
	export let vy = 0
	export let y = 0
	export let x = 0

	export let health

	$: graphic = graphicStill != null ? $artStore[graphicStill] : null

	export let spinning = false

	let direction = 1
	$: if (vx != 0) direction = vx > 0 ? 1 : -1

	$: rotate = spinning ? spinningRotation : -1 * (5 + (vy > 0 ? vy * 3 : vy * 1.5))

	let spinningRotation = 0
	let spinTimeout = null
	$: if (spinning) {
		spinTimeout = setTimeout(() => {
			spinningRotation += 30
		}, 25)
	} else {
		clearTimeout(spinTimeout)
	}
</script>

<style>
	.player {
		position: absolute;
	}

	.graphic {
		margin-top: 10px;
		margin: -7px;
	}
</style>
