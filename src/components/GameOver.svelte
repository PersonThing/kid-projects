{#if player}
	<div class="game-over" class:won>
		{#if won}
			<h1>You have guided {player.name} to victory. {level.name} complete!</h1>
		{:else}
			<h1>{player.name} is dead now. You really let him down.</h1>
		{/if}
		<h1>Final score: {score}</h1>
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

	p {
		color: #eee;
	}
</style>
