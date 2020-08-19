<LevelBuilderLayout tab="blocks" activeName={input.name} store={$blocks}>
	<Form on:submit={save} {hasChanges}>
		<FieldText name="name" bind:value={input.name} autofocus>Name</FieldText>
		<FieldArtPicker bind:value={input.graphic} filter={b => b.width == 20 && b.height == 20}>Graphic (must be 20x20)</FieldArtPicker>
		<FieldCheckbox name="solid" bind:checked={input.solid}>Solid?</FieldCheckbox>
		<FieldCheckbox name="throwOnTouch" bind:checked={input.throwOnTouch}>Throw things that touch it?</FieldCheckbox>
		<FieldNumber name="dps" bind:value={input.dps}>
			DPS (when players or enemies touch this block, how much damage should they take per second?)
		</FieldNumber>
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>
	</Form>
</LevelBuilderLayout>

<script>
	import { push } from 'svelte-spa-router'
	import LevelBuilderLayout from './components/LevelBuilderLayout.svelte'
	import FieldArtPicker from './components/FieldArtPicker.svelte'
	import FieldText from './components/FieldText.svelte'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import Form from './components/Form.svelte'
	import blocks from '../../stores/block-store'
	import validator from '../../services/validator'

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $blocks[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$blocks[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/blocks/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$blocks.hasOwnProperty(name)) return
		input = JSON.parse(JSON.stringify($blocks[name]))
	}

	function create() {
		input = {
			name: '',
			solid: true,
			throwOnTouch: false,
			dps: 0,
		}
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $blocks[name]
			$blocks = $blocks
			push('/level-builder/blocks/new')
		}
	}
</script>
