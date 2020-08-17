<!-- Fields for each character:
<ul>
	<li>Standing still graphic (import from pixel art maker)</li>
	<li>(optional) Moving graphic 1</li>
	<li>(optional) Moving graphic 2</li>
	<li>(optional) Moving graphic 3</li>
	<li>Maximum velocity on ground</li>
	<li>Jump velocity</li>
	<li>Gravity Modifier 0-1 (0 = don't fall at all (if 0, need to give a down key), 1 = normal falling speed)</li>
	<li>Fall damage multiplier 0-1 (0 = no fall damage, 1 = normal fall damage)</li>
	<li>Max health</li>
	<li>Abilities... need scripts for them... come up with something pluggable?</li>
</ul> -->

<LevelBuilderLayout tab="characters" activeName={input.name} store={$characters}>
	<Form on:submit={save}>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>
		<FieldGraphicPicker bind:value={input.graphicStill} filter={notBlockFilter}>Standing still graphic</FieldGraphicPicker>
		<FieldGraphicPicker bind:value={input.graphicSpinning} filter={notBlockFilter} spin>Spinning graphic</FieldGraphicPicker>
		<!--
			todo, let them select up to 3 moving graphics to cycle through
			sprite will sit on each graphic for X # of frames?
			<FieldGraphicPicker bind:value={input.graphicMoving1} filter={notBlockFilter}>Moving graphics</FieldGraphicPicker>
		-->
		<FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>Max velocity</FieldNumber>
		<FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>Jump velocity</FieldNumber>
		<FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>Gravity multiplier</FieldNumber>
		<FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>Fall damage multiplier</FieldNumber>
		<FieldNumber name="maxHealth" bind:value={input.maxHealth}>Max health</FieldNumber>
		<FieldNumber name="dps" bind:value={input.dps}>DPS (when in contact with enemies - we will replace this with abilities later)</FieldNumber>
		<FieldCheckbox name="canFly" bind:checked={input.canFly}>Can fly?</FieldCheckbox>
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>
	</Form>
</LevelBuilderLayout>

<script>
	import { push } from 'svelte-spa-router'
	import characters from '../../stores/character-store'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldGraphicPicker from './components/FieldGraphicPicker.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import FieldText from './components/FieldText.svelte'
	import Form from './components/Form.svelte'
	import LevelBuilderLayout from './components/LevelBuilderLayout.svelte'

	const notBlockFilter = b => b.width != 20 || b.height != 20

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'

	function save() {
		$characters[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/characters/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$characters.hasOwnProperty(name)) return
		input = JSON.parse(JSON.stringify($characters[name]))
	}

	function create() {
		input = {
			graphicStill: null,
			graphicSpinning: null,
			name: '',
			maxHealth: 100,
			maxVelocity: 20,
			jumpVelocity: 15,
			gravityMultiplier: 1,
			fallDamageMultiplier: 1,
			dps: 120,
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
