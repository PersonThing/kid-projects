<div class="form-group">
	<strong>
		<slot />
	</strong>
	<div>
		<InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>
			<Art name={option.value} {spin} />
			{option.value}
		</InputSelect>
	</div>
	{#if value != null}
		<a href="#/{$project.name}/build/art/{value}" class="ml-1">Edit {value} art</a>
	{/if}
</div>

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	import InputSelect from './InputSelect.svelte'
	export let value = null
	export let spin = 0
	export let name = 'graphic-picker'
	export let placeholder = 'Select art'
	export let blocks = false

	const blockFilter = b => b.width == 40 && b.height == 40
	$: options = Object.keys($project.art)
		.filter(name => blocks == blockFilter($project.art[name]))
		.sort()
</script>
