<BuildLayout tab="characters" activeName={input.name} store={$project.characters}>
	<Form on:submit={save} {hasChanges}>
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={del}>Delete</button>
			{/if}
		</span>
		<FieldText name="name" bind:value={input.name} placeholder="Type a name...">Name</FieldText>

		<FieldArtPicker bind:value={input.graphics.still}>Still graphics</FieldArtPicker>
		<FieldArtPicker bind:value={input.graphics.moving}>Moving graphics</FieldArtPicker>
		<FieldParticles bind:value={input.particles}>Emit particles?</FieldParticles>
		<FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>Max velocity</FieldNumber>
		<FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>Jump velocity</FieldNumber>
		<FieldNumber name="gravityMultiplier" min={0} max={2} step={0.01} bind:value={input.gravityMultiplier}>Gravity multiplier</FieldNumber>
		<FieldNumber name="maxHealth" bind:value={input.maxHealth}>Max health</FieldNumber>

		<FieldCheckbox name="canDoubleJump" bind:checked={input.canDoubleJump}>Can double jump?</FieldCheckbox>
		<FieldCheckbox name="canFly" bind:checked={input.canFly}>Can fly?</FieldCheckbox>
		<FieldCheckbox name="canJumpThroughBlocks" bind:checked={input.canJumpThroughBlocks}>
			Can jump through bottom of blocks sonic-style?
		</FieldCheckbox>

		<FieldAbilities name="abilities" bind:abilities={input.abilities}>Abilities</FieldAbilities>
		<FieldCharacterPicker name="followers" bind:value={input.followers}>Followers / Pets</FieldCharacterPicker>
	</Form>
</BuildLayout>

<script>
	import { push } from 'svelte-spa-router'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import FieldAbilities from '../../components/FieldAbilities.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import project from '../../stores/active-project-store'
	import validator from '../../services/validator'
	import FieldCharacterPicker from '../../components/FieldCharacterPicker.svelte'
	import FieldParticles from '../../components/FieldParticles.svelte'
	import { getNextId } from '../../stores/project-store'

	export let params = {}
	let input = createDefaultInput()
	$: paramId = decodeURIComponent(params.id) || 'new'
	$: paramId == 'new' ? create() : edit(paramId)
	$: isAdding = input.id == null
	$: hasChanges = input != null && !validator.equals(input, $project.characters[input.id])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		if (isAdding) input.id = getNextId($project.characters)
		$project.characters[input.id] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/characters/${encodeURIComponent(input.id)}`)
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
			maxVelocity: 500,
			jumpVelocity: 600,
			gravityMultiplier: 1,
			canFly: false,
			canDoubleJump: false,
			canJumpThroughBlocks: false,
			abilities: [],
			followers: [],
			particles: null
		}
	}

	function del() {
		if (confirm(`Are you sure you want to delete "${input.name}"?`)) {
			delete $project.characters[input.id]
			$project.characters = $project.characters
			push(`/${$project.name}/build/characters/new`)
		}
	}
</script>
