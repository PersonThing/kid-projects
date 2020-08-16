<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<div class="game-window" bind:this={mainEl}>
	{#if gameOver}
		<GameOver {score} {player} />
	{/if}
	{#if level != null && player != null}
		<Viewport {...viewport} background={level.background}>
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
	import Level from './Level.svelte'
	import Instructions from './Instructions.svelte'
	import Viewport from './Viewport.svelte'
	import Player from './Player.svelte'
	import Enemy from './Enemy.svelte'
	import HealthBar from './HealthBar.svelte'
	import GameOver from './GameOver.svelte'
	import { doObjectsIntersect, isAAboveB } from './spatial-functions'
	import { BossEnemy, SimpleEnemy } from './enemies'

	import artStore from '../../stores/art-store'
	import blockStore from '../../stores/block-store'

	export let level = null
	export let character = null

	const blockSize = 25
	let blocks
	let damageBlocks
	let levelWidth = 0
	let levelHeight = 0

	let score = 0

	let mainEl
	let player
	let enemies
	let gameOver = false

	let gameAlive = true
	let lastRequestedFrame = null

	let visibleBlocks
	let viewport = {
		width: window.innerWidth,
		height: 800,
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

		damageBlocks = blocks.filter(b => b.dps > 0)

		levelWidth = Math.max(...blocks.map(b => b.x + b.width))
		levelHeight = 800 //Math.max(...blocks.map(b => b.y + b.height))
		start()
	})

	onDestroy(() => {
		gameAlive = false
		window.cancelAnimationFrame(lastRequestedFrame)
	})

	let rightBound
	const artScale = 2
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
					if (leftDown && !rightDown) player.vx = -player.tvx
					else if (rightDown && !leftDown) player.vx = player.tvx
					else player.vx = 0
				}
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
			player = applyGravityAndVelocityAndLevelDamage(player, true)

			// handle movement / attack abilities
			player.tick()

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
					enemies[i] = applyGravityAndVelocityAndLevelDamage(enemies[i])
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

	function applyGravityAndVelocityAndLevelDamage(sprite, isPlayerControlled = false) {
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
				const targetX = sprite.x + sprite.vx
				sprite.x = targetX > rightBound ? rightBound : targetX
			} else {
				const leftBound = 0
				const targetX = sprite.x + sprite.vx
				sprite.x = targetX < leftBound ? leftBound : targetX
			}
		}

		// blocks that do damage
		for (let i = 0; i < damageBlocks.length; i++) {
			if (doObjectsIntersect(sprite, damageBlocks[i])) {
				sprite.health -= damageBlocks[i].dps / 60 // damage per frame

				// does the block also throw?
				if (damageBlocks[i].throwOnTouch) {
					sprite.vy = 20
				}
			}
		}

		return sprite
	}

	function onKeyDown(e) {
		if (gameOver) return
		switch (e.code) {
			case 'ArrowLeft':
				leftDown = true
				break
			case 'ArrowRight':
				rightDown = true
				break
			case 'Space':
				if (player.grounded) player.vy = player.jumpVelocity
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
		switch (e.code) {
			case 'ArrowLeft':
				leftDown = false
				break
			case 'ArrowRight':
				rightDown = false
				break
			case 'Space':
				if (gameOver) start()
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
