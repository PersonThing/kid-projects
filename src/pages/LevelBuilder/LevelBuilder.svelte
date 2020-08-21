{#if input != null}
	<LevelBuilderLayout tab="levels" activeName={input.name} store={$levels}>
		<Form on:submit={save} {hasChanges}>
			<FieldText name="name" bind:value={input.name} autofocus>Name</FieldText>
			<FieldCharacterPicker name="playableCharacters" bind:value={input.playableCharacters}>
				Which characters can play this level?
			</FieldCharacterPicker>
			<div class="form-group">
				<label for="color">Background color</label>
				<ColorPicker name="color" bind:value={input.background} />
			</div>
			<LevelBuilderDrawingTool
				background={input.background}
				bind:thumbnail={input.thumbnail}
				bind:blocks={input.blocks}
				bind:enemies={input.enemies} />
			<span slot="buttons">
				{#if !isAdding}
					<button type="button" class="btn btn-danger" on:click={del}>Delete</button>
				{/if}
			</span>
		</Form>
	</LevelBuilderLayout>
{/if}

<script>
	import { push } from 'svelte-spa-router'
	import { tick } from 'svelte'
	import characters from '../../stores/character-store'
	import FieldCharacterPicker from './components/FieldCharacterPicker.svelte'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldArtPicker from './components/FieldArtPicker.svelte'
	import FieldMultiSelect from './components/FieldMultiSelect.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import FieldText from './components/FieldText.svelte'
	import Form from './components/Form.svelte'
	import LevelBuilderDrawingTool from './components/LevelBuilderDrawingTool.svelte'
	import LevelBuilderLayout from './components/LevelBuilderLayout.svelte'
	import LevelPreview from '../Play/LevelPreview.svelte'
	import levels from '../../stores/level-store'
	import validator from '../../services/validator'
	import ColorPicker from '../../components/ColorPicker.svelte'

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $levels[input.name])

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$levels[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/levels/${encodeURIComponent(input.name)}`)
	}

	async function edit(name) {
		if (!$levels.hasOwnProperty(name)) return
		input = null
		await tick()
		input = JSON.parse(JSON.stringify($levels[name]))
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
			delete $levels[input.name]
			$levels = $levels
			push('/level-builder/levels/new')
		}
	}
</script>
