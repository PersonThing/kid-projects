<button class="btn btn-danger" on:click={reset}>Reset</button>
<button class="btn btn-info mr-2" on:click={() => save()}>Save</button>

{#if savedNames.length}
	{#each savedNames as savedDrawingName}
		<div class="btn-group mr-2">
			<button class="btn btn-{savedDrawingName == loaded ? 'primary' : 'secondary'}" on:click={() => load(savedDrawingName)}>
				{savedDrawingName}
			</button>
			<button class="btn btn-danger" on:click={() => deleteSave(savedDrawingName)}>X</button>
		</div>
	{/each}
{/if}

<div class="color-picker">
	{#each colors as color}
		<button style="background-color: {color}" class:active={color == selectedColor} on:click={() => selectColor(color)} />
	{/each}
</div>

<svelte:window on:mousedown={() => (mouseDown = true)} on:mouseup={() => (mouseDown = false)} />

<table cellspacing="0">
	{#each rows as row}
		<tr>
			{#each columns as column}
				<td
					style="background-color: {data[row][column]}; width: {gridSize}px; height: {gridSize}px;"
					on:mousemove={() => onGridMousemove(row, column)}
					on:click={e => onGridClick(e, row, column)} />
			{/each}
		</tr>
	{/each}
</table>

<script>
	import LocalStorageStore from '../../stores/local-storage-store'

	const savedDrawings = LocalStorageStore('pixel-drawings', {})
	$: savedNames = Object.keys($savedDrawings)

	let loaded = null
	const colors = ['black', 'white', '#666', 'red', 'green', 'blue', 'pink', 'orange', 'purple', 'yellow', 'teal', '#773b0b']
	let selectedColor = 'black'
	const gridSize = 30
	const height = 15
	const width = 20
	const rows = [...Array(height)].map((_, i) => i)
	const columns = [...Array(width)].map((_, i) => i)
	let data = []
	let mouseDown = false

	reset()

	function reset() {
		let newData = []
		for (let i = 0; i < height; i++) {
			let row = []
			for (let j = 0; j < width; j++) {
				row.push('white')
			}
			newData.push(row)
		}
		data = newData
	}

	function onGridMousemove(row, column) {
		if (mouseDown) setColor(row, column)
	}

	function onGridClick(e, row, column) {
		if (e.altKey) {
			selectColor(data[row][column])
		} else {
			setColor(row, column)
		}
	}

	function setColor(row, column, color = selectedColor) {
		data[row][column] = color
	}

	function selectColor(color) {
		selectedColor = color
	}

	function save() {
		const name = prompt('Give us a name', loaded || '')
		if (name == null || name.trim().length == 0) return

		$savedDrawings[name] = data
		loaded = name
	}

	function load(name) {
		data = JSON.parse(JSON.stringify($savedDrawings[name]))
		loaded = name
	}

	function deleteSave(name) {
		if (!confirm(`Are you sure you want to delete ${name}?`)) return

		if ($savedDrawings.hasOwnProperty(name)) {
			delete $savedDrawings[name]
			$savedDrawings = $savedDrawings
		}
	}
</script>

<style>
	.color-picker button {
		display: inline-block;
		width: 30px;
		height: 30px;
	}

	.color-picker button.active {
		width: 50px;
		height: 50px;
	}

	table {
		border-top: 1px solid #ccc;
		border-right: 1px solid #ccc;
	}
	table td {
		border-bottom: 1px solid #ccc;
		border-left: 1px solid #ccc;
		cursor: pointer;
	}

	textarea {
		width: 100%;
		height: 50px;
	}
</style>
