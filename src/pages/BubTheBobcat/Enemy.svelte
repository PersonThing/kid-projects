<div class="enemy" style="left: {position.x - size / 2}px; bottom: {position.y - 15}px;">
	<HealthBar {health} {maxHealth} />
	<svg
		class="graphic"
		style="left: 15px; width: {size}px; height: {size * 0.75}px; transform: scaleX({-1 * direction}) rotate({-4 + (momentum.y > 0 ? momentum.y * 3 : momentum.y * 1.5)}deg);
		opacity: {health <= 0 ? 0.2 : 1.0}"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 10 1024 749"
		version="1.1"
		xml:space="preserve">
		<path d={path1} fill={bodyColor} />
		<path d={path2} fill={eyeColor} />
	</svg>
</div>

<script>
	import HealthBar from './HealthBar.svelte'
	export let momentum = {
		x: 0,
		y: 0,
	}
	export let position = {
		x: 0,
		y: 0,
	}
	export let isBoss = false
	export let size = 75
	export let direction = 1
	export let health = 100
	export let maxHealth = 100
	export let gettingHit = false
	$: bodyColor = health <= 0 ? '#333333' : gettingHit ? '#ffffff' : isBoss ? '#000' : '#79cf00'
	$: eyeColor = health <= 0 ? '#000000' : gettingHit ? '#0000ff' : isBoss ? 'red' : '#cf7900'
	const path1 = `M560,128H528a15.99954,15.99954,0,0,0-16,16v80H480V176a15.99954,15.99954,0,0,0-16-16H416V96h48a16.00079,16.00079,0,0,0,16-16V48a15.99954,15.99954,0,0,0-16-16H432a15.99954,15.99954,0,0,0-16,16V64H368a15.99954,15.99954,0,0,0-16,16v48H224V80a15.99954,15.99954,0,0,0-16-16H160V48a15.99954,15.99954,0,0,0-16-16H112A15.99954,15.99954,0,0,0,96,48V80a16.00079,16.00079,0,0,0,16,16h48v64H112a15.99954,15.99954,0,0,0-16,16v48H64V144a15.99954,15.99954,0,0,0-16-16H16A15.99954,15.99954,0,0,0,0,144V272a16.00079,16.00079,0,0,0,16,16H64v80a16.00079,16.00079,0,0,0,16,16h48v80a16.00079,16.00079,0,0,0,16,16h96a16.00079,16.00079,0,0,0,16-16V432a15.99954,15.99954,0,0,0-16-16H192V384H384v32H336a15.99954,15.99954,0,0,0-16,16v32a16.00079,16.00079,0,0,0,16,16h96a16.00079,16.00079,0,0,0,16-16V384h48a16.00079,16.00079,0,0,0,16-16V288h48a16.00079,16.00079,0,0,0,16-16V144A15.99954,15.99954,0,0,0,560,128ZM224,320H160V224h64Zm192,0H352V224h64Z`
	const path2 = `M160,320h64V224H160Zm192-96v96h64V224Z`
</script>

<style>
	.enemy {
		position: absolute;
		text-align: center;
	}

	.graphic {
		margin-top: 10px;
		position: relative;
	}
</style>
