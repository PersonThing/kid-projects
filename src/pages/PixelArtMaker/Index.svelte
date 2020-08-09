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
	<input type="number" bind:value={gridSize} min="15" max="50" step="5" />
	<input type="number" bind:value={width} placeholder="Width" />
	<input type="number" bind:value={height} placeholder="Height" />
</div>

<div class="btn-toolbar">
	<div class="btn-group">
		<button class="btn btn-danger btn-sm" on:click={reset}>Reset</button>
		<button class="btn btn-primary btn-sm mr-2" on:click={() => save()}>Save</button>
	</div>

	<div class="btn-group">
		<button disabled={undos.length == 0} class="btn btn-default btn-sm" on:click={undo}>Undo {undos.length}</button>
		<button disabled={redos.length == 0} class="btn btn-default btn-sm" on:click={redo}>Redo {redos.length}</button>
	</div>

	<div class="btn-group color-picker">
		{#each colors as color}
			<button style="background-color: {color}" class:active={color == selectedColor} on:click={() => selectColor(color)} />
		{/each}
	</div>
</div>

<svg
	width={width * (gridSize + 2)}
	height={height * (gridSize + 2)}
	on:mousedown={onSvgMouseDown}
	on:mouseup={onSvgMouseUp}
	on:mousemove={e => onSvgMouseMove(e.target)}>
	{#each rows as row}
		{#each columns as column}
			<rect
				y={row * gridSize}
				x={column * gridSize}
				fill={getCellColor(data, row, column)}
				width={gridSize}
				height={gridSize}
				data-row={row}
				data-column={column} />
		{/each}
	{/each}
</svg>

<script>
	import LocalStorageStore from '../../stores/local-storage-store'

	const savedDrawings = LocalStorageStore('pixel-drawings', {})
	$: savedNames = Object.keys($savedDrawings)

	let loaded = null
	const colors = [
		'white',
		'#A0A4A0',
		'#666',
		'#333',
		'black',
		'#773b0b',
		'blue',
		'pink',
		'yellow',
		'orange',
		'red',
		'purple',
		'teal',
		'green',
		'#2828B8',
		'#2850E0',
		'#5050F8',
		'#787CF8',
		'#A00010',
		'#F80020',
		'#D07C60',
		'#F8D0B0',
	]
	let selectedColor = 'black'
	let gridSize = 30
	let height = 30
	let width = 30
	let undos = []
	let redos = []

	$: rows = [...Array(height)].map((_, i) => i)
	$: columns = [...Array(width)].map((_, i) => i)

	let data = []
	let mouseDown = false

	reset()

	function reset() {
		addUndoState()
		data = buildRows(height)
		loaded = null
	}

	function onSvgMouseDown(e) {
		addUndoState()
		mouseDown = true
		onSvgMouseMove(e.target)
	}

	function onSvgMouseUp(e) {
		mouseDown = false
	}

	function onSvgMouseMove(target) {
		if (!mouseDown) return

		const row = target.dataset.row
		const column = target.dataset.column
		if (row != null && column != null) {
			setColor(row, column)
		}
	}

	function addUndoState() {
		undos = [...undos, JSON.stringify(data)]
		// if we're adding a new undo state, empty redos
		redos = []
	}

	function buildRows(num) {
		return [...Array(num)].map(r => buildColumns(width))
	}

	function buildColumns(num) {
		return [...Array(num)].map(c => null)
	}

	function undo() {
		redos = [...redos, JSON.stringify(data)]
		data = JSON.parse(undos.pop())
		undos = undos
	}

	function redo() {
		if (redos.length == 0) return

		undos = [...undos, JSON.stringify(data)]
		data = JSON.parse(redos.pop())
		redos = redos
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
			width,
			height,
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
				width: 50,
				height: 40,
				data: savedDrawing,
			}
			$savedDrawings[name] = savedDrawing
		}

		data = savedDrawing.data
		gridSize = savedDrawing.gridSize
		width = savedDrawing.width || savedDrawing.data[0].length
		height = savedDrawing.height || savedDrawing.data.length
		undos = []
		redos = []
		loaded = savedDrawing.name
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

	svg {
		fill: #fff;
		padding: 5px;
	}

	svg rect {
		stroke: #eee;
	}
</style>
