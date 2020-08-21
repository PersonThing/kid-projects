{#if level}
	<img
		src={level.thumbnail}
		alt="level preview"
		class="level-preview"
		class:grabbing={mouseDown}
		style="background: {level.background}"
		on:mousedown|preventDefault={onMouseDown}
		on:mousemove|preventDefault={onMouseMove}
		on:mouseup|preventDefault={onMouseUp} />
{/if}

<script>
	import { createEventDispatcher } from 'svelte'
	export let level
	const dispatch = createEventDispatcher()

	let mouseDown = false
	function onMouseDown(e) {
		mouseDown = true
	}

	function onMouseUp(e) {
		mouseDown = false
	}

	function onMouseMove(e) {
		if (mouseDown) dispatch('pan', e.offsetX)
	}
</script>

<style>
	img {
		cursor: grab;
	}
	.grabbing {
		cursor: grabbing;
	}
</style>
