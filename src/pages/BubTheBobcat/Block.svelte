<div class="block" class:interactive style="height: {height}px; width: {width}px; bottom: {y - height}px; left: {x}px; background-color: {color}" />

<script>
	export let y = 0
	export let x = 0
	export let width = 0
	export let height = 0
	export let interactive = true
	export let color = 'rgb(8,95,8)'
</script>

<style>
	.block {
		position: absolute;
	}

	.interactive {
		border-top: 4px solid black;
	}
</style>
