<div class="drawing-tool">
	<LevelPreview level={{ background, thumbnail }} on:pan={onPreviewPan} />
	<div class="tool-picker">
		<div>
			<InputSelect
				name="selected-block"
				inline
				placeholder="Place a block"
				options={Object.values($project.blocks).sort(sortByName)}
				let:option
				valueProp="id"
				bind:value={selectedBlock}
				on:change={() => (selectedEnemy = null)}>
				<div class="flex">
					<Art id={option.graphic} simple />
					<div class="ml-1">
						<strong>{option.name}</strong>
						<div class="small">
							{option.solid ? 'solid' : 'non-physical'}
							{#if option.damage != null}, {option.damage} damage{/if}
							{#if option.throwOnTouch}, throws on touch{/if}
							{#if option.consumable}
								{#if option.healthOnConsume > 0}, {option.healthOnConsume} health on consume{/if}
								{#if option.scoreOnConsume > 0}, {option.scoreOnConsume} score on consume{/if}
								{#if option.followerOnConsume?.length}, spawns <strong>{option.followerOnConsume.map(f => $project.characters[f].name).join(', ')}</strong> followers on consume{/if}
								{#if option.enemyOnConsume?.length}, spawns <strong>{option.enemyOnConsume.map(e => $project.enemies[e].name).join(', ')}</strong> enemies on consume{/if}
							{/if}
						</div>
					</div>
				</div>
			</InputSelect>
		</div>
		<div>
			<InputSelect
				name="selected-block"
				inline
				placeholder="Place an enemy"
				options={Object.values($project.enemies).sort(sortByName)}
				let:option
				valueProp="id"
				bind:value={selectedEnemy}
				on:change={() => (selectedBlock = null)}>
				<div class="flex">
					<Art id={option.graphics.still} simple />
					<div class="ml-1">
						<strong>{option.name}</strong>
						<div class="small">
							{option.maxHealth} health,
							{option.maxVelocity} speed,
							{option.score} score,
							{option.abilities.length} abilit{option.abilities.length != 1 ? 'ies' : 'y'}
						</div>
					</div>
				</div>
			</InputSelect>
		</div>
	</div>

	<div
		class="level-container"
		style="background: {background}; height: {height + 18}px;"
		bind:this={levelContainer}
		on:mousedown={onMouseDown}
		on:mousemove={onMouseMove}
		on:contextmenu|preventDefault>
		<Level {blocks} {gridSize} {enemies} {width} {height} on:draw={onLevelDraw} />
	</div>
</div>

<svelte:window on:mouseup={onMouseUp} />

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	import Level from './Level.svelte'
	import makeThumbnail from '../services/make-thumbnail'
	import LevelPreview from './LevelPreview.svelte'
	import InputSelect from './InputSelect.svelte'
	import { gridSize } from './PhaserGame/Constants'
import { sortByName } from '../services/object-utils';

	export let background = null
	export let thumbnail
	export let blocks = []
	export let enemies = []

	let selectedBlock = null
	let selectedEnemy = null
	let mouseDown = false
	let levelContainer
	const thumbnailScale = 8

	function onLevelDraw(e) {
		const canvas = e.detail
		thumbnail = makeThumbnail(canvas, width / thumbnailScale, height / thumbnailScale)
	}

	$: highestYUsed = blocks.length > 0 ? Math.max(...blocks.map(b => b[2] + 1)) : 0
	$: height = Math.max(400, highestYUsed * gridSize + 300)

	$: highestXUsed = blocks.length > 0 ? Math.max(...blocks.map(b => b[1] + 1)) : 0
	$: width = Math.max(800, highestXUsed * gridSize + 500)

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
		const block = blocks.find(b => b[1] == x && b[2] == y)
		return block == null ? null : block[0]
	}

	function findEnemyAtPosition(e) {
		const { x, y } = getEventItemPosition(e)
		const enemy = enemies.find(e => e[1] == x && e[2] == y)
		return enemy == null ? null : enemy[0]
	}

	function getEventItemPosition(e) {
		return {
			x: Math.floor(e.offsetX / gridSize),
			y: Math.floor((height - e.offsetY) / gridSize),
		}
	}

	function placeItem(x, y) {
		if (y < 0) return

		eraseItemAt(x, y)
		if (selectedBlock != null) {
			blocks = stripOutliersAndSort([
				...blocks,
				[selectedBlock, x, y]
			])
		} else if (selectedEnemy != null) {
			enemies = stripOutliersAndSort([
				...enemies,
				[selectedEnemy, x, y]
			])
		}
	}

	function stripOutliersAndSort(a) {
		return a
			.filter(e => e[2] >= 0)
			.sort(([id1, x1, y1], [id2, x2, y2]) => {
				if (x1 > x2) return 1
				else if (x2 > x1) return -1

				if (y1 > y2) return -1
				else if (y2 > y1) return 1

				return 0
			})
	}

	function eraseItemAt(x, y) {
		blocks = blocks.filter(b => b[1] != x || b[2] != y)
		enemies = enemies.filter(e => e[1] != x || e[2] != y)
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
