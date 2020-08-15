<LevelBuilderLayout tab="levels" activeName={input.name} store={$levels}>
	<Form on:submit={save}>
		<FieldText name="name" bind:value={input.name}>Name</FieldText>
		<FieldCharacterPicker name="playableCharacters" bind:value={input.playableCharacters}>Which characters can play this level?</FieldCharacterPicker>
		<FieldText name="background" bind:value={input.background}>Background (any css background value)</FieldText>
		<LevelBuilderDataEditor background={input.background} bind:blocks={input.blocks} bind:enemies={input.enemies} />
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={del}>Delete</button>
			{/if}
		</span>
	</Form>
</LevelBuilderLayout>

<script>
	import { push } from 'svelte-spa-router'
	import characters from '../../stores/character-store'
	import FieldCharacterPicker from './components/FieldCharacterPicker.svelte'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldGraphicPicker from './components/FieldGraphicPicker.svelte'
	import FieldMultiSelect from './components/FieldMultiSelect.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import FieldText from './components/FieldText.svelte'
	import Form from './components/Form.svelte'
	import LevelBuilderDataEditor from './components/LevelBuilderDataEditor.svelte'
	import LevelBuilderLayout from './components/LevelBuilderLayout.svelte'
	import levels from '../../stores/level-store'

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'

	function save() {
		$levels[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/levels/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		console.log('editing ', name, $levels[name])
		input = JSON.parse(JSON.stringify($levels[name]))
	}

	function create() {
		input = {
			name: '',
			playableCharacters: [],
			background: 'rgb(135, 206, 235)',
			blocks: [],
			enemies: [],
		}
	}

	function del() {
		if (confirm(`Are you sure you want to delete "${input.name}"?`)) {
			delete $levels[input.name]
			$levels = copy
			push('/level-builder/levels/new')
		}
	}
</script>
