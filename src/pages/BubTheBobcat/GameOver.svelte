<div class="game-over">
	<h1>Bub is dead now. You really let him down.</h1>
	<h1>Final score: {score}</h1>
	<p>Press any key to restart.</p>
</div>

<script>
	export let score = 0
</script>

<style>
	.game-over {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		text-align: center;
		z-index: 10;
		padding-top: 150px;
	}

	h1 {
		margin-top: 25x;
		color: #fff;
		font-size: 50px;
		font-weight: 100;
	}

	p {
		color: #eee;
	}
</style>
