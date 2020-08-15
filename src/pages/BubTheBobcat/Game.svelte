<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<div class="game-window" bind:this={mainEl}>
	{#if gameOver}
		<GameOver {score} />
	{/if}
	{#if level != null && player != null}
		<Viewport {...viewport} backgroundColor={level.backgroundColor}>
			<Level {blocks} width={levelWidth} height={levelHeight} />
			{#each enemies as enemy}
				<Enemy {...enemy} />
			{/each}
			<Player {...player} />
		</Viewport>
	{/if}
	<Status {level} {score} />
	<Instructions />
</div>

<script>
	import { onMount, onDestroy } from 'svelte'
	import Status from './Status.svelte'
	import Level from './LevelOld.svelte'
	import Instructions from './Instructions.svelte'
	import Viewport from './Viewport.svelte'
	import Player from './Player.svelte'
	import Enemy from './Enemy.svelte'
	import HealthBar from './HealthBar.svelte'
	import GameOver from './GameOver.svelte'
	import { levelToBlocks } from './blocks'
	import { doObjectsIntersect, isAAboveB } from './spatial-functions'
	import { BossEnemy, SimpleEnemy } from './enemies'

	export let level = null
	const blockSize = 25
	let blocks
	let levelWidth = 0
	let levelHeight = 0

	let score = 0

	let mainEl
	let jumpVelocity = 15
	let player
	let enemies
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
		levelWidth = level.data.length * blockSize
		levelHeight = Math.max(...blocks.map(b => b.y + b.height))
		start()
	})

	onDestroy(() => {
		gameAlive = false
		window.cancelAnimationFrame(lastRequestedFrame)
	})

	let rightBound
	function start() {
		score = 0
		player = {
			width: 85,
			height: 75,
			x: blocks[0].x,
			y: blocks[0].y + blocks[0].height + 100,
			vx: 0,
			vy: 0,
			spinning: false,
			health: 100,
			maxHealth: 100,
			tvx: 7,
			fallDamageMultiplier: 10,
			dps: 120,
			tick() {
				console.log('i am the player in a frame')
			},
		}
		enemies = []
		gameOver = false

		// only start game loop if it's not already going
		if (lastRequestedFrame == null) gameLoop()
	}

	function gameLoop() {
		if (!gameOver) {
			// visibleBlocks = blocks.filter(b => doObjectsIntersect(viewport, b))
			player = applyGravityAndVelocity(player, true)

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

			// todo: levels should add mobs, not auto spawn
			if (!enemies.some(e => e.health > 0)) {
				if (enemies.length < 5) {
					enemies = enemies.concat([1, 2, 3, 4, 5].map(x => new SimpleEnemy(player.x + 200 * x, player.y + 200)))
				} else {
					enemies = [new BossEnemy(player.x + 200, player.y + 200)]
				}
			}

			// for every live enemy intersecting the player, one or the other should take damage
			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].alive) {
					enemies[i] = applyGravityAndVelocity(enemies[i])
					enemies[i].tick(player)
					if (doObjectsIntersect(player, enemies[i])) {
						if (player.spinning) {
							enemies[i].gettingHit = true
							enemies[i].health -= player.dps / 60 // damage per frame
						} else {
							player.health -= enemies[i].dps / 60 // damage per frame
						}
					}
					if (enemies[i].health <= 0) {
						enemies[i].alive = false
						enemies[i].onDeath()
						score += enemies[i].score
					}
				}
			}

			// game is over if player dies
			if (player.health <= 0) gameOver = true
		}

		if (gameAlive) lastRequestedFrame = window.requestAnimationFrame(gameLoop)
	}

	function applyGravityAndVelocity(sprite, isPlayerControlled = false) {
		const surfacesBelowSprite = blocks.filter(b => b.interactive && isAAboveB(sprite, b)).map(b => b.y + b.height)
		const surfaceY = surfacesBelowSprite.length > 0 ? Math.max(...surfacesBelowSprite) : -500 // some number off screen

		sprite.y += sprite.vy
		sprite.grounded = sprite.y <= surfaceY

		// gravity affects all sprites
		if (sprite.grounded) {
			// we're grounded - take damage if we were previously falling
			if (sprite.vy < 0) {
				sprite.health += sprite.vy / sprite.fallDamageMultiplier
				sprite.vy = 0
			}

			// make sure we're exactly on the ground
			sprite.y = surfaceY
		} else if (sprite.y < -200) {
			// we fell under the map, die
			sprite.health = 0
		} else {
			// we're in the air, accelerate downward
			sprite.vy--
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

		return sprite
	}

	function onKeyDown(e) {
		if (gameOver) return
		switch (e.code) {
			case 'ArrowLeft':
				player.vx = -player.tvx
				break
			case 'ArrowRight':
				player.vx = player.tvx
				break
			case 'Space':
				if (player.grounded) player.vy = jumpVelocity
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
			case 'ArrowLeft':
				player.vx = 0
				break
			case 'ArrowRight':
				player.vx = 0
				break
			case 'Space':
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
