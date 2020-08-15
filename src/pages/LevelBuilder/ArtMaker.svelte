<svelte:window on:keyup={onKeyUp} />

<LevelBuilderLayout tab="art">
	{#if savedNames.length}
		<div>
			{#each savedNames as savedDrawingName}
				<div class="btn-group mr-2">
					<button
						type="button"
						class="btn btn-sm btn-{savedDrawingName == loaded ? 'primary active' : 'secondary'}"
						on:click={() => load(savedDrawingName)}>
						{savedDrawingName}
					</button>
					<button type="button" class="btn btn-sm btn-secondary" on:click={() => deleteSave(savedDrawingName)}>x</button>
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex">
		<button type="button" class="btn btn-success btn-sm mr-2" on:click={() => save()}>Save</button>
		<button type="button" class="btn btn-secondary btn-sm" on:click={reset}>Reset</button>

		<div class="btn-group">
			<button type="button" disabled={undos.length == 0} class="btn btn-default btn-sm" on:click={undo}>Undo {undos.length}</button>
			<button type="button" disabled={redos.length == 0} class="btn btn-default btn-sm" on:click={redo}>Redo {redos.length}</button>
		</div>

		<div>
			Grid size
			<input type="number" bind:value={gridSize} min="15" max="50" step="5" />
		</div>
		<div>
			Height
			<input type="number" bind:value={height} placeholder="Height" />
		</div>
		<div>
			Width
			<input type="number" bind:value={width} placeholder="Width" />
		</div>
		<label>
			<input type="checkbox" bind:checked={showGrid} />
			Show grid
		</label>
	</div>

	<div class="flex align-top">
		<div class="controls">
			<div class="color-picker">
				{#each colors as color}
					<button
						type="button"
						style="background: {color != 'transparent' ? color : 'linear-gradient(110deg, rgba(200,200,200,1) 45%, rgba(255,255,255,1) 55%, rgba(255,255,255,1) 100%)'}"
						class:active={color == selectedColor}
						on:click={() => selectColor(color)} />
				{/each}
			</div>
		</div>
		<div class="flex-grow ">
			<div>
				Preview at in-game size / repeated next to same graphic:
				<div class="p-3 preview-bg">
					{#each [20, 0, 0, 0, 0] as margin}
						<img src={previewPNG} alt="" style="margin-right: {margin}px;" />
					{/each}
				</div>
			</div>
			<svg
				class="preview-bg"
				width={width * (gridSize + 1)}
				height={height * (gridSize + 1)}
				on:mousedown={onSvgMouseDown}
				on:mouseup={onSvgMouseUp}
				on:contextmenu|preventDefault
				on:mousemove={e => onSvgMouseMove(e.target)}>
				{#each rows as row}
					{#each columns as column}
						<rect
							y={row * gridSize}
							x={column * gridSize}
							style="fill: {getCellColor(data, row, column)}"
							width={gridSize}
							height={gridSize}
							data-row={row}
							data-column={column}
							stroke={showGrid ? '#eee' : null} />
					{/each}
				{/each}
			</svg>
		</div>
	</div>

</LevelBuilderLayout>

<script>
	import LevelBuilderLayout from './components/LevelBuilderLayout.svelte'
	import LocalStorageStore from '../../stores/local-storage-store'
	import toPNG from './to-png'

	const artStore = LocalStorageStore('pixel-drawings', {})
	$: savedNames = Object.keys($artStore)

	$: previewPNG = toPNG(data, width, height)

	let loaded = null
	const colors = [
		'transparent',
		'white',
		'rgb(204, 204, 204)',
		'rgb(160, 164, 160)',
		'rgb(102, 102, 102)',
		'rgb(51, 51, 51)',
		'black',
		'rgb(119, 59, 11)',
		'blue',
		'pink',
		'yellow',
		'orange',
		'red',
		'purple',
		'teal',
		'green',
		'rgb(40, 40, 184)',
		'rgb(40, 80, 224)',
		'rgb(80, 80, 248)',
		'rgb(120, 124, 248)',
		'rgb(160, 0, 16)',
		'rgb(248, 0, 32)',
		'rgb(208, 124, 96)',
		'rgb(248, 208, 176)',

		'red',
		// bub colors
		'rgb(253, 240, 232)',
		'rgb(245, 222, 208)',
		'rgb(220, 201, 187)',
		'rgb(197, 179, 167)',
		'rgb(186, 167, 153)',
		'rgb(146, 129, 119)',
		'rgb(120, 107, 99)',
		'rgb(80, 68, 68)',

		// eyes
		'rgb(122, 80, 55)',
		'rgb(178, 105, 58)',
		'rgb(203, 140, 97)',
		'rgb(238, 187, 155)',

		// ears & nose
		'rgb(75, 53, 39)',

		// 'white',
		// '#ccc',
		// '#A0A4A0',
		// '#666',
		// '#333',
		// 'black',
		// '#773b0b',
		// 'blue',
		// 'pink',
		// 'yellow',
		// 'orange',
		// 'red',
		// 'purple',
		// 'teal',
		// 'green',
		// '#2828B8',
		// '#2850E0',
		// '#5050F8',
		// '#787CF8',
		// '#A00010',
		// '#F80020',
		// '#D07C60',
		// '#F8D0B0',
	]
	let selectedColor = 'black'
	let gridSize = 25
	let height = 20
	let width = 20
	let undos = []
	let redos = []
	let showGrid = true

	$: rows = [...Array(height)].map((_, i) => i)
	$: columns = [...Array(width)].map((_, i) => i)

	let data = []
	let mouseDown = false

	reset(false)

	function reset(undoable = true) {
		if (undoable) addUndoState()
		data = buildRows(height)
		loaded = null
	}

	function onSvgMouseDown(e) {
		if (e.altKey || e.button !== 0) {
			selectedColor = e.target.style.fill
		} else {
			addUndoState()
			mouseDown = true
			onSvgMouseMove(e.target)
		}
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
		undos = [...undos.slice(Math.max(undos.length - 20, 0)), JSON.stringify(data)]

		// if we're adding a new undo state, empty redos
		redos = []
	}

	function buildRows(num) {
		return [...Array(num)].map(r => buildColumns(width))
	}

	function buildColumns(num) {
		return [...Array(num)].map(c => 'transparent')
	}

	function undo() {
		if (undos.length == 0) return

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

		$artStore[name] = {
			name,
			gridSize,
			width,
			height,
			data,
			showGrid,
			png: toPNG(data, width, height),
		}
		loaded = name
	}

	function load(name) {
		let savedDrawing = JSON.parse(JSON.stringify($artStore[name]))

		data = savedDrawing.data
		gridSize = savedDrawing.gridSize
		width = savedDrawing.width || savedDrawing.data[0].length
		height = savedDrawing.height || savedDrawing.data.length
		showGrid = savedDrawing.showGrid || showGrid
		undos = []
		redos = []
		loaded = name
	}

	function deleteSave(name) {
		if (!confirm(`Are you sure you want to delete ${name}?`)) return

		if ($artStore.hasOwnProperty(name)) {
			delete $artStore[name]
			$artStore = $artStore
		}
	}

	function getCellColor(d, row, column) {
		return d.length > row && d[row].length > column ? d[row][column] : 'white'
	}

	function onKeyUp(e) {
		switch (e.code) {
			case 'KeyZ':
				if (e.ctrlKey) undo()
				break
			case 'KeyY':
				if (e.ctrlKey) redo()
				break
		}
	}
</script>

<style>
	.color-picker button {
		display: block;
		width: 40px;
		height: 25px;
		margin-bottom: 0;
		border: none;
		border: 1px solid #eee;
	}
	.color-picker button:focus {
		outline: none;
		border: 1px solid #eee;
	}

	.color-picker button.active {
		width: 50px;
	}

	svg {
		fill: #fff;
		padding: 5px;
	}

	.flex input[type='number'] {
		width: 50px;
	}

	.preview-bg {
		background: rgb(135, 206, 235);
	}
</style>
