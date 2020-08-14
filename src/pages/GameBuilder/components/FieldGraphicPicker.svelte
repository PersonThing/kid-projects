<div class="form-group">
	<label for="graphic">
		<slot>Graphic</slot>
	</label>
	<div class="list-group">
		{#each Object.keys($savedDrawings) as drawingName}
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
	export let value = null
</script>
