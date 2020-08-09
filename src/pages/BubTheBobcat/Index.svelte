<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<div class="game-window" bind:this={mainEl}>
	{#if gameOver}
		<GameOver {wave} {score} />
	{/if}
	<!-- viewport moves with player -->
	<Viewport {player} xOffset={playerXOffset}>
		{#if player != null}
			{#each blocks as block}
				<Block {...block} />
			{/each}
			{#each enemies as enemy}
				<Enemy {...enemy} />
			{/each}
		{/if}
	</Viewport>
	<Status {wave} {score} />
	<!-- player alawys in middle -->
	<div style="position: relative;">
		<Player {...player} xOffset={playerXOffset} />
	</div>
	<Instructions />
</div>

<script>
	import { onMount, onDestroy } from 'svelte'
	import Status from './Status.svelte'
	import Instructions from './Instructions.svelte'
	import Viewport from './Viewport.svelte'
	import Player from './Player.svelte'
	import Enemy from './Enemy.svelte'
	import HealthBar from './HealthBar.svelte'
	import GameOver from './GameOver.svelte'
	import Block from './Block.svelte'
	import generateBlocks from './blocks.js'
	const blockSize = 40
	const mapWidthInBlocks = 80

	const playerXOffset = window.innerWidth / 2

	let wave = 0
	let score = 0

	let mainEl
	let blocks
	let maxSpeed = 5
	let maxEnemySpeed = 2
	let jumpMomentum = 20
	let player
	let enemies
	let leftDown = false
	let rightDown = false
	let spaceDown = false
	let gameOver = false

	let gameAlive = true

	function gameLoop() {
		if (!gameOver) {
			player = updateSprite(player, true)

			// if no enemies are alive, spawn some more
			if (!enemies.some(e => e.health > 0)) {
				// if they haven't killed 10 yet, spawn some more small enemies
				if (enemies.length < 5) {
					wave++
					score += wave > 1 ? 100 : 0
					// bunch of small enemies
					enemies = enemies.concat(
						[1, 2, 3, 4, 5].map(x => ({
							size: 100,
							position: {
								x: player.position.x + 100 + x * 100,
								y: 600,
							},
							direction: -1,
							momentum: {
								x: 0,
								y: 0,
							},
							health: 100 * wave,
							maxHealth: 100 * wave,
						}))
					)
				} else {
					// spawn a boss
					score += 50
					enemies = [
						{
							size: 400,
							isBoss: true,
							position: {
								x: player.position.x + 200,
								y: 600,
							},
							direction: -1,
							momentum: {
								x: 0,
								y: 0,
							},
							health: 400 * wave,
							maxHealth: 400 * wave,
						},
					]
				}
			}

			for (let i = 0; i < enemies.length; i++) {
				if (enemies[i].health > 0) {
					enemies[i] = updateSprite(enemies[i], false)

					// if enemy is on top of player, player should take damage
					const enemyCenterX = enemies[i].position.x
					const halfEnemy = enemies[i].size / 2
					const playerLeft = player.position.x - player.size / 2 - halfEnemy
					const playerRight = playerLeft + player.size + halfEnemy

					enemies[i].gettingHit = false
					if (enemyCenterX >= playerLeft && enemyCenterX <= playerRight) {
						const enemyCenterY = enemies[i].position.y
						const playerBottom = player.position.y - halfEnemy
						const playerTop = player.position.y + player.size + halfEnemy
						if (enemyCenterY > playerBottom && enemyCenterY < playerTop) {
							// player and enemy are intersecting
							if (player.spinning) {
								enemies[i].gettingHit = true
								enemies[i].health -= 1
							} else {
								player.health -= 1 * wave
							}
						}
					}
				}
			}
			enemies = enemies

			// game is over if player dies
			if (player.health <= 0) gameOver = true
		}
		console.log('in game loop')

		if (gameAlive) window.requestAnimationFrame(gameLoop)
	}

	function updateSprite(sprite, isPlayerControlled = false) {
		const aboveBlock = blocks.find(b => {
			// consider player over a block if the player's edges surround the midpoint of the block
			const blockLeftEdge = b.x
			const blockRightEdge = blockLeftEdge + blockSize
			const spriteCenter = sprite.position.x
			return b.interactive && blockLeftEdge <= spriteCenter && blockRightEdge >= spriteCenter && sprite.position.y >= b.y
		})
		sprite.groundY = aboveBlock != null ? aboveBlock.y : 0

		if (sprite.momentum.y != 0) {
			sprite.position.y += sprite.momentum.y

			// if we just hit the ground, take some life away
			if (sprite.position.y <= sprite.groundY) {
				sprite.position.y = sprite.groundY
				sprite.health += sprite.momentum.y / (isPlayerControlled ? 2 : 10)
			}
		}

		// x momentum
		if (sprite.momentum.x != 0) {
			if (sprite.momentum.x > 0) {
				const rightBound = blockSize * mapWidthInBlocks
				const targetX = sprite.position.x + sprite.momentum.x
				sprite.position.x = targetX > rightBound ? rightBound : targetX
			} else {
				const leftBound = 0
				const targetX = sprite.position.x + sprite.momentum.x
				sprite.position.x = targetX < leftBound ? leftBound : targetX
			}
		}

		if (sprite.position.y > sprite.groundY) {
			sprite.momentum.y--
		} else {
			sprite.momentum.y = 0

			if (isPlayerControlled) {
				// player can jump if they're on the ground
				if (spaceDown) {
					sprite.momentum.y = jumpMomentum
					sprite.position.y += 1
				} else if (!leftDown && !rightDown) sprite.momentum.x = 0
			} else {
				// enemy, just move toward player
				// if player is above enemy, jump
				if (player.position.y - blockSize - 1 > sprite.position.y) {
					sprite.momentum.y = jumpMomentum
					sprite.position.y += 1
				}
			}
		}

		if (isPlayerControlled) {
			// player can move left and right
			if (leftDown) sprite.momentum.x = -maxSpeed
			else if (rightDown) sprite.momentum.x = maxSpeed
		} else {
			// enemy, just move toward player
			if (player.position.x < sprite.position.x) sprite.momentum.x = -maxEnemySpeed
			else sprite.momentum.x = maxEnemySpeed
		}

		return sprite
	}

	function onKeyDown(e) {
		if (gameOver) return
		switch (e.code) {
			case 'ArrowLeft':
				player.direction = -1
				leftDown = true
				break
			case 'ArrowRight':
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
		switch (e.code) {
			case 'ArrowLeft':
				leftDown = false
				break
			case 'ArrowRight':
				rightDown = false
				break
			case 'Space':
				spaceDown = false
				break
			case 'KeyR':
				player.spinning = false
				break
			case 'Enter':
				start()
				break
		}
	}

	function start() {
		wave = 0
		score = 0
		blocks = generateBlocks(blockSize, mapWidthInBlocks)

		player = {
			size: 100,
			position: {
				x: playerXOffset,
				// start on top of first block
				y: blocks[0].y + blocks[0].height,
			},
			direction: 1,
			momentum: {
				x: 0,
				y: 0,
			},
			spinning: false,
			health: 100,
			maxHealth: 100,
		}
		enemies = []
		gameOver = false
	}

	// start game loop
	onMount(() => {
		start()
		gameLoop()
	})
	onDestroy(() => {
		gameAlive = false
	})
</script>

<style>
	.game-window {
		width: 100%;
		height: 80vh;
		min-height: 600px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}
</style>
