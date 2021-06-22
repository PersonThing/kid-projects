{#if input != null}
	<BuildLayout tab="levels" activeName={input.name} store={$project.levels}>
		<Form on:submit={save} {hasChanges}>
			<FieldText name="name" bind:value={input.name}>Name</FieldText>
			<FieldCharacterPicker name="playableCharacters" bind:value={input.playableCharacters}>
				Which characters can play this level?
			</FieldCharacterPicker>
			<div class="form-group">
				<label for="color">Background color</label>
				<ColorPicker name="color" bind:value={input.background} />
			</div>
			<BuildDrawingTool background={input.background} bind:thumbnail={input.thumbnail} bind:blocks={input.blocks} bind:enemies={input.enemies} />
			<span slot="buttons">
				{#if !isAdding}
					<button type="button" class="btn btn-danger" on:click={del}>Delete</button>
				{/if}
			</span>
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

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $project.levels[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$project.levels[input.name] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/levels/${encodeURIComponent(input.name)}`)
	}

	async function edit(name) {
		if (!$project.levels.hasOwnProperty(name)) return
		input = null
		await tick()
		input = JSON.parse(JSON.stringify($project.levels[name]))
	}

	async function create() {
		input = null
		await tick()
		input = {
			name: '',
			playableCharacters: [],
			background: 'rgba(198, 244, 255, 255)',
			blocks: [],
			enemies: [],
		}
	}

	function del() {
		if (confirm(`Are you sure you want to delete "${input.name}"?`)) {
			delete $project.levels[input.name]
			$project.levels = $project.levels
			push(`/${$project.name}/build/levels/new`)
		}
	}
</script>
