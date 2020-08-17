<div class="drawing-tool">
	<LevelPreview level={{ background, thumbnail }} on:pan={onPreviewPan} />
	<div class="tool-picker">
		<div class="btn-group">
			{#each Object.keys($blockStore) as name}
				<button type="button" class="btn btn-{name == selectedBlock ? 'primary' : 'light'}" on:click={() => selectBlock(name)}>
					<Art name={$blockStore[name].graphic} />
				</button>
			{/each}
		</div>
		<!-- <div class="mt-2">
			<strong>Enemies</strong>
			{#each Object.keys($enemyStore) as name}
				<button type="button" class="btn btn-{name == selectedEnemy ? 'primary' : 'default'}" on:click={() => selectEnemy(name)}>
					<Art name={$enemyStore[name].graphicStill} />
				</button>
			{/each}
		</div> -->
	</div>

	<div
		class="level-container"
		style="background: {background}; height: {height + 20}px;"
		bind:this={levelContainer}
		on:mousedown={onMouseDown}
		on:mouseup={onMouseUp}
		on:mousemove={onMouseMove}
		on:contextmenu|preventDefault>
		<!-- same level component as actual game uses -->
		<Level {blocks} {width} {height} on:draw={onLevelDraw} />

		<!-- {#each enemies as enemy}
				<Enemy {...enemy} />
			{/each} -->
	</div>
</div>

<script>
	import Art from './Art.svelte'
	import artStore from '../../../stores/art-store'
	import blockStore from '../../../stores/block-store'
	import Enemy from '../../Play/Enemy.svelte'
	import enemyStore from '../../../stores/enemy-store'
	import Level from '../../Play/Level.svelte'
	import makeThumbnail from '../make-thumbnail'
	import LevelPreview from '../../Play/LevelPreview.svelte'

	export let background = null

	// each block passed to <Level> needs x, y, width, height, png
	export let thumbnail
	export let blocks = []
	// export let enemies = []

	$: if (blocks != null && blocks.some(b => b.png != null)) {
		blocks = blocks.map(b => {
			const { png, ...otherProps } = b
			return otherProps
		})
	}

	const blockSize = 40

	let selectedBlock = null
	let selectedEnemy = null
	let mouseDown = false

	let levelContainer
	let canvas
	const thumbnailScale = 8
	function onLevelDraw(e) {
		const canvas = e.detail
		thumbnail = makeThumbnail(canvas, width / thumbnailScale, height / thumbnailScale)
	}

	// todo let them draw higher, use wasd or arrows to navigate around level rather than scrolling
	// $: highestYUsed = blocks.length > 0 ? Math.max(...blocks.map(b => b.y + b.height)) : 0
	$: height = 600 //Math.max(400, highestYUsed + 300)

	$: highestXUsed = blocks.length > 0 ? Math.max(...blocks.map(b => b.x + b.width)) : 0
	$: width = Math.max(800, highestXUsed + 500)

	function selectBlock(name) {
		selectedEnemy = null
		selectedBlock = name
	}

	function selectEnemy(name) {
		selectedBlock = null
		selectedEnemy = name
	}

	function onPreviewPan(e) {
		const centerTargetX = e.detail * thumbnailScale
		const leftTargetX = Math.max(centerTargetX - levelContainer.clientWidth / 2, 0)
		levelContainer.scroll(leftTargetX, 0)
	}

	function onMouseDown(e) {
		// if they right click or alt click, select whatever block they're hovering over
		// if no block is there, it selects null, which makes placeBlock erase the current block
		if (e.altKey || e.button !== 0) selectedBlock = findBlockAtPosition(e)

		mouseDown = e.button === 0
		onMouseMove(e)
	}

	function onMouseMove(e) {
		if (mouseDown) {
			const { x, y } = getEventBlockPosition(e)
			placeBlock(x, y)
		}
	}

	function onMouseUp(e) {
		mouseDown = false
	}

	function findBlockAtPosition(e) {
		const { x, y } = getEventBlockPosition(e)
		const block = blocks.find(b => b.x == x && b.y == y)
		return block == null ? null : block.name
	}

	function getEventBlockPosition(e) {
		const container = e.target.closest('.level-container')
		return {
			x: Math.floor(e.offsetX / blockSize) * blockSize,
			y: Math.floor((height - e.offsetY) / blockSize) * blockSize,
		}
	}

	function placeBlock(x, y) {
		if (selectedBlock == null) return eraseBlock(x, y)

		const template = $blockStore[selectedBlock]
		// array for smaller storage
		const block = {
			name: selectedBlock,
			x,
			y,
			width: blockSize,
			height: blockSize,
		}
		// add this block, filtering out any block that used to be at the same position
		// todo: sort blocks by x asc, y desc
		blocks = [...filterBlockAtPosition(x, y), block]
	}

	function eraseBlock(x, y) {
		blocks = filterBlockAtPosition(x, y)
	}

	function filterBlockAtPosition(x, y) {
		return blocks.filter(b => b.x != x || b.y != y)
	}
</script>

<style>
	.drawing-tool {
		position: relative;
		width: 1400px;
	}

	.tool-picker {
		margin: 5px 0;
	}

	.tool-picker .btn-group {
		margin-right: 5px;
	}

	.level-container {
		overflow-x: auto;
		max-width: 100%;
	}
</style>
