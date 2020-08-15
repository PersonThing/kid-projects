<div class="form-group">
	<label for="graphic">
		<slot>Graphic</slot>
	</label>
	<div class="list-group">
		{#each options as drawingName}
			<div class="list-group-item list-group-item-action" class:active={value == drawingName} on:click={() => (value = drawingName)}>
				<CustomGraphic graphic={$savedDrawings[drawingName]} />
				{drawingName}
			</div>
		{/each}
	</div>
</div>

<script>
	import savedDrawings from '../../../stores/pixel-art-store'
	import CustomGraphic from './CustomGraphic.svelte'
	import { onMount } from 'svelte'
	export let value = null
	export let filter = null

	$: options = Object.keys($savedDrawings).filter(name => filter == null || filter($savedDrawings[name]))
</script>

<style>
	.list-group {
		overflow: auto;
		max-height: 250px;
	}
</style>
