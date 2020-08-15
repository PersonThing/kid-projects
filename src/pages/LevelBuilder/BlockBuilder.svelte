<div class="row">
	<div class="col-2">
		<StoreNav items={$blocks} activeName={input.name} on:create={create} on:edit={e => edit(e.detail)} />
	</div>
	<div class="col">
		<Form on:submit={save}>
			<FieldText name="name" bind:value={input.name}>Name</FieldText>
			<FieldGraphicPicker bind:value={input.graphic} filter={b => b.width == 20 && b.height == 20}>Graphic (must be 20x20)</FieldGraphicPicker>
			<FieldCheckbox name="solid" bind:checked={input.solid}>Solid?</FieldCheckbox>
			<FieldNumber name="dps" bind:value={input.dpsToPlayers}>
				DPS (when players or enemies touch this block, how much damage should they take per second?)
			</FieldNumber>
			<span slot="buttons">
				{#if !isAdding}
					<button class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
				{/if}
			</span>
		</Form>
	</div>
</div>

<script>
	import blocks from '../../stores/block-store'
	import FieldGraphicPicker from './components/FieldGraphicPicker.svelte'
	import FieldText from './components/FieldText.svelte'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import Form from './components/Form.svelte'
	import StoreNav from './StoreNav.svelte'

	let input

	create()

	$: isAdding = $blocks[input.name] == null

	function save() {
		$blocks[input.name] = JSON.parse(JSON.stringify(input))
	}

	function edit(name) {
		input = { ...$blocks[name] }
	}

	function create() {
		input = {
			name: '',
			solid: true,
			dps: 0,
		}
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) delete $blocks[name]
		$blocks = $blocks
	}
</script>
