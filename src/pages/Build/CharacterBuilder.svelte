<BuildLayout tab="characters" activeName={input.name} store={$project.characters}>
	<Form on:submit={save} {hasChanges}>
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>

		<FieldAnimationSpriteSheet bind:value={input.sprites.still}>Still graphics</FieldAnimationSpriteSheet>
		<FieldAnimationSpriteSheet bind:value={input.sprites.moving}>Moving graphics</FieldAnimationSpriteSheet>
		<FieldAnimationSpriteSheet bind:value={input.sprites.jumping}>Jumping graphics</FieldAnimationSpriteSheet>

		<!--
		<FieldArtPicker bind:value={input.graphicStill}>Standing still graphic</FieldArtPicker>
		<FieldAnimation
			bind:graphics={input.motionGraphics}
			bind:framesPerGraphic={input.framesPerGraphic}
			bind:loopBack={input.motionGraphicsLoopBack}
			vx={input.maxVelocity}>
			Moving graphics
		</FieldAnimation> -->
		<FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>Max velocity</FieldNumber>
		<FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>Jump velocity</FieldNumber>
		<FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>Gravity multiplier</FieldNumber>
		<FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>Fall damage multiplier</FieldNumber>
		<FieldNumber name="maxHealth" bind:value={input.maxHealth}>Max health</FieldNumber>
		<!-- <FieldAbilities name="abilities" bind:input>Abilities</FieldAbilities> -->
	</Form>
</BuildLayout>

<script>
	import { onDestroy } from 'svelte'
	import { push } from 'svelte-spa-router'
	import { remove as removeIcon } from 'svelte-awesome/icons'
	import Art from '../../components/Art.svelte'
	import project from '../../stores/active-project-store'
	import FieldAbilities from '../../components/FieldAbilities.svelte'
	import FieldAnimation from '../../components/FieldAnimation.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldRange from '../../components/FieldRange.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import Icon from 'svelte-awesome'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import validator from '../../services/validator'
	import FieldPngData from '../../components/InputPngData.svelte'
	import FieldAnimationSpriteSheet from '../../components/FieldAnimationSpriteSheet.svelte'

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
			sprites: {
				still: {},
				moving: {},
				jumping: {},
			},
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
			delete $project.characters[name]
			$project.characters = $project.characters
			push(`/${$project.name}/build/characters/new`)
		}
	}
</script>
