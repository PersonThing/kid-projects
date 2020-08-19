<div class="form-group">
	<label for="graphic">
		<slot>Graphic</slot>
	</label>
	<div>
		<InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>
			<Art name={option.value} {spin} />
			{option.value}
		</InputSelect>
	</div>
	{#if value != null}
		<a href="#/level-builder/art/{value}" class="ml-1">Edit {value} art</a>
	{/if}
</div>

<script>
	import Art from './Art.svelte'
	import artStore from '../../../stores/art-store'
	import InputSelect from '../../../components/InputSelect.svelte'
	export let value = null
	export let filter = null
	export let spin = false
	export let name = 'graphic-picker'
	export let placeholder = 'Select art'

	$: options = Object.keys($artStore).filter(name => filter == null || filter($artStore[name]))
</script>
