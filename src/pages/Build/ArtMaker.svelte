<svelte:window on:keyup={onKeyUp} on:paste={onPaste} />

<BuildLayout tab="art" activeName={input.name} store={$project.art}>
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

			<InputSelect
				disabled={$autoSaveStore[input.name] == null}
				options={$autoSaveStore[input.name]}
				on:change={e => (input = JSON.parse(JSON.stringify(e.detail)))}
				let:option
				placeholder="Auto-saves"
				inline
				sm>
				{option.name}
				<img src={option.png} height="40" alt="" />
			</InputSelect>

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
			<canvas class="draw-canvas" bind:this={drawCanvas} />
			<canvas
				class="grid-canvas"
				bind:this={gridCanvas}
				class:paint-cursor={mode == 'paint'}
				class:fill-cursor={mode == 'fill'}
				class:erase-cursor={mode == 'erase'}
				on:mousedown|preventDefault={onDrawMouseDown}
				on:mouseup|preventDefault={onDrawMouseUp}
				on:mousemove|preventDefault={onDrawMouseMove}
				on:contextmenu|preventDefault />
			<div class="preview flex">
				<div>
					<img src={input.png} alt="preview" class="drop-shadow" width={input.width * artScale} height={input.height * artScale} />
				</div>

				<!-- if block size, show repeated in x and y-->
				{#if input.width == 20 && input.height == 20}
					<div class="ml-2">
						{#each [0, 0] as r}
							<div>
								{#each [0, 0, 0] as margin}
									<img src={input.png} alt="block repeating preview" width={input.width * artScale} height={input.height * artScale} />
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Form>

</BuildLayout>

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
	import project from '../../stores/active-project-store'
	import autoSaveStore from '../../stores/auto-save-store'
	import ColorPicker from '../../components/ColorPicker.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import Icon from 'svelte-awesome'
	import InputSelect from '../../components/InputSelect.svelte'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import validator from '../../services/validator'
	import { onMount } from 'svelte'
	import makeThumbnail from '../../services/make-thumbnail'
	import debounce from '../../services/debounce'

	export let params = {}
	let input = createDefaultInput()
	let mode = 'paint'
	let undos = []
	let redos = []
	let mouseDown = false
	let showGrid = true
	let nameField
	let savedInput
	let selectedColor = 'rgba(0, 0, 0, 255)'

	// we load the png into this canvas
	// and when user draws on the big canvas, we actually make the change on the scaled down canvas, and then re-render the larger canvas from this one
	// (if we make a change to the larger canvas, it gets blurry when scaling back down)
	const pngCanvas = document.createElement('canvas')
	const pngContext = pngCanvas.getContext('2d')
	const artScale = 2

	// we render a scaled up version to this canvas for user to interact with
	let drawCanvas
	let drawContext
	const gridSize = 20

	// we render grid lines to this canvas
	let gridCanvas
	let gridContext

	const debouncedRedraw = debounce(() => redraw(), 500)
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: inputWidth = input.width
	$: inputHeight = input.height
	$: hasChanges = input != null && !validator.equals(input, $project.art[input.name])
	$: if (inputWidth != 0 && inputHeight != 0 && showGrid != null) debouncedRedraw()

	onMount(() => redraw())

	function create() {
		console.log('create')
		input = createDefaultInput()
		redraw()
	}

	function createDefaultInput() {
		return {
			name: '',
			width: 20,
			height: 20,
			png: null,
		}
	}

	function edit(name) {
		if (!$project.art.hasOwnProperty(name)) return

		undos = []
		redos = []

		input = {
			...createDefaultInput(),
			...JSON.parse(JSON.stringify($project.art[name])),
		}
		redraw()
	}

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}

		$project.art[input.name] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/art/${encodeURIComponent(input.name)}`)
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $project.art[name]
			$project.art = $project.art
			push(`/${$project.name}/build/art/new`)
		}
	}

	function reset(undoable = true) {
		if (undoable) addUndoState()
		input.png = null
		redraw()
	}

	function onDrawMouseDown(e) {
		const { x, y } = getScaleCoordinates(e.offsetX, e.offsetY)
		const color = getColorAt(x, y)
		if (e.altKey || e.button !== 0) {
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

		const { x, y } = getScaleCoordinates(e.offsetX, e.offsetY)
		if (y != null && x != null) {
			if (mode == 'erase') setColor(x, y, 'transparent')
			else setColor(x, y, selectedColor)
		}
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

	function onPaste(e) {
		const items = (e.clipboardData || e.originalEvent.clipboardData).items
		console.log('onpaste', JSON.stringify(items)) // will give you the mime types
		for (let index in items) {
			const item = items[index]
			if (item.kind === 'file') {
				const blob = item.getAsFile()
				const reader = new FileReader()
				reader.onload = function (event) {
					console.log('onload', event.target.result)
					const image = new Image()
					image.src = event.target.result
					image.onload = () => {
						input.width = image.width
						input.height = image.height
						input.png = event.target.result
						console.log(image.width, image.height)
						redraw()
					}
				}
				// data url!
				// callback(blob)
				console.log('blob', blob)
				reader.readAsDataURL(blob)
			}
		}
	}

	function getColorAt(x, y) {
		return toRGB(pngContext.getImageData(x, y, 1, 1).data)
	}

	function getScaleCoordinates(x, y) {
		return {
			x: Math.floor(x / gridSize),
			y: Math.floor(y / gridSize),
		}
	}

	function toRGB(d) {
		return d[3] === 0 ? 'transparent' : `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`
	}

	function addUndoState() {
		undos = [...undos.slice(Math.max(undos.length - 20, 0)), input.png]

		// if we're adding a new undo state, empty redos
		redos = []

		// auto save
		// todo consider making undo/redo store local storaged?
		$autoSaveStore[input.name] = [JSON.parse(JSON.stringify(input)), ...($autoSaveStore[input.name] || []).slice(0, 10)]
		console.log('auto saved')
	}

	function undo() {
		if (undos.length == 0) return

		redos = [...redos, input.png]
		input.png = undos.pop()
		undos = undos
	}

	function redo() {
		if (redos.length == 0) return

		undos = [...undos, input.png]
		input.png = redos.pop()
		redos = redos
	}

	function setColor(x, y, color, recursing = false) {
		const oldColor = getColorAt(x, y)
		drawSquare(pngContext, x, y, 1, color)
		drawSquare(drawContext, x * gridSize, y * gridSize, gridSize, color)

		if (mode == 'fill') {
			// recursively loop around this pixel setting pixels that were the same color this one used to be to the new color
			// needs revision
			// right now it works well for filling outlines, but overfills through outlines that only touch on corners
			for (let xn = x - 1; xn <= x + 1; xn += 1) {
				for (let yn = y - 1; yn <= y + 1; yn += 1) {
					if (yn < 0 || yn > input.height - 1 || xn < 0 || xn > input.width * 1 - 1) continue
					const currentColor = getColorAt(xn, yn)
					if (currentColor == oldColor) setColor(xn, yn, color, true)
				}
			}
		}

		if (!recursing) setInputFromCanvas()
	}

	function drawSquare(context, x, y, size, color) {
		if (color == 'transparent') {
			context.clearRect(x, y, size, size)
		} else {
			context.beginPath()
			context.rect(x, y, size, size)
			context.fillStyle = color
			context.fill()
		}
	}

	function redraw() {
		if (drawCanvas == null || gridCanvas == null) return
		if (drawContext == null) drawContext = drawCanvas.getContext('2d')
		if (gridContext == null) gridContext = gridCanvas.getContext('2d')

		console.log('redrawing')
		// put source png onto scale canvas
		createMemoryImage(input.png).then(image => {
			console.log('image callback')
			// draw png onto scale canvas
			let scaleWidth = image.width
			let scaleHeight = image.height
			// if png size is exactly double input size... we're just importing old data, scale it down
			let wasOutOfScale = scaleWidth == input.width * 2 && scaleHeight == input.height * 2
			if (wasOutOfScale) {
				// should be fine...
				// use input size instead
				scaleWidth = image.width / 2
				scaleHeight = image.height / 2
			}

			pngCanvas.width = input.width
			pngCanvas.height = input.height
			pngContext.clearRect(0, 0, input.width, input.height)

			drawCanvas.width = input.width * gridSize
			drawCanvas.height = input.height * gridSize
			drawContext.clearRect(0, 0, input.width * gridSize, input.height * gridSize)

			gridCanvas.width = input.width * gridSize
			gridCanvas.height = input.height * gridSize
			gridContext.clearRect(0, 0, input.width * gridSize, input.height * gridSize)

			// draw the png full size, even if it gets cut off
			if (input.png != null) pngContext.drawImage(image, 0, 0, scaleWidth, scaleHeight)

			setInputFromCanvas()

			// loop the scaleContext, grabbing pixels to render larger on full size canvas
			for (let y = 0; y < input.height; y++) {
				for (let x = 0; x < input.width; x++) {
					let [r, g, b, a] = pngContext.getImageData(x, y, 1, 1).data
					if (a > 0) drawSquare(drawContext, x * gridSize, y * gridSize, gridSize, `rgba(${r}, ${g}, ${b}, ${a})`)
					if (showGrid) {
						gridContext.beginPath()
						gridContext.rect(x * gridSize, y * gridSize, gridSize, gridSize)
						gridContext.strokeStyle = 'rgba(255,255,255,0.5)'
						gridContext.stroke()
					}
				}
			}
		})
	}

	function flipY() {
		flipImage(false, true)
	}

	function flipX() {
		flipImage(true, false)
	}

	function moveLeft() {
		addUndoState()
		moveImage(-1, 0)
	}

	function moveRight() {
		addUndoState()
		moveImage(1, 0)
	}

	function moveUp() {
		addUndoState()
		moveImage(0, -1)
	}

	function moveDown() {
		addUndoState()
		moveImage(0, 1)
	}

	function moveImage(dx, dy) {
		setInputFromCanvas()
		createMemoryImage(input.png).then(image => {
			pngContext.clearRect(0, 0, input.width, input.height)
			pngContext.drawImage(image, dx, dy, input.width, input.height)

			// draw the pixels that were cut off on the opposite side of the canvas, cuz why not
			if (dx != 0) pngContext.drawImage(image, dx - dx * input.width, 0, input.width, input.height)
			else if (dy != 0) pngContext.drawImage(image, 0, dy - dy * input.height, input.width, input.height)
			setInputFromCanvas()
			redraw()
		})
	}

	function flipImage(flipX, flipY) {
		setInputFromCanvas()
		createMemoryImage(input.png).then(image => {
			pngContext.clearRect(0, 0, input.width, input.height)
			pngContext.scale(flipX ? -1 : 1, flipY ? -1 : 1)
			pngContext.drawImage(image, flipX ? input.width * -1 : 0, flipY ? input.height * -1 : 0, input.width, input.height)
			setInputFromCanvas()
			redraw()
		})
	}

	function setInputFromCanvas() {
		input.png = pngCanvas.toDataURL('image/png')
		console.log(input.png)
	}

	function createMemoryImage(png) {
		if (png == null) return Promise.resolve({ width: input.width, height: input.height })
		return new Promise((resolve, reject) => {
			const image = new Image()
			image.src = input.png
			image.onload = () => resolve(image)
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
