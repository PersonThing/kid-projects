<div class="form-group">
	<label for="graphic">
		<slot>Graphic</slot>
	</label>
	<div class="options">
		{#each options as drawingName}
			<div class:active={value == drawingName} on:click={() => (value = drawingName)}>
				<Art name={drawingName} {spin} />
			</div>
		{/each}
	</div>
</div>

<script>
	import artStore from '../../../stores/art-store'
	import Art from './Art.svelte'
	export let value = null
	export let filter = null
	export let spin = false

	$: options = Object.keys($artStore).filter(name => filter == null || filter($artStore[name]))
</script>

<style>
	.options {
		overflow: auto;
	}
	.options > div {
		padding: 10px;
		float: left;
		border-radius: 0.25rem;
	}
	.options > div.active {
		background: #007bff;
	}
</style>
