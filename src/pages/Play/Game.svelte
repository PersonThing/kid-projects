<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<div class="game-window" bind:this={mainEl}>
	{#if level != null && player != null}
		{#if gameOver}
			<GameOver {score} {player} won={gameWon} {level} />
		{:else if paused}
			<Paused />
		{/if}
		<Viewport {...viewport} background={level.background}>
			<Level {blocks} width={levelWidth} height={levelHeight} playing />
			{#each enemies as enemy}
				<LivingSprite {...enemy} {frame} />
			{/each}
			<LivingSprite {...player} {frame} />
		</Viewport>
	{/if}
	<Status {level} {score} enemyCount={(enemies || []).filter(e => e.alive).length} />
	<Instructions />
</div>

<script>
	import { onMount, onDestroy } from 'svelte'
	import Status from './Status.svelte'
	import Level from './Level.svelte'
	import Instructions from './Instructions.svelte'
	import Viewport from './Viewport.svelte'
	import LivingSprite from './LivingSprite.svelte'
	import HealthBar from './HealthBar.svelte'
	import GameOver from './GameOver.svelte'
	import Paused from './Paused.svelte'
	import { doObjectsIntersect, isAAboveB, doObjectsIntersectY, doObjectsIntersectYExclusive } from './spatial-functions'
	import CreateEnemy from './enemies'

	import artStore from '../../stores/art-store'
	import blockStore from '../../stores/block-store'
	import enemyStore from '../../stores/enemy-store'

	export let level = null
	export let character = null

	const artScale = 2
	const startOfLevel = 0
	let endOfLevel
	const blockSize = 40
	let blocks
	let effectBlocks
	let levelWidth = 0
	let levelHeight = 0

	let score = 0

	let mainEl
	let player
	let enemies
	let frame = 0
	let gameOver = false
	let gameWon = false
	let paused = false

	let gameAlive = true
	let lastRequestedFrame = null

	let visibleBlocks
	let viewport = {
		width: window.innerWidth,
		height: 600,
	}

	let leftDown = false
	let rightDown = false

	onMount(() => {
		// sort blocks by x, then y
		blocks = level.blocks
			.sort((a, b) => {
				if (a.x > b.x) return 1
				else if (b.x > a.x) return -1

				if (a.y > b.y) return -1
				else if (b.y > a.y) return 1

				return 0
			})
			.map(b => ({
				...b,
				solid: $blockStore[b.name].solid,
				png: $artStore[$blockStore[b.name].graphic].png,
				dps: $blockStore[b.name].dps,
				throwOnTouch: $blockStore[b.name].throwOnTouch,
			}))

		endOfLevel = Math.max(...blocks.map(b => b.x + b.width))

		effectBlocks = blocks.filter(b => b.dps > 0 || b.throwOnTouch)

		levelWidth = Math.max(...blocks.map(b => b.x + b.width))
		levelHeight = 600 //Math.max(...blocks.map(b => b.y + b.height))
		start()
	})

	onDestroy(() => {
		gameAlive = false
		window.cancelAnimationFrame(lastRequestedFrame)
	})

	function start() {
		score = 0
		player = {
			...character,
			health: character.maxHealth,
			tvx: character.maxVelocity,

			width: $artStore[character.graphicStill].width * artScale, // width of graphic
			height: $artStore[character.graphicStill].height * artScale, // height of graphic

			// runtime stuff
			x: blocks[0].x,
			y: blocks[0].y + blocks[0].height + 100,
			vx: 0,
			vy: 0,

			// todo: replace "spinning" with abilities
			spinning: false,

			tick() {
				// x axis controls
				if (player.grounded) {
					if (leftDown && !rightDown) player.vx -= player.tvx / 5
					else if (rightDown && !leftDown) player.vx += player.tvx / 5
					else player.vx = 0
				} else {
					// let them control direction a little in the air, but not as much
					if (leftDown && !rightDown) player.vx -= player.tvx / 10
					else if (rightDown && !leftDown) player.vx += player.tvx / 10
				}

				// don't let them break top speed though
				if (Math.abs(player.vx) > player.tvx) player.vx = player.tvx * (player.vx < 0 ? -1 : 1)
			},
		}
		enemies = level.enemies.map(e => {
			const template = $enemyStore[e.name]
			const w = $artStore[template.graphicStill].width * artScale // width of graphic
			const h = $artStore[template.graphicStill].height * artScale // height of graphic
			return CreateEnemy(template, e, w, h)
		})
		gameOver = false
		paused = false

		// only start game loop if it's not already going
		if (lastRequestedFrame == null) gameLoop()
	}

	function gameLoop() {
		if (!gameOver && !paused) {
			frame++
			if (frame > 1000) frame = 0

			// visibleBlocks = blocks.filter(b => doObjectsIntersect(viewport, b))
			player = applyWorldToSprite(player, true)

			// handle movement / attack abilities
			player.tick()

			const halfViewportWidth = viewport.width / 2
			const halfViewportHeight = viewport.height / 2

			viewport.x =
				// player is at beginning of level
				player.x < halfViewportWidth
					? // viewport all the way to the left
					  0
					: // player is at end of level
					player.x > endOfLevel - halfViewportWidth && endOfLevel > viewport.width
					? // viewport all the way to the right
					  endOfLevel - viewport.width
					: // player is in middle of level, viewport centered on player
					  player.x - halfViewportWidth

			viewport.y =
				// player is near bottom of screen
				player.y < halfViewportHeight
					? // viewport all the way to bottom
					  0
					: // player above half viewport height, center on player
					  player.y - halfViewportHeight

			// for every live enemy intersecting the player, one or the other should take damage
			// only update enemies within leash range
			const screenRange = viewport.width / 2
			enemies
				.filter(e => Math.abs(e.x - player.x) < screenRange)
				.map(e => {
					if (e.alive) {
						e = applyWorldToSprite(e)
						e.tick(e, player)
						if (doObjectsIntersect(player, e)) {
							if (player.spinning) {
								e.health -= player.dps / 60 // damage per frame
							} else {
								player.health -= e.dps / 60 // damage per frame
							}
						}
						if (e.health <= 0) {
							e.alive = false
							e.vx = 0
							score += e.score
						}
					}
				})
			enemies = enemies

			// game is over if player dies
			if (player.health <= 0) {
				gameWon = false
				gameOver = true
			}
			// game is won if no enemies left
			else if (!enemies.some(e => e.alive)) {
				gameWon = true
				gameOver = true
			}
		}

		if (gameAlive) lastRequestedFrame = window.requestAnimationFrame(gameLoop)
	}

	function applyWorldToSprite(sprite, isPlayerControlled = false) {
		const surfacesBelowSprite = blocks.filter(b => b.solid && isAAboveB(sprite, b)).map(b => b.y + b.height)
		const surfaceY = surfacesBelowSprite.length > 0 ? Math.max(...surfacesBelowSprite) : -500 // some number off screen

		sprite.y += sprite.vy
		sprite.grounded = sprite.y <= surfaceY

		// gravity affects all sprites
		if (sprite.grounded) {
			// we're grounded - take damage if we were previously falling
			if (sprite.vy < 0) {
				sprite.health += (sprite.vy / 10) * sprite.fallDamageMultiplier
				sprite.vy = 0
			}

			// make sure we're exactly on the ground
			sprite.y = surfaceY
		} else if (sprite.y < -200) {
			// we fell under the map, die
			sprite.health = 0
		} else {
			// we're in the air, accelerate downward
			sprite.vy -= 1
		}

		// x velocity
		if (sprite.vx != 0) {
			if (sprite.vx > 0) {
				// moving right
				let targetX = sprite.x + sprite.vx
				// any block that would prevent us from reaching our target?
				const blockToRight = blocks.find(b => {
					// sprite x + width <= box x
					// target x + width > box x
					const txw = targetX + sprite.width
					const sxw = sprite.x + sprite.width
					return b.solid && txw > b.x && sxw <= b.x && doObjectsIntersectYExclusive(b, sprite)
				})

				if (blockToRight != null) targetX = blockToRight.x - sprite.width
				// don't let them go past end of level
				else if (targetX > endOfLevel - sprite.width) targetX = endOfLevel - sprite.width
				sprite.x = targetX
			} else if (sprite.vx < 0) {
				// moving left
				let targetX = sprite.x + sprite.vx
				// any block that would prevent us from reaching target?
				const blockToLeft = blocks.find(b => {
					// sprite x >= box x + width
					// target x < box x + width
					const bxw = b.x + b.width
					return b.solid && sprite.x >= bxw && targetX < bxw && doObjectsIntersectYExclusive(b, sprite)
				})
				if (blockToLeft != null) targetX = blockToLeft.x + blockToLeft.width
				// don't let them go past start of level
				else if (targetX < 0) targetX = 0

				sprite.x = targetX < startOfLevel ? startOfLevel : targetX
			}
		}

		// blocks that do damage
		effectBlocks
			.filter(b => doObjectsIntersect(sprite, b))
			.forEach(b => {
				// if block does damage, reduce health
				if (b.dps > 0) sprite.health -= b.dps / 60 // damage per frame

				// does the block also throw?
				if (b.throwOnTouch) sprite.vy = 20
			})

		return sprite
	}

	function onKeyDown(e) {
		if (gameOver) return
		if (paused) return
		switch (e.code) {
			case 'ArrowLeft':
				leftDown = true
				break
			case 'ArrowRight':
				rightDown = true
				break
			case 'Space':
				if (player.grounded || player.canFly) player.vy = player.jumpVelocity
				break
			case 'KeyR':
				if (player.canSpin) player.spinning = true
				break
			case 'KeyQ':
				player.health = player.maxHealth
				break
			default:
				break
		}
	}

	function onKeyUp(e) {
		switch (e.code) {
			case 'ArrowLeft':
				leftDown = false
				break
			case 'ArrowRight':
				rightDown = false
				break
			case 'Space':
				if (gameOver) start()
				if (paused) paused = false
				break
			case 'KeyR':
				if (player.canSpin) player.spinning = false
				break
			case 'Enter':
			case 'NumpadEnter':
				start()
				break
			case 'KeyP':
			case 'Escape':
				paused = !paused
				break
			default:
				console.log(e.code)
		}
	}
</script>

<style>
	.game-window {
		width: 100%;
		height: 90vh;
		min-height: 600px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}
</style>
