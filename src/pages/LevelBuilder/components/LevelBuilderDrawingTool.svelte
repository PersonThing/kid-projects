<div class="drawing-tool">
	<div class="tool-picker">
		<strong>Blocks</strong>
		{#each Object.keys($blockStore) as name}
			<button type="button" class="btn btn-{name == selectedBlock ? 'primary' : 'default'}" on:click={() => selectBlock(name)}>
				<Art name={$blockStore[name].graphic} />
			</button>
		{/each}
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
		style="background: {background}; height: {height}px;"
		on:mousedown={onMouseDown}
		on:mouseup={onMouseUp}
		on:mousemove={onMouseMove}
		on:contextmenu|preventDefault>
		<!-- same level component as actual game uses -->
		<Level {blocks} {width} {height} />

		<!-- {#each enemies as enemy}
				<Enemy {...enemy} />
			{/each} -->
	</div>
</div>

<script>
	import Level from '../../BubTheBobcat/Level.svelte'

	import artStore from '../../../stores/art-store'
	import blockStore from '../../../stores/block-store'
	import enemyStore from '../../../stores/enemy-store'
	import Enemy from '../../BubTheBobcat/Enemy.svelte'
	import Art from './Art.svelte'

	export let background = null

	// each block passed to <Level> needs x, y, width, height, png
	export let blocks = []
	// export let enemies = []

	const blockSize = 40

	let selectedBlock = null
	let selectedEnemy = null
	let mouseDown = false

	// $: highestYUsed = blocks.length > 0 ? Math.max(...blocks.map(b => b.y + b.height)) : 0
	$: height = 800 //Math.max(400, highestYUsed + 300)

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
			y: height - Math.floor(e.offsetY / blockSize) * blockSize,
		}
	}

	function placeBlock(x, y) {
		if (selectedBlock == null) return eraseBlock(x, y)

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
	}

	.tool-picker {
		position: sticky;
		top: 0;
		left: 0;
	}

	.tool-picker .btn {
		margin-right: 0.5rem;
	}

	.level-container {
		overflow-x: auto;
	}
</style>
