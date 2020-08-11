<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<div class="game-window" bind:this={mainEl}>
	{#if gameOver}
		<GameOver {wave} {score} />
	{/if}
	{#if level != null}
		<Viewport {...viewport} backgroundColor={level.backgroundColor}>
			{#if player != null}
				<Level {blocks} x={viewport.x} y={viewport.y} {height} {width}>
					{#each enemies as enemy}
						<Enemy {...enemy} />
					{/each}
					<Player {...player} />
				</Level>
			{/if}
		</Viewport>
	{/if}
	<Status {wave} {score} />
	<Instructions />
</div>

<script>
	import { onMount, onDestroy } from 'svelte'
	import Status from './Status.svelte'
	import Level from './Level.svelte'
	import Instructions from './Instructions.svelte'
	import Viewport from './Viewport.svelte'
	import Player from './Player.svelte'
	import Enemy from './Enemy.svelte'
	import HealthBar from './HealthBar.svelte'
	import GameOver from './GameOver.svelte'
	import Block from './Block.svelte'
	import { levelToBlocks } from './blocks'
	import { doObjectsIntersect, isAAboveB } from './spatial-functions'

	export let level = null
	const blockSize = 25
	let blocks
	let width = 0
	let height = 0

	let wave = 0
	let score = 0

	let mainEl
	let maxSpeed = 5
	let maxEnemySpeed = 2
	let jumpVelocity = 20
	let player
	let enemies
	let leftDown = false
	let rightDown = false
	let spaceDown = false
	let gameOver = false

	let gameAlive = true
	let lastRequestedFrame = null

	let visibleBlocks
	let viewport = {
		width: window.innerWidth,
		height: 900,
	}

	onMount(() => {
		blocks = levelToBlocks(level, blockSize)
		width = level.data.length * blockSize
		height = Math.max(...blocks.map(b => b.y + b.height))
		start()
	})

	onDestroy(() => {
		gameAlive = false
		window.cancelAnimationFrame(lastRequestedFrame)
	})

	let rightBound
	function start() {
		wave = 0
		score = 0
		player = {
			width: 85,
			height: 75,
			x: blocks[0].x,
			y: blocks[0].y + blocks[0].height + 100,
			direction: 1,
			vx: 0,
			vy: 0,
			spinning: false,
			health: 100,
			maxHealth: 100,
		}
		enemies = []
		gameOver = false

		// only start game loop if it's not already going
		if (lastRequestedFrame == null) gameLoop()
	}

	function gameLoop() {
		if (!gameOver) {
			// visibleBlocks = blocks.filter(b => doObjectsIntersect(viewport, b))
			player = updateSprite(player, true)

			rightBound = blockSize * level.length
			const halfViewportWidth = viewport.width / 2
			const halfViewportHeight = viewport.height / 2

			viewport.x =
				// player is at beginning of level
				player.x < halfViewportWidth
					? // viewport all the way to the left
					  0
					: // player is at end of level
					player.x > rightBound - halfViewportWidth
					? // viewport all the way to the right
					  rightBound - viewport.width
					: // player is in middle of level, viewport centered on player
					  player.x - halfViewportWidth

			viewport.y =
				// player is near bottom of screen
				player.y < halfViewportHeight
					? // viewport all the way to bottom
					  0
					: // player above half viewport height, center on player
					  player.y - halfViewportHeight

			// if no enemies are alive, spawn some more
			// todo: levels should add mobs, not auto spawn

			// if (!enemies.some(e => e.health > 0)) {
			// 	// if they haven't killed 10 yet, spawn some more small enemies
			// 	if (enemies.length < 5) {
			// 		wave++
			// 		score += wave > 1 ? 100 : 0
			// 		// bunch of small enemies
			// 		enemies = enemies.concat(
			// 			[1, 2, 3, 4, 5].map(x => ({
			// 				width: 100,
			// 				height: 50,
			// 				x: player.x + 100 + x * 100,
			// 				y: 600,
			// 				direction: -1,
			// 				vx: 0,
			// 				vy: 0,
			// 				health: 100 * wave,
			// 				maxHealth: 100 * wave,
			// 			}))
			// 		)
			// 	} else {
			// 		// spawn a boss
			// 		score += 50
			// 		enemies = [
			// 			{
			// 				isBoss: true,
			// 				width: 400,
			// 				height: 200,
			// 				x: player.x + 200,
			// 				y: 600,
			// 				direction: -1,
			// 				vx: 0,
			// 				vy: 0,
			// 				health: 400 * wave,
			// 				maxHealth: 400 * wave,
			// 			},
			// 		]
			// 	}
			// }

			// for every live enemy intersecting the player, one or the other should take damage
			for (let i = 0; i < enemies.length; i++) {
				enemies[i] = updateSprite(enemies[i])
				if (enemies[i].health > 0 && doObjectsIntersect(player, enemies[i])) {
					if (player.spinning) {
						enemies[i].gettingHit = true
						enemies[i].health -= 1
					} else {
						player.health -= 1 * wave
					}
				}
			}

			// game is over if player dies
			if (player.health <= 0) gameOver = true
		}

		if (gameAlive) lastRequestedFrame = window.requestAnimationFrame(gameLoop)
	}

	function updateSprite(sprite, isPlayerControlled = false) {
		const surfacesBelowSprite = blocks.filter(b => b.interactive && isAAboveB(sprite, b)).map(b => b.y + b.height)
		const surfaceY = surfacesBelowSprite.length > 0 ? Math.max(...surfacesBelowSprite) : -500 // some number off screen

		// if they go below 0, take damage
		if (sprite.y < -100) {
			sprite.health = 0
		}

		if (sprite.vy != 0) {
			sprite.y += sprite.vy

			// if we just hit the ground, take some life away
			if (sprite.y <= surfaceY) {
				sprite.y = surfaceY
				sprite.health += sprite.vy / (isPlayerControlled ? 2 : 10)
			}
		}

		// x velocity
		if (sprite.vx != 0) {
			if (sprite.vx > 0) {
				const targetX = sprite.x + sprite.vx
				sprite.x = targetX > rightBound ? rightBound : targetX
			} else {
				const leftBound = 0
				const targetX = sprite.x + sprite.vx
				sprite.x = targetX < leftBound ? leftBound : targetX
			}
		}

		if (sprite.y > surfaceY) {
			sprite.vy--
		} else {
			sprite.vy = 0

			if (isPlayerControlled) {
				// player can jump if they're on the ground
				if (spaceDown) {
					sprite.vy = jumpVelocity
					sprite.y += 1
				} else if (!leftDown && !rightDown) sprite.vx = 0
			} else {
				// enemy, just move toward player
				// if player is above enemy, jump
				if (player.y > sprite.y + sprite.height) {
					sprite.vy = jumpVelocity
					sprite.y += 1
				}
			}
		}

		if (isPlayerControlled) {
			// player can move left and right
			if (leftDown) sprite.vx = -maxSpeed
			else if (rightDown) sprite.vx = maxSpeed
		} else {
			// enemy, just move toward player
			if (player.x < sprite.x) sprite.vx = -maxEnemySpeed
			else sprite.vx = maxEnemySpeed
		}

		return sprite
	}

	function onKeyDown(e) {
		if (gameOver) return
		switch (e.code) {
			case 'KeyA':
				player.direction = -1
				leftDown = true
				break
			case 'KeyD':
				player.direction = 1
				rightDown = true
				break
			case 'Space':
				spaceDown = true
				break
			case 'KeyR':
				player.spinning = true
				break
			case 'KeyQ':
				player.health = player.maxHealth
				break
			default:
				break
		}
	}

	function onKeyUp(e) {
		if (gameOver) {
			start()
			return
		}
		switch (e.code) {
			case 'KeyA':
				leftDown = false
				break
			case 'KeyD':
				rightDown = false
				break
			case 'Space':
				spaceDown = false
				break
			case 'KeyR':
				player.spinning = false
				break
			case 'Enter':
			case 'NumpadEnter':
				start()
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
