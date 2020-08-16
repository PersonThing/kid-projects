<!-- Josh demands a healing animation -->

<div class="health-bar">
	<div class="filled" style="width: {displayPercent}%; background-color: {color}" />
	<div class="text">{displayHealth} {health > 0 ? `(${displayPercent}%)` : 'I am dead.'}</div>
</div>

<script>
	export let percent = 100
	export let health = 100
	export let maxHealth = 100

	$: displayHealth = health > 0 ? Math.round(health) : 0
	$: percent = Math.round((health / maxHealth) * 100, 2)
	$: displayPercent = percent > 0 ? percent : 0
	$: color = percent > 75 ? 'rgba(24, 197, 33, 0.5)' : percent > 25 ? 'rgba(245, 189, 36, 0.5)' : 'rgba(223, 22, 22, 0.5)'
</script>

<style>
	.health-bar {
		height: 18px;
		background: rgba(0, 0, 0, 0.5);
		position: relative;
		border-radius: 5px;
		overflow: hidden;
		min-width: 75px;
	}

	.filled {
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.text {
		position: absolute;
		width: 100%;
		height: 100%;
		text-align: center;
		color: #ccc;
		font-size: 12px;
	}
</style>
