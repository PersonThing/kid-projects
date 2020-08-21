<div class="form-group">
	<label for="graphic">
		<slot>Characters</slot>
	</label>
	<div>
		<InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>
			<Art name={$project.characters[option.value].graphicStill} />
			{option.value}
		</InputSelect>
	</div>
</div>

<script>
	import project from '../stores/active-project-store'
	import Art from './Art.svelte'
	import InputSelect from './InputSelect.svelte'
	export let value = []

	$: options = Object.keys($project.characters)

	function toggle(name) {
		value = value.indexOf(name) > -1 ? value.filter(v => v != name) : [...value, name].sort()
	}
</script>
