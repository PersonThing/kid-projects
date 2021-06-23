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
		<FieldParticles bind:value={input.particles}>Emit particles?</FieldParticles>
		<FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>Max velocity</FieldNumber>
		<FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>Jump velocity</FieldNumber>
		<FieldNumber name="gravityMultiplier" min={0} max={2} step={0.01} bind:value={input.gravityMultiplier}>Gravity multiplier</FieldNumber>
		<FieldNumber name="maxHealth" bind:value={input.maxHealth}>Max health</FieldNumber>
		<FieldNumber name="score" bind:value={input.score}>Score (How many points you get when this enemy dies)</FieldNumber>
		<FieldCheckbox name="canFly" bind:checked={input.canFly}>Can fly?</FieldCheckbox>
		<FieldAbilities name="abilities" bind:abilities={input.abilities} requireKeybinds={false}>Abilities</FieldAbilities>
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
	import FieldAbilities from '../../components/FieldAbilities.svelte'
	import FieldParticles from '../../components/FieldParticles.svelte'
	import { buildDefaultParticlesConfig } from '../../services/particles'

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
			},
			name: '',
			maxHealth: 100,
			maxVelocity: 200,
			jumpVelocity: 500,
			gravityMultiplier: 1,
			score: 1,
			abilities: [],
			particles: buildDefaultParticlesConfig()
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
