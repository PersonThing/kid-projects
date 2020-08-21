<svelte:window on:keyup={onKeyUp} />

<LevelBuilderLayout tab="art" activeName={input.name} store={$artStore}>
	<Form on:submit={save} {hasChanges}>
		<span slot="buttons" class="flex">
			<input type="text" class="form-control width-auto" id="name" name="name" bind:value={input.name} bind:this={nameField} />

			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>

		<div class="toolbar flex align-center">
			<ColorPicker bind:value={selectedColor} on:change={() => (mode = mode == 'erase' ? 'paint' : mode)} />

			<div class="btn-group">
				<button type="button" class="btn btn-sm btn-{mode == 'paint' ? 'primary' : 'light'}" on:click={() => (mode = 'paint')} title="Paint brush">
					<Icon data={paintIcon} />
				</button>
				<button type="button" class="btn btn-sm btn-{mode == 'fill' ? 'primary' : 'light'}" on:click={() => (mode = 'fill')} title="Paint bucket">
					<Icon data={fillIcon} />
				</button>
				<button type="button" class="btn btn-sm btn-{mode == 'erase' ? 'primary' : 'light'}" on:click={() => (mode = 'erase')} title="Eraser">
					<Icon data={eraseIcon} />
				</button>
			</div>

			<button type="button" class="btn btn-light btn-sm mr1" on:click={reset}>Start over</button>

			{#if $autoSaveStore[input.name] != null}
				<InputSelect
					options={$autoSaveStore[input.name]}
					on:change={e => (input = JSON.parse(JSON.stringify(e.detail)))}
					let:option
					placeholder="Auto-saves"
					inline
					sm>
					{option.name}
					<img src={toPNG(option.data, option.width, option.height)} height="40" />
				</InputSelect>
			{/if}

			<div class="btn-group">
				<button type="button" disabled={undos.length == 0} class="btn btn-default btn-sm" on:click={undo}>
					<Icon data={undoIcon} />
					{undos.length > 0 ? undos.length : ''}
				</button>
				<button type="button" disabled={redos.length == 0} class="btn btn-default btn-sm" on:click={redo}>
					<Icon data={undoIcon} flip="horizontal" />
					{redos.length > 0 ? redos.length : ''}
				</button>
			</div>

			<div class="btn-group">
				<button type="button" class="btn btn-light btn-sm" on:click={flipX} title="Flip horizontal">
					<Icon data={flipIcon} />
				</button>
				<button type="button" class="btn btn-light btn-sm" on:click={flipY} title="Flip vertical">
					<Icon data={flipIcon} style="transform: rotate(90deg);" />
				</button>
			</div>

			<div class="btn-group">
				<button type="button" class="btn btn-light btn-sm" on:click={moveLeft} title="Move left">
					<Icon data={arrowLeftIcon} />
				</button>
				<button type="button" class="btn btn-light btn-sm" on:click={moveRight} title="Move right">
					<Icon data={arrowRightIcon} />
				</button>
				<button type="button" class="btn btn-light btn-sm" on:click={moveUp} title="Move up">
					<Icon data={arrowUpIcon} />
				</button>
				<button type="button" class="btn btn-light btn-sm" on:click={moveDown} title="Move down">
					<Icon data={arrowDownIcon} />
				</button>
			</div>

			<div class="flex-column">
				Height
				<input type="number" bind:value={input.height} placeholder="Height" />
			</div>
			<div class="flex-column">
				Width
				<input type="number" bind:value={input.width} placeholder="Width" />
			</div>
			<label>
				<input type="checkbox" bind:checked={showGrid} />
				Show grid
			</label>
		</div>

		<div class="canvas-container">
			<canvas class="draw-canvas" bind:this={drawCanvas} width={input.width * gridSize} height={input.height * gridSize} />
			<canvas
				class="grid-canvas"
				bind:this={gridCanvas}
				class:paint-cursor={mode == 'paint'}
				class:fill-cursor={mode == 'fill'}
				class:erase-cursor={mode == 'erase'}
				width={input.width * gridSize}
				height={input.height * gridSize}
				on:mousedown|preventDefault={onDrawMouseDown}
				on:mouseup|preventDefault={onDrawMouseUp}
				on:mousemove|preventDefault={onDrawMouseMove}
				on:contextmenu|preventDefault />
			<div class="preview flex">
				<div>
					<img src={previewPNG} alt="preview" class="drop-shadow" />
				</div>

				<!-- if block size, show repeated in x and y-->
				{#if input.width == 20 && input.height == 20}
					<div class="ml-2">
						{#each [0, 0] as r}
							<div>
								{#each [0, 0, 0] as margin}
									<img src={previewPNG} alt="block repeating preview" />
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Form>

</LevelBuilderLayout>

<script>
	import {
		arrowLeft as arrowLeftIcon,
		arrowRight as arrowRightIcon,
		arrowUp as arrowUpIcon,
		arrowDown as arrowDownIcon,
		undo as undoIcon,
		paintBrush as paintBrushIcon,
		eraser as eraseIcon,
	} from 'svelte-awesome/icons'
	import { faFillDrip as fillIcon, faPaintBrush as paintIcon, faExchangeAlt as flipIcon } from '@fortawesome/free-solid-svg-icons'
	import { push } from 'svelte-spa-router'
	import artStore from '../../stores/art-store'
	import autoSaveStore from '../../stores/auto-save-store'
	import ColorPicker from '../../components/ColorPicker.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import Icon from 'svelte-awesome'
	import InputSelect from '../../components/InputSelect.svelte'
	import LevelBuilderLayout from '../../components/LevelBuilderLayout.svelte'
	import toPNG from '../../services/to-png'
	import validator from '../../services/validator'

	export let params = {}
	let input
	create()

	let mode = 'paint'
	let drawCanvas
	let drawContext
	let gridCanvas
	let gridContext
	let gridSize = 20
	let undos = []
	let redos = []
	let mouseDown = false
	let showGrid = true
	let nameField
	let savedInput
	let selectedColor = 'rgba(0, 0, 0, 255)'

	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: previewPNG = toPNG(input.data, input.width, input.height)
	$: drawResult = draw(input.data, input.width, input.height)
	$: if (input.width != 0 && input.height != 0 && showGrid != null) redraw()
	$: hasChanges = input != null && !validator.equals(input, $artStore[input.name])

	function create() {
		input = {
			name: '',
			width: 20,
			height: 20,
			data: buildData(20, 20),
		}
		setTimeout(() => {
			nameField.focus()
		}, 100)
	}

	function edit(name) {
		if (!$artStore.hasOwnProperty(name)) return

		undos = []
		redos = []

		input = JSON.parse(JSON.stringify($artStore[name]))
		input.width = input.width || input.data[0].length
		input.height = input.height || input.data.length

		redraw()
	}

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}

		input.png = toPNG(input.data, input.width, input.height)

		$artStore[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/art/${encodeURIComponent(input.name)}`)
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $artStore[name]
			$artStore = $artStore
			push('/level-builder/art/new')
		}
	}

	function reset(undoable = true) {
		if (undoable) addUndoState()
		input.data = buildData(input.height, input.width)
	}

	function draw(d, w, h) {
		if (d == null || drawCanvas == null || gridCanvas == null) return
		if (drawContext == null) drawContext = drawCanvas.getContext('2d')
		if (gridContext == null) gridContext = gridCanvas.getContext('2d')

		drawContext.clearRect(0, 0, w * gridSize, h * gridSize)
		gridContext.clearRect(0, 0, w * gridSize, h * gridSize)

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				drawContext.beginPath()
				drawContext.rect(x * gridSize, y * gridSize, gridSize, gridSize)
				drawContext.fillStyle = getCellColor(d, y, x)
				drawContext.fill()

				if (showGrid) {
					gridContext.beginPath()
					gridContext.rect(x * gridSize, y * gridSize, gridSize, gridSize)
					gridContext.strokeStyle = 'rgba(255,255,255,0.5)'
					gridContext.stroke()
				}
			}
		}
	}

	function redraw() {
		setTimeout(() => draw(input.data, input.width, input.height, gridSize), 10)
	}

	function onDrawMouseDown(e) {
		const color = getColorAtEvent(e)
		if (e.altKey || e.button !== 0) {
			// console.log(drawContext.getImageData(e.offsetX, e.offsetY, 1, 1))
			if (color == 'transparent') {
				mode = 'erase'
				selectedColor = 'transparent'
			} else {
				mode = 'paint'
				selectedColor = color
			}
		} else {
			addUndoState()
			mouseDown = true
			onDrawMouseMove(e)
		}
	}

	function onDrawMouseUp(e) {
		mouseDown = false
	}

	function onDrawMouseMove(e) {
		if (!mouseDown) return
		const { x, y } = getEventCellIndexes(e)
		if (y != null && x != null) {
			if (mode == 'erase') setColor(y, x, 'transparent')
			else setColor(y, x, selectedColor)
		}
	}

	function getEventCellIndexes(e) {
		return {
			x: Math.floor(e.offsetX / gridSize),
			y: Math.floor(e.offsetY / gridSize),
		}
	}

	function getColorAtEvent(e) {
		return toRGB(drawContext.getImageData(e.offsetX, e.offsetY, 1, 1).data)
	}

	function toRGB(d) {
		return d[3] === 0 ? 'transparent' : `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`
	}
	// 	// could probably get this directly from canvas / getPixel stuff
	// 	const { x, y } = getEventCellIndexes(e)
	// 	return input.data[y][x] || 'transparent'
	// }

	function addUndoState() {
		undos = [...undos.slice(Math.max(undos.length - 20, 0)), JSON.stringify(input.data)]

		// if we're adding a new undo state, empty redos
		redos = []

		// auto save
		// todo consider making undo/redo store local storaged?
		$autoSaveStore[input.name] = [JSON.parse(JSON.stringify(input)), ...($autoSaveStore[input.name] || []).slice(0, 10)]
		console.log('auto saved')
	}

	function buildData(height, width) {
		return [...Array(height)].map(r => buildColumns(width))
	}

	function buildColumns(width) {
		return [...Array(width)].map(c => 'transparent')
	}

	function undo() {
		if (undos.length == 0) return

		redos = [...redos, JSON.stringify(input.data)]
		input.data = JSON.parse(undos.pop())
		undos = undos
	}

	function redo() {
		if (redos.length == 0) return

		undos = [...undos, JSON.stringify(input.data)]
		input.data = JSON.parse(redos.pop())
		redos = redos
	}

	function setColor(y, x, color) {
		syncDataToSize()

		// don't need to worry about columns.. they get auto-filled with null
		const oldColor = input.data[y][x] || 'transparent'
		input.data[y][x] = color

		if (mode == 'fill') {
			// recursively loop around this pixel setting pixels that were the same color this one used to be to the new color
			// needs revision
			// right now it works well for filling outlines, but overfills through outlines that only touch on corners
			for (let yn = y - 1; yn <= y + 1; yn++) {
				for (let xn = x - 1; xn <= x + 1; xn++) {
					if (yn < 0 || yn > input.height - 1 || xn < 0 || xn > input.width - 1) continue
					const currentColor = input.data[yn][xn] || 'transparent'
					if (currentColor == oldColor) setColor(yn, xn, color)
				}
			}
		}
	}

	function getCellColor(d, row, column) {
		return d.length > row && d[row].length > column ? d[row][column] || 'transparent' : 'white'
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

	function flipY() {
		input.data = input.data.slice(0, input.height).reverse()
	}

	function flipX() {
		input.data = input.data.map(d => d.slice(0, input.width).reverse())
	}

	function moveLeft() {
		addUndoState()
		syncDataToSize()
		input.data = input.data.map(row => {
			const firstCol = row.shift()
			return [...row, firstCol]
		})
	}

	function moveRight() {
		addUndoState()
		syncDataToSize()
		input.data = input.data.map(row => {
			const lastCol = row.pop()
			return [lastCol, ...row]
		})
	}

	function moveUp() {
		addUndoState()
		syncDataToSize()
		const firstRow = input.data.shift()
		input.data = [...input.data, firstRow]
	}

	function moveDown() {
		addUndoState()
		syncDataToSize()
		const lastRow = input.data.pop()
		input.data = [lastRow, ...input.data]
	}

	function syncDataToSize() {
		if (input.height > input.data.length) {
			// add empty rows
			const rowsNeeded = input.height - input.data.length
			input.data = input.data.concat(buildData(rowsNeeded, input.width))
			// } else if (input.height < input.data.length) {
			// 	// crop unnecessary rows
			// 	input.data.slice(0, input.height)
		}

		// make sure all rows are the right length
		input.data = input.data.map(row => {
			if (input.width > row.length) {
				const colsNeeded = input.width - row.length
				row = row.concat(buildColumns(colsNeeded))
				// } else if (input.width < row.length) {
				// 	row.slice(0, input.width)
			}
			return row
		})
	}
</script>

<style lang="scss">
	@import '../../css/variables';
	.flex input[type='number'] {
		width: 50px;
	}

	.canvas-container {
		display: flex;
		position: relative;
		margin: 15px 0;
		align-items: flex-start;

		.grid-canvas {
			position: absolute;
			left: 0;
			top: 0;
		}

		.draw-canvas {
			background: repeating-linear-gradient(-45deg, transparent, #eee 10px);
			@include med-box-shadow();
		}
	}

	canvas:last-child {
		display: block;
	}

	.preview {
		margin-left: 10px;
	}

	.header-controls {
		display: flex;
		flex-direction: row;
	}

	.width-auto {
		width: auto;
	}

	.flex .btn-group {
		margin-left: 5px;
	}
	.flex .btn-group,
	.flex input {
		margin-right: 5px;
	}

	.toolbar {
		font-size: 14px;

		.flex-column {
			margin-right: 5px;
		}
	}

	.paint-cursor {
		cursor: url(/paint-icon.png) 0 20, url(/kid-projects/public/paint-icon.png) 0 20, auto;
	}
	.fill-cursor {
		cursor: url(/fill-icon.png) 20 20, url(/kid-projects/public/fill-icon.png) 20 20, auto;
	}
	.erase-cursor {
		cursor: url(/erase-icon.png) 0 20, url(/kid-projects/public/erase-icon.png) 0 20, auto;
	}
</style>
