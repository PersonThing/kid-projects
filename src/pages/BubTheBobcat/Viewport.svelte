<div class="viewport">
	{#if player != null}
		<div style="position: absolute; left: {xOffset - player.position.x}px; bottom: 0;">
			<slot />
		</div>
	{/if}
</div>

<script>
	export let player = null
	export let xOffset = 0
</script>

<style>
	.viewport {
		flex-grow: 1;
		background: rgb(135, 206, 235);
		position: relative;
	}
</style>
