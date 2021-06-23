<BuildLayout tab="blocks" activeName={input.name} store={$project.blocks}>
	<Form on:submit={save} {hasChanges}>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>
		<FieldArtPicker bind:value={input.graphic}>Graphic</FieldArtPicker>
		<FieldCheckbox name="solid" bind:checked={input.solid}>Solid? (if not checked, things will just move through it)</FieldCheckbox>
		<FieldCheckbox name="consumable" bind:checked={input.consumable}>Consumable by player?</FieldCheckbox>
		{#if input.consumable}
			<div class="field-group">
				<FieldNumber name="healthOnConsume" bind:value={input.healthOnConsume}>Health on consume?</FieldNumber>
				<FieldNumber name="scoreOnConsume" bind:value={input.scoreOnConsume}>Score on consume?</FieldNumber>
				<FieldCharacterPicker name="followerOnConsume" bind:value={input.followerOnConsume}>Spawn follower on consume?</FieldCharacterPicker>
				<FieldEnemyPicker name="enemyOnConsume" bind:value={input.enemyOnConsume}>Spawn enemy on consume?</FieldEnemyPicker>
			</div>
		{/if}
		<FieldCheckbox name="throwOnTouch" bind:checked={input.throwOnTouch}>Throw things that touch it?</FieldCheckbox>
		<FieldNumber name="damage" bind:value={input.damage}>
			Damage (when players or enemies touch this block, how much damage should they take?)
		</FieldNumber>
		<FieldCheckbox name="winOnTouch" bind:checked={input.winOnTouch}>Win level if you touch the block?</FieldCheckbox>
		<FieldParticles name="particles" bind:value={input.particles} />

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
	import FieldCharacterPicker from '../../components/FieldCharacterPicker.svelte'
	import FieldCheckbox from '../../components/FieldCheckbox.svelte'
	import FieldEnemyPicker from '../../components/FieldEnemyPicker.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldParticles from '../../components/FieldParticles.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import project from '../../stores/active-project-store'
	import validator from '../../services/validator'
	import { buildDefaultParticlesConfig } from '../../services/particles'

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
		input = {
			...createDefaultInput(),
			...JSON.parse(JSON.stringify($project.blocks[name])),
		}
	}

	function create() {
		input = createDefaultInput()
	}

	function createDefaultInput() {
		return {
			name: '',
			solid: true,
			throwOnTouch: false,
			winOnTouch: false,
			damage: 0,
			consumable: false,
			healthOnConsume: 0,
			scoreOnConsume: 0,
			followerOnConsume: [],
			enemyOnConsume: [],
			particles: buildDefaultParticlesConfig()
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