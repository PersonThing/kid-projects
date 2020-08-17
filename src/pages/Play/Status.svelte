<div>
	<p>Level: {level.name}</p>
	<p>Score: {score}</p>
	<p>Enemies left: {enemyCount}</p>
</div>

<script>
	export let level = {}
	export let score = 0
	export let enemyCount = 0
</script>

<style>
	div {
		position: absolute;
		font-size: 14px;
		top: 10px;
		left: 10px;
		color: #333;
	}
	p {
		margin: 0;
		padding: 0;
	}
</style>
