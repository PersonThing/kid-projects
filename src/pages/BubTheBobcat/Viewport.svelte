<div class="viewport" style="width: {width}px; height: {height}px;">
	<slot />
</div>

<script>
	export let width = 0
	export let height = 0
</script>

<style>
	.viewport {
		background: rgb(135, 206, 235);
		position: relative;
	}
</style>
