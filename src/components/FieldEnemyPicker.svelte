<div class="form-group">
	<label for="graphic">
		<slot>Enemies</slot>
	</label>
	<div>
		<InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>
			<Art id={option.graphics.still} />
			{option.name}
		</InputSelect>
	</div>
</div>

<script>
	import project from '../stores/active-project-store'
	import Art from './Art.svelte'
	import InputSelect from './InputSelect.svelte'
	export let value = []

	$: options = Object.values($project.enemies).map(e => ({
		...e,
		value: e.id
	}))
</script>
