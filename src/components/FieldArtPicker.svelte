<div class="form-group">
	<strong>
		<slot />
	</strong>
	<div>
		<InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>
			<Art id={option.id} {spin} />
			{option.name}
		</InputSelect>
	</div>
	{#if value != null}
		<a href="#/{$project.name}/build/art/{value}" class="ml-1">Edit {$project.art[value].name} art</a>
	{/if}
</div>

<script>
	import { sortByName } from '../services/object-utils'
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	import InputSelect from './InputSelect.svelte'

	export let value = null
	export let spin = 0
	export let name = 'graphic-picker'
	export let placeholder = 'Select art'

	$: options = Object.values($project.art)
		.map(a => ({
			...a,
			value: a.id
		}))
		.sort(sortByName)
</script>
