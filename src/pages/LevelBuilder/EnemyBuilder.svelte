<!-- All same fields as character builder, plus:
<ul>
	<li>
		Behavior:
		<ul>
			<li>pace back and forth</li>
			<li>follow player [ leash range, attack from range ]</li>
		</ul>
	</li>
</ul> -->

<LevelBuilderLayout tab="enemies" activeName={input.name} store={$enemies}>
	<Form on:submit={save} {hasChanges}>
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
		<FieldNumber name="score" bind:value={input.score}>Score (How many points you get when this enemy dies)</FieldNumber>
		<FieldNumber name="dps" bind:value={input.dps}>DPS (when in contact with player - we will replace this with abilities later)</FieldNumber>
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>
	</Form>
</LevelBuilderLayout>

<script>
	import { push } from 'svelte-spa-router'
	import enemies from '../../stores/enemy-store'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import LevelBuilderLayout from '../../components/LevelBuilderLayout.svelte'
	import validator from '../../services/validator'
	import FieldAnimation from '../../components/FieldAnimation.svelte'

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $enemies[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$enemies[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/enemies/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$enemies.hasOwnProperty(name)) return
		input = JSON.parse(JSON.stringify($enemies[name]))
	}

	function create() {
		input = createDefaultInput()
	}

	function createDefaultInput() {
		return {
			graphicStill: null,
			motionGraphics: [],
			name: '',
			maxHealth: 100,
			maxVelocity: 20,
			jumpVelocity: 15,
			gravityMultiplier: 1,
			fallDamageMultiplier: 1,
			dps: 120,
			score: 1,
		}
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $enemies[name]
			$enemies = $enemies
			push('/level-builder/enemies/new')
		}
	}
</script>
