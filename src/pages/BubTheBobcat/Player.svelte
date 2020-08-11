<div class="player" style="left: {x}px; bottom: {y - 5}px;">
	<HealthBar {health} {maxHealth} />
	<img
		class="graphic"
		src="https://i.imgur.com/g1jV9bN.png"
		alt="Bub"
		style="width: {width}px; height: {height}px; transform: scaleX({scaleX}) rotate({rotate}deg);" />
</div>

<script>
	import HealthBar from './HealthBar.svelte'
	export let momentum = {
		x: 0,
		y: 0,
	}
	export let y = 0
	export let x = 0
	export let width = 150
	export let height = 100
	export let direction = 1
	export let health = 100
	export let maxHealth = 100

	export let spinning = false

	$: scaleX = direction
	$: rotate = spinning ? spinningRotation : -1 * (5 + (momentum.y > 0 ? momentum.y * 3 : momentum.y * 1.5))

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
