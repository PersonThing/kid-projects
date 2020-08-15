<div class="tool-picker">
	<strong>Blocks</strong>
	{#each Object.keys($blockStore) as name}
		<button class="btn btn-{name == selectedBlock ? 'primary' : 'default'}" on:click={() => selectBlock(name)}>
			<CustomGraphic graphic={$artStore[$blockStore[name].graphic]} />
		</button>
	{/each}
	<!-- <div class="mt-2">
		<strong>Enemies</strong>
		{#each Object.keys($enemyStore) as name}
			<button class="btn btn-{name == selectedEnemy ? 'primary' : 'default'}" on:click={() => selectEnemy(name)}>
				<CustomGraphic graphic={$artStore[$enemyStore[name].graphicStill]} />
			</button>
		{/each}
	</div> -->
</div>

<div class="level-container" style="background: {background};">
	<div class="level-overlay" on:mousedown={onMouseDown} on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:contextmenu|preventDefault />
	<!-- same level component as actual game uses -->
	<Level {blocks} {width} {height} />

	<!-- {#each enemies as enemy}
				<Enemy {...enemy} />
			{/each} -->
</div>

<script>
	import Level from '../../BubTheBobcat/Level.svelte'

	import artStore from '../../../stores/art-store'
	import blockStore from '../../../stores/block-store'
	import enemyStore from '../../../stores/enemy-store'
	import Enemy from '../../BubTheBobcat/Enemy.svelte'
	import CustomGraphic from './CustomGraphic.svelte'

	export let background = null

	// each block passed to <Level> needs x, y, width, height, png
	export let blocks = []
	export let enemies = []

	const blockSize = 40

	let selectedBlock = null
	let selectedEnemy = null
	let mouseDown = false

	// make level viewer at least 100px higher and wider than any block is placed
	$: highestBlockY = Math.max(...blocks.map(b => b.y + b.height))
	$: height = 400 //highestBlockY > 400 ? highestBlockY + 100 : 400
	// $: console.log(height)

	$: highestBlockX = Math.max(...blocks.map(b => b.x + b.width))
	$: width = 800 // blocks.length > 0 ? highestBlockX + 100 : 400

	function selectBlock(name) {
		selectedEnemy = null
		selectedBlock = name
	}

	function selectEnemy(name) {
		selectedBlock = null
		selectedEnemy = name
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
		return {
			x: Math.floor(e.offsetX / blockSize) * blockSize,
			y: Math.floor(e.offsetY / blockSize) * blockSize,
		}
	}

	function placeBlock(x, y) {
		if (selectedBlock == null) {
			eraseBlock(x, y)
			return
		}

		const block = {
			x,
			y,
			width: blockSize,
			height: blockSize,
			name: selectedBlock,
			png: $artStore[$blockStore[selectedBlock].graphic].png,
		}
		// add this block, filtering out any block that used to be at the same position
		// todo: sort blocks by x asc, y desc
		blocks = [...getBlocksNotAtPosition(x, y), block]
	}

	function eraseBlock(x, y) {
		blocks = getBlocksNotAtPosition(x, y)
	}

	function getBlocksNotAtPosition(x, y) {
		return blocks.filter(b => b.x != x || b.y != y)
	}
</script>

<style>
	.tool-picker .btn {
		margin-right: 0.5rem;
	}

	.level-container {
		position: relative;
		height: 400px;
		overflow: auto;
	}

	.level-overlay {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		/* border: 1px solid blue; */
	}

	:global(canvas) {
		/* border: 1px solid red; */
	}
</style>
