{#if player}
	<div class="game-over" class:won>
		{#if won}
			<h1>You have guided {player.name} to victory. {level.name} complete!</h1>
		{:else}
			<h1>Game over.</h1>
		{/if}
		<h2>Final score: {score}</h2>
		<p>Press enter to restart.</p>
	</div>
{/if}

<script>
	export let score
	export let player
	export let won
	export let level
</script>

<style lang="scss">
	.game-over {
		position: absolute;
		width: 100%;
		height: 100%;
		text-align: center;
		z-index: 10;
		padding-top: 150px;
		background: rgba(50, 0, 0, 0.5);

		&.won {
			background: rgba(0, 50, 0, 0.5);
		}
	}

	h1 {
		margin-top: 25x;
		color: #fff;
		font-size: 50px;
		font-weight: 100;
	}

	h2 {
		color: #fff;
		font-size: 30px;
	}

	p {
		color: #eee;
	}
</style>
