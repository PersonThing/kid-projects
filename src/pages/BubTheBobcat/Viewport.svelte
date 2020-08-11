<div class="viewport" style="width: {width}px; height: {height}px; background-color: {backgroundColor}">
	<slot />
</div>

<script>
	export let width = 0
	export let height = 0
	export let backgroundColor = null
</script>

<style>
	.viewport {
		position: relative;
		overflow: hidden;
	}
</style>
