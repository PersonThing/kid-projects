<div class="row">
	<div class="col-2">
		<StoreNav href="#/level-builder/levels" items={$levels} activeName={input.name} on:create={create} on:edit={e => edit(e.detail)} />
	</div>
	<div class="col">
		<Form on:submit={save}>
			<FieldText name="name" bind:value={input.name}>Name</FieldText>

			<FieldMultiSelect name="playableCharacters" bind:value={input.playableCharacters} options={Object.keys($characters)}>
				Which characters can play this level?
			</FieldMultiSelect>

			<FieldText name="background" bind:value={input.background}>Background (any css background value)</FieldText>

			<LevelBuilderDataEditor background={input.background} bind:blocks={input.blocks} bind:enemies={input.enemies} />

			<span slot="buttons">
				{#if !isAdding}
					<button class="btn btn-danger" on:click={del}>Delete</button>
				{/if}
			</span>
		</Form>
	</div>
</div>

<script>
	import FieldGraphicPicker from './components/FieldGraphicPicker.svelte'
	import FieldText from './components/FieldText.svelte'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import Form from './components/Form.svelte'
	import StoreNav from './StoreNav.svelte'
	import FieldMultiSelect from './components/FieldMultiSelect.svelte'

	import characters from '../../stores/character-store'
	import levels from '../../stores/level-store'
	import LevelBuilderDataEditor from './components/LevelBuilderDataEditor.svelte'
	import { push } from 'svelte-spa-router'

	export let params = {}
	let input
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'

	function save() {
		$levels[input.name] = JSON.parse(JSON.stringify(input))
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
			const copy = JSON.parse(JSON.stringify($levels))
			delete copy[input.name]
			$levels = copy
			console.log(Object.keys($levels))
			push('/level-builder/levels/new')
		}
	}
</script>
