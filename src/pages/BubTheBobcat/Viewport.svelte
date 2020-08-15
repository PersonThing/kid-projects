<div class="viewport" style="width: {width}px; height: {height}px; background: {background}">
	<div style="position: absolute; left: {-x}px; bottom: {-y}px; height: {height}px;">
		<slot />
	</div>
</div>

<script>
	export let x = 0
	export let y = 0
	export let width = 0
	export let height = 0
	export let background = null
</script>

<style>
	.viewport {
		position: relative;
		overflow: hidden;
	}
</style>
