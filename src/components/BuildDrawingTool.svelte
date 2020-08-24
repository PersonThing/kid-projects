<div class="drawing-tool">
	<LevelPreview level={{ background, thumbnail }} on:pan={onPreviewPan} />
	<div class="tool-picker">
		<div>
			<InputSelect
				name="selected-block"
				inline
				placeholder="Place a block"
				options={Object.keys($project.blocks).map(name => $project.blocks[name])}
				let:option
				valueProp="name"
				bind:value={selectedBlock}
				on:change={() => (selectedEnemy = null)}>
				<Art name={$project.blocks[option.name].graphic} simple />
				{option.name}: {option.damage} damage, {option.solid ? 'solid' : 'background'}, {option.consumable ? 'consumable for ' + option.healthOnConsume + ' health, ' + option.healthOnConsume + ' score' : ''}
			</InputSelect>
		</div>
		<div>
			<InputSelect
				name="selected-block"
				inline
				placeholder="Place an enemy"
				options={Object.keys($project.enemies).map(name => $project.enemies[name])}
				let:option
				valueProp="name"
				bind:value={selectedEnemy}
				on:change={() => (selectedBlock = null)}>
				<Art name={$project.enemies[option.name].graphics.still} simple />
				<strong>{option.name}</strong>
				{option.damage} damage, {option.maxHealth} health, {option.maxVelocity} speed, {option.score} score
			</InputSelect>
		</div>
	</div>

	<div
		class="level-container"
		style="background: {background}; height: {height + 18}px;"
		bind:this={levelContainer}
		on:mousedown={onMouseDown}
		on:mouseup={onMouseUp}
		on:mousemove={onMouseMove}
		on:contextmenu|preventDefault>
		<Level {blocks} {enemies} {width} {height} on:draw={onLevelDraw} />
	</div>
</div>

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	import Level from './Level.svelte'
	import makeThumbnail from '../services/make-thumbnail'
	import LevelPreview from './LevelPreview.svelte'
	import InputSelect from './InputSelect.svelte'

	export let background = null

	// each block passed to <Level> needs x, y, width, height, png
	export let thumbnail
	export let blocks = []
	export let enemies = []

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
		selectedBlock = name
		selectedEnemy = null
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
		if (e.altKey || e.button !== 0) {
			selectedBlock = findBlockAtPosition(e)
			selectedEnemy = findEnemyAtPosition(e)
		}

		mouseDown = e.button === 0
		onMouseMove(e)
	}

	function onMouseMove(e) {
		if (mouseDown) {
			const { x, y } = getEventItemPosition(e)
			placeItem(x, y)
		}
	}

	function onMouseUp(e) {
		mouseDown = false
	}

	function findBlockAtPosition(e) {
		const { x, y } = getEventItemPosition(e)
		const block = blocks.find(b => b.x == x && b.y == y)
		return block == null ? null : block.name
	}

	function findEnemyAtPosition(e) {
		const { x, y } = getEventItemPosition(e)
		const enemy = enemies.find(e => e.x == x && e.y == y)
		return enemy == null ? null : enemy.name
	}

	function getEventItemPosition(e) {
		return {
			x: Math.floor(e.offsetX / blockSize) * blockSize,
			y: Math.floor((height - e.offsetY) / blockSize) * blockSize,
		}
	}

	function placeItem(x, y) {
		eraseItemAt(x, y)
		if (selectedBlock != null) {
			const template = $project.blocks[selectedBlock]
			blocks = [
				...blocks,
				{
					name: selectedBlock,
					x,
					y,
					width: blockSize,
					height: blockSize,
				},
			]
		} else if (selectedEnemy != null) {
			const template = $project.enemies[selectedEnemy]
			enemies = [
				...enemies,
				{
					name: selectedEnemy,
					x,
					y,
					width: template.width,
					height: template.height,
				},
			]
		}
	}

	function eraseItemAt(x, y) {
		blocks = blocks.filter(b => b.x != x || b.y != y)
		enemies = enemies.filter(e => e.x != x || e.y != y)
	}

	function hydrateEnemy(enemy) {
		const template = $project.enemies[enemy.name]
		return {
			...template,
			...enemy,
		}
	}
</script>

<style>
	.drawing-tool {
		position: relative;
		width: 1400px;
	}

	.tool-picker {
		margin: 5px 0;
		display: flex;
		flex-direction: row;
		align-items: top;
	}
	.tool-picker > div {
		display: flex;
		flex-direction: column;
	}

	.level-container {
		overflow-x: auto;
		max-width: 100%;
	}
</style>
