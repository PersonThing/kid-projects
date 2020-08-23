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

<BuildLayout tab="enemies" activeName={input.name} store={$project.enemies}>
	<Form on:submit={save} {hasChanges}>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>

		<FieldArtPicker bind:value={input.graphics.still}>Still graphics</FieldArtPicker>
		<FieldArtPicker bind:value={input.graphics.moving}>Moving graphics</FieldArtPicker>
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
</BuildLayout>

<script>
	import { push } from 'svelte-spa-router'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import project from '../../stores/active-project-store'
	import validator from '../../services/validator'

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $project.enemies[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$project.enemies[input.name] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/enemies/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$project.enemies.hasOwnProperty(name)) return
		input = {
			...createDefaultInput(),
			...JSON.parse(JSON.stringify($project.enemies[name])),
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
				// jumping: null,
			},
			name: '',
			maxHealth: 100,
			maxVelocity: 5,
			jumpVelocity: 10,
			gravityMultiplier: 1,
			fallDamageMultiplier: 1,
			dps: 120,
			score: 1,
		}
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $project.enemies[name]
			$project.enemies = $project.enemies
			push(`/${$project.name}/build/enemies/new`)
		}
	}
</script>
