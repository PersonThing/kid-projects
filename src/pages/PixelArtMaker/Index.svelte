{#if savedNames.length}
	<div>
		{#each savedNames as savedDrawingName}
			<div class="btn-group mr-2">
				<button class="btn btn-sm btn-{savedDrawingName == loaded ? 'primary active' : 'secondary'}" on:click={() => load(savedDrawingName)}>
					{savedDrawingName}
				</button>
				<button class="btn btn-sm btn-secondary" on:click={() => deleteSave(savedDrawingName)}>x</button>
			</div>
		{/each}
	</div>
{/if}

<div>
	<input type="number" bind:value={gridSize} min="15" max="50" step="5" on:change={resetGridSize} />
</div>

<div class="btn-toolbar">
	<div class="btn-group">
		<button class="btn btn-danger btn-sm" on:click={reset}>Reset</button>
		<button class="btn btn-primary btn-sm mr-2" on:click={() => save()}>Save</button>
	</div>

	<div class="btn-group color-picker">
		{#each colors as color}
			<button style="background-color: {color}" class:active={color == selectedColor} on:click={() => selectColor(color)} />
		{/each}
	</div>
</div>

<svelte:window on:mousedown={() => (mouseDown = true)} on:mouseup={() => (mouseDown = false)} on:resize={resetGridSize} />

<table cellspacing="0">
	{#each rows as row}
		<tr>
			{#each columns as column}
				<td
					style="background-color: {getCellColor(data, row, column)}; width: {gridSize}px; height: {gridSize}px;"
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
	const colors = [
		'black',
		'white',
		'#A0A4A0',
		'#666',
		'red',
		'green',
		'blue',
		'pink',
		'orange',
		'purple',
		'yellow',
		'teal',
		'#773b0b',
		'#2828B8',
		'#2850E0',
		'#787CF8',
		'#A00010',
		'#F80020',
		'#D07C60',
		'#F8D0B0',
	]
	let selectedColor = 'black'
	let gridSize = 30
	let height = 0
	let width = 0
	let rows = []
	let columns = []

	let data = []
	let mouseDown = false

	reset()

	function reset() {
		resetGridSize()
		data = buildRows(height)
		loaded = null
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

	function buildRows(num) {
		return [...Array(num)].map(r => buildColumns(width))
	}

	function buildColumns(num) {
		return [...Array(num)].map(c => null)
	}

	function setColor(row, column, color = selectedColor) {
		// make sure we have enough rows in data to fit the value
		if (row > data.length) {
			const rowsNeeded = height - data.length
			console.log('trying to set row ', row, ' but only have ', data.length, ' adding ' + rowsNeeded)
			data = data.concat(buildRows(rowsNeeded))
		}

		// don't need to worry about columns.. they get auto-filled with null
		data[row][column] = color
	}

	function selectColor(color) {
		selectedColor = color
	}

	function save() {
		const name = prompt('Give us a name', loaded || '')
		if (name == null || name.trim().length == 0) return

		$savedDrawings[name] = {
			name,
			gridSize,
			data,
		}
		loaded = name
	}

	function load(name) {
		let savedDrawing = JSON.parse(JSON.stringify($savedDrawings[name]))

		if (Array.isArray(savedDrawing)) {
			// migrate old format to new
			console.log('migrating old format')
			savedDrawing = {
				name,
				gridSize: 30,
				data: savedDrawing,
			}
			$savedDrawings[name] = savedDrawing
		}

		data = savedDrawing.data
		gridSize = savedDrawing.gridSize
		loaded = savedDrawing.name
		resetGridSize()
	}

	function deleteSave(name) {
		if (!confirm(`Are you sure you want to delete ${name}?`)) return

		if ($savedDrawings.hasOwnProperty(name)) {
			delete $savedDrawings[name]
			$savedDrawings = $savedDrawings
		}
	}

	function getCellColor(d, row, column) {
		return d.length > row && d[row].length > column ? d[row][column] : 'white'
	}

	function resetGridSize() {
		height = Math.floor((window.innerHeight - 200) / gridSize)
		width = Math.floor((window.innerWidth - 50) / gridSize)
		rows = [...Array(height)].map((_, i) => i)
		columns = [...Array(width)].map((_, i) => i)
	}
</script>

<style>
	.color-picker button {
		width: 30px;
	}

	.color-picker button.active {
		border-color: white;
		position: relative;
		top: 5px;
	}

	table {
		border-top: 1px solid #eee;
		border-right: 1px solid #eee;
	}

	table td {
		border-bottom: 1px solid #eee;
		border-left: 1px solid #eee;
		cursor: pointer;
	}
</style>
