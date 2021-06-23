<div>
	<InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>
		{#if option.graphic}
			<Art name={option.graphic} />
		{/if}
		{option.label}
	</InputSelect>
</div>
{#if value != null}
	<a href="#/{$project.name}/build/particles/{value}" class="ml-1">Edit {value} particles</a>
{/if}

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	import InputSelect from './InputSelect.svelte'
	export let value = null
	export let name = 'particles-picker'
	export let placeholder = 'Select particles'

	$: options = [
		{ value: null, label: 'No particles' },
		...Object.keys($project.particles).sort().map(p => ({
			value: p,
			label: p,
			...$project.particles[p]
		}))
	]
</script>
