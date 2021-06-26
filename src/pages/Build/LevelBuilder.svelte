{#if input != null}
	<BuildLayout tab="levels" activeId={input.id} store={$project.levels}>
		<Form on:submit={save} {hasChanges}>
			<FieldText name="name" bind:value={input.name} placeholder="Type a name...">Name</FieldText>
			<div class="flex">
				<FieldCharacterPicker name="playableCharacters" bind:value={input.playableCharacters}>
					Which characters can play this level?
					<div class="flex g1">
						{#each input.playableCharacters as characterId}
							<a href="#/{encodeURIComponent($project.name)}/play/{encodeURIComponent(input.id)}/{encodeURIComponent(characterId)}" class="text-success"><Icon data={playIcon} /> Play as {$project.characters[characterId].name}</a>
						{/each}
					</div>
				</FieldCharacterPicker>
			</div>
			<FieldLevelPicker name="requiredLevels" bind:value={input.requiredLevels} placeholder="None">Required levels</FieldLevelPicker>
			<div class="form-group">
				<label for="color">Background color</label>
				<ColorPicker name="color" bind:value={input.background} />
			</div>
			<BuildDrawingTool background={input.background} bind:thumbnail={input.thumbnail} bind:blocks={input.blocks} bind:enemies={input.enemies} />
			<div slot="buttons" class="flex g1 align-top">
				{#if !isAdding}
					<button type="button" class="btn btn-danger" on:click={del}>Delete</button>
				{/if}
			</div>
		</Form>
	</BuildLayout>
{/if}

<script>
	import { push } from 'svelte-spa-router'
	import { tick } from 'svelte'
	import project from '../../stores/active-project-store'
	import FieldCharacterPicker from '../../components/FieldCharacterPicker.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import BuildDrawingTool from '../../components/BuildDrawingTool.svelte'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import validator from '../../services/validator'
	import ColorPicker from '../../components/ColorPicker.svelte'
	import { getNextId } from '../../stores/project-store'
	import FieldLevelPicker from '../../components/FieldLevelPicker.svelte'
	import Icon from 'svelte-awesome'
	import { play as playIcon } from 'svelte-awesome/icons'

	export let params = {}
	let input = createDefaultInput()
	$: paramId = decodeURIComponent(params.id) || 'new'
	$: paramId == 'new' ? create() : edit(paramId)
	$: isAdding = input?.id == null
	$: hasChanges = input != null && !validator.equals(input, $project.levels[input.id])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		if (isAdding) input.id = getNextId($project.levels)
		$project.levels[input.id] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/levels/${encodeURIComponent(input.id)}`)
	}

	async function edit(id) {
		if (!$project.levels.hasOwnProperty(id)) return
		input = null
		await tick()
		input = JSON.parse(JSON.stringify($project.levels[id]))
	}

	async function create() {
		input = null
		await tick()
		input = createDefaultInput()
	}

	function createDefaultInput() {
		return {
			name: '',
			playableCharacters: [],
			background: 'rgba(198, 244, 255, 255)',
			blocks: [],
			enemies: [],
			requiredLevels: []
		}
	}

	function del() {
		if (confirm(`Are you sure you want to delete "${input.name}"?`)) {
			delete $project.levels[input.id]
			$project.levels = $project.levels
			push(`/${$project.name}/build/levels/new`)
		}
	}
</script>
