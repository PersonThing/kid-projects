<div>
	<InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>
		{#if option.graphic}
			<Art id={option.graphic} />
		{/if}
		{option.name}
	</InputSelect>
</div>
{#if value != null}
	<a href="#/{$project.name}/build/particles/{value}" class="ml-1">Edit {$project.particles[value].name} particles</a>
{/if}

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	import InputSelect from './InputSelect.svelte'
	export let value = null
	export let name = 'particles-picker'
	export let placeholder = 'Select particles'

	$: options = [
		{ value: null, name: 'No particles' },
		...Object.values($project.particles).sort().map(p => ({
			...p,
			value: p.id
		}))
	]
</script>
