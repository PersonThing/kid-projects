<div class="player" style="left: {x}px; bottom: {y}px;">
	<HealthBar {health} {maxHealth} />
	{#if graphic != null}
		<img
			class="graphic"
			src={graphic.png}
			alt={name}
			style="width: {graphic.width * artScale}px; height: {graphic.height * artScale}px; transform: scaleX({direction}) rotate({rotate}deg);" />
	{/if}
</div>

<script>
	import artStore from '../../stores/art-store'
	import HealthBar from './HealthBar.svelte'

	const artScale = 2

	export let name
	export let maxHealth
	export let graphicStill
	export let graphicSpinning

	export let vx = 0
	export let vy = 0
	export let y = 0
	export let x = 0

	export let health

	$: graphic = spinning && graphicSpinning != null ? $artStore[graphicSpinning] : graphicStill != null ? $artStore[graphicStill] : null

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
</style>
