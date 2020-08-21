<BuildLayout tab="blocks" activeName={input.name} store={$project.blocks}>
	<Form on:submit={save} {hasChanges}>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>
		<FieldArtPicker bind:value={input.graphic} blocks>Graphic (must be 20x20)</FieldArtPicker>
		<FieldCheckbox name="solid" bind:checked={input.solid}>Solid? (if not checked, things will just move through it)</FieldCheckbox>
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
</BuildLayout>

<script>
	import { push } from 'svelte-spa-router'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import Form from '../../components/Form.svelte'
	import project from '../../stores/active-project-store'
	import validator from '../../services/validator'

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $project.blocks[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$project.blocks[input.name] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/blocks/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$project.blocks.hasOwnProperty(name)) return
		input = JSON.parse(JSON.stringify($project.blocks[name]))
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
			delete $project.blocks[name]
			$project.blocks = $project.blocks
			push(`/${$project.name}/build/blocks/new`)
		}
	}
</script>
