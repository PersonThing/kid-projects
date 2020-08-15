<!-- <ul>
	<li>Choose which characters can play this level</li>
</ul>

<div class="row">
	<div class="col-2">
		Placeable items here. Click an item, then click on the grid to place it in the level
		<ul>
			<li>all saved blocks</li>
			<li>all saved enemies</li>
		</ul>
	</div>

	<div class="col">GRID HERE</div>
</div> -->

<div class="row">
	<div class="col-2">
		<StoreNav items={$levels} activeName={input.name} on:create={create} on:edit={e => edit(e.detail)} />
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
					<button class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
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

	let input

	create()

	$: isAdding = $levels[input.name] == null

	function save() {
		$levels[input.name] = JSON.parse(JSON.stringify(input))
	}

	function edit(name) {
		input = { ...$levels[name] }
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

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) delete $levels[name]
		$levels = $levels
	}
</script>
