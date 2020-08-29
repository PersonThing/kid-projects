<BuildLayout tab="characters" activeName={input.name} store={$project.characters}>
	<Form on:submit={save} {hasChanges}>
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>

		<FieldArtPicker bind:value={input.graphics.still}>Still graphics</FieldArtPicker>
		<FieldArtPicker bind:value={input.graphics.moving}>Moving graphics</FieldArtPicker>
		<FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>Max velocity</FieldNumber>
		<FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>Jump velocity</FieldNumber>
		<FieldNumber name="gravityMultiplier" min={0} max={2} step={0.01} bind:value={input.gravityMultiplier}>Gravity multiplier</FieldNumber>
		<FieldNumber name="maxHealth" bind:value={input.maxHealth}>Max health</FieldNumber>

		<FieldCheckbox name="canFly" bind:checked={input.canFly}>Can fly?</FieldCheckbox>
		<FieldCheckbox name="canDoubleJump" bind:checked={input.canDoubleJump}>Can double jump?</FieldCheckbox>

		<FieldAbilities name="abilities" bind:abilities={input.abilities}>Abilities</FieldAbilities>
		<FieldCharacterPicker name="followers" bind:value={input.followers}>Followers / Pets</FieldCharacterPicker>
	</Form>
</BuildLayout>

<script>
	import { onDestroy } from 'svelte'
	import { push } from 'svelte-spa-router'
	import { remove as removeIcon } from 'svelte-awesome/icons'
	import Art from '../../components/Art.svelte'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import FieldAbilities from '../../components/FieldAbilities.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldPngData from '../../components/InputPngData.svelte'
	import FieldRange from '../../components/FieldRange.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import Icon from 'svelte-awesome'
	import project from '../../stores/active-project-store'
	import validator from '../../services/validator'
	import FieldCharacterPicker from '../../components/FieldCharacterPicker.svelte'

	export let params = {}
	let input = {}
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $project.characters[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$project.characters[input.name] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/characters/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$project.characters.hasOwnProperty(name)) return
		input = {
			...createDefaultInput(),
			...JSON.parse(JSON.stringify($project.characters[name])),
		}
	}

	function create() {
		input = createDefaultInput()
	}

	function createDefaultInput() {
		return {
			graphics: {
				still: null,
				moving: null,
				spinning: null,
			},
			name: '',
			maxHealth: 100,
			maxVelocity: 5,
			jumpVelocity: 10,
			gravityMultiplier: 1,
			canFly: false,
			canDoubleJump: false,
			abilities: [],
			followers: [],
		}
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $project.characters[name]
			$project.characters = $project.characters
			push(`/${$project.name}/build/characters/new`)
		}
	}
</script>
