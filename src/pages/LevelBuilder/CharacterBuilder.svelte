<LevelBuilderLayout tab="characters" activeName={input.name} store={$characters}>
	<Form on:submit={save} {hasChanges}>
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>

		<FieldArtPicker bind:value={input.graphicStill}>Standing still graphic</FieldArtPicker>
		<FieldAnimation bind:graphics={input.motionGraphics} bind:framesPerGraphic={input.framesPerGraphic} vx={input.maxVelocity}>
			Moving graphics
		</FieldAnimation>
		<FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>Max velocity</FieldNumber>
		<FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>Jump velocity</FieldNumber>
		<FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>Gravity multiplier</FieldNumber>
		<FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>Fall damage multiplier</FieldNumber>
		<FieldNumber name="maxHealth" bind:value={input.maxHealth}>Max health</FieldNumber>
		<FieldAbilities name="abilities" bind:input>Abilities</FieldAbilities>
	</Form>
</LevelBuilderLayout>

<script>
	import { onDestroy } from 'svelte'
	import { push } from 'svelte-spa-router'
	import { remove as removeIcon } from 'svelte-awesome/icons'
	import Art from '../../components/Art.svelte'
	import artStore from '../../stores/art-store'
	import characters from '../../stores/character-store'
	import FieldAbilities from '../../components/FieldAbilities.svelte'
	import FieldAnimation from '../../components/FieldAnimation.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldRange from '../../components/FieldRange.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import Icon from 'svelte-awesome'
	import LevelBuilderLayout from '../../components/LevelBuilderLayout.svelte'
	import validator from '../../services/validator'

	export let params = {}
	let input = {}
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $characters[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$characters[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/characters/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$characters.hasOwnProperty(name)) return
		input = {
			...createDefaultInput(),
			...JSON.parse(JSON.stringify($characters[name])),
		}
	}

	function create() {
		input = createDefaultInput()
	}

	function createDefaultInput() {
		return {
			graphicStill: null,
			graphicSpinning: null,
			motionGraphics: [null],
			framesPerGraphic: 5,
			name: '',
			maxHealth: 100,
			maxVelocity: 5,
			jumpVelocity: 10,
			gravityMultiplier: 1,
			fallDamageMultiplier: 1,
			dps: 100,
			canFly: false,

			canSpin: true,
			spinDegreesPerFrame: 15,

			canFireProjectiles: false,
			projectileDamage: 50,
			projectileYStart: 20,
			projectileVelocity: 20,
			projectileGravityMultiplier: 0.1,
		}
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $characters[name]
			$characters = $characters
			push('/level-builder/characters/new')
		}
	}
</script>
