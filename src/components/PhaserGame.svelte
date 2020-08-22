<div class="game-window">
	{#if level != null && character != null}
		{#if gameOver}
			<GameOver {score} {player} won={gameWon} {level} />
		{:else if paused}
			<Paused />
		{/if}
		<div bind:this={container} />
	{/if}
	<Status {level} {score} enemyCount={(enemies || []).filter(e => e.alive).length} />
	<Instructions />
</div>

<script>
	import { magnet, image } from 'svelte-awesome/icons'
	import { onMount, onDestroy } from 'svelte'
	import { rgbaStringToHex } from '../services/rgba-to-hex'
	import GameOver from './GameOver.svelte'
	import HealthBar from './HealthBar.svelte'
	import Instructions from './Instructions.svelte'
	import Paused from './Paused.svelte'
	import project from '../stores/active-project-store'
	import Status from './Status.svelte'

	export let level = null
	export let character = null

	let container

	let gameOver
	let gameWon
	let score
	let paused

	let blocks
	let simpleBlocks
	let effectBlocks

	let worldSimpleBlocks
	let worldEffectBlocks

	let config
	let game
	let preloadedData
	let cursors
	let spacebar
	let enter
	let player
	let enemies

	let gameWidth = 1200
	let gameHeight = 600

	$: if (level != null && character != null && container != null) start()

	function start() {
		gameOver = false
		gameWon = false
		paused = false
		score = 0

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
				solid: $project.blocks[b.name].solid,
				png: $project.art[$project.blocks[b.name].graphic].png,
				dps: $project.blocks[b.name].dps,
				throwOnTouch: $project.blocks[b.name].throwOnTouch,
			}))

		effectBlocks = blocks.filter(b => b.dps > 0 || b.throwOnTouch)
		simpleBlocks = blocks.filter(b => b.dps == 0 && !b.throwOnTouch)

		destroyGame()
		preload().then(() => {
			if (container == null) return

			config = {
				type: Phaser.AUTO,
				parent: container,
				scene: {
					create: onCreate,
					update: onUpdate,
				},
				physics: {
					default: 'arcade',
					arcade: {
						gravity: { y: 1800 },
						debug: false,
					},
				},
				width: gameWidth,
				height: gameHeight,
				pixelArt: true,
			}

			game = new Phaser.Game(config)
		})
	}

	onDestroy(() => {
		destroyGame()
	})

	function destroyGame() {
		if (game != null) {
			game.destroy()
			container.querySelectorAll('*').forEach(n => n.remove())
		}
	}

	function preload() {
		return new Promise((resolve, reject) => {
			// load block textures
			const distinctBlockArt = [...new Set(level.blocks.map(b => $project.blocks[b.name].graphic))]
			const loadingPromises = distinctBlockArt.map(
				artKey =>
					new Promise((res, rej) => {
						const image = new Image()
						image.onload = () =>
							res({
								key: artKey,
								image,
							})
						image.src = $project.art[artKey].png
					})
			)

			// load player character graphics
			for (let key in character.graphics) {
				const graphic = character.graphics[key]
				loadingPromises.push(
					new Promise((res, rej) => {
						const image = new Image()
						image.onload = () =>
							res({
								key: `player.${key}`,
								image,
								animated: !graphic.animated
									? false
									: {
											frameRate: graphic.frameRate,
											frameWidth: graphic.frameWidth,
											yoyo: graphic.yoyo,
									  },
							})
						image.src = $project.art[graphic.art].png
					})
				)
			}

			// TODO: load enemy graphics

			Promise.all(loadingPromises).then(data => {
				preloadedData = data
				resolve()
			})
		})
	}

	function onCreate() {
		this.cameras.main.setBackgroundColor(rgbaStringToHex(level.background))

		// set up textures and sprites for all blocks, character, and enemies in level
		preloadedData.forEach(data => {
			if (data.animated) {
				// animated spritesheet
				this.textures.addSpriteSheet(data.key, data.image, {
					frameWidth: data.animated.frameWidth,
					frameHeight: data.image.height,
				})
				this.anims.create({
					key: `${data.key}.animation`,
					frames: this.anims.generateFrameNumbers(data.key, {
						start: 0,
						end: Math.ceil(data.image.width / data.animated.frameWidth),
					}),
					frameRate: data.animated.frameRate,
					repeat: -1,
					yoyo: data.animated.yoyo,
				})
			} else {
				// simple static image
				this.textures.addImage(data.key, data.image)
			}
		})

		// add blocks as static objects
		worldSimpleBlocks = this.physics.add.staticGroup()
		simpleBlocks.forEach(b => {
			worldSimpleBlocks
				.create(b.x, gameHeight - b.y - b.height, $project.blocks[b.name].graphic)
				.setScale(2)
				.refreshBody()
		})
		worldEffectBlocks = this.physics.add.staticGroup()
		effectBlocks.forEach(b => {
			const block = worldEffectBlocks
				.create(b.x, gameHeight - b.y - b.height, $project.blocks[b.name].graphic)
				.setScale(2)
				.refreshBody()
			block.dps = b.dps
			block.throwOnTouch = b.throwOnTouch
		})

		// add player
		player = this.physics.add.sprite(0, 300, 'player.still')
		player.health = character.maxHealth
		player.setScale(2)

		// player should collide with simple blocks
		this.physics.add.collider(player, worldSimpleBlocks)

		// player should collide with effect blocks and do something when it happens
		this.physics.add.collider(player, worldEffectBlocks, (player, block) => {
			player.health -= block.dps / 60
			if (block.throwOnTouch) player.setVelocityY(-800)
			console.log(player.health)
		})
		this.cameras.main.startFollow(player)

		// TODO: add enemies

		// configure input
		cursors = this.input.keyboard.createCursorKeys()
		spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}

	function onUpdate() {
		if (player.body.touching.down || character.canFly) {
			if (Phaser.Input.Keyboard.JustDown(spacebar)) {
				player.setVelocityY(-character.jumpVelocity)
			}
		}

		// rotate player based on y velocity
		player.setRotation((player.body.velocity.y / 1800) * (player.body.velocity.x < 0 ? -1 : 1))

		if (cursors.left.isDown && !cursors.right.isDown) {
			// if they're grounded, immediately go top speed
			// if in air, accelerate a little bit in that direction
			const newVelocity =
				player.body.touching.down || character.canFly
					? -character.maxVelocity
					: Math.max(player.body.velocity.x - character.maxVelocity / 15, -character.maxVelocity)
			player.setVelocityX(newVelocity)
			player.flipX = true
			setGraphic('moving')
		} else if (cursors.right.isDown && !cursors.isDown) {
			const newVelocity =
				player.body.touching.down || character.canFly
					? character.maxVelocity
					: Math.min(player.body.velocity.x + character.maxVelocity / 15, character.maxVelocity)
			player.setVelocityX(newVelocity)
			player.flipX = false
			setGraphic('moving')
		} else if (player.body.touching.down) {
			// stop if we're touching ground
			player.setVelocityX(0)
			setGraphic('still')
		}

		// restart game
		if (Phaser.Input.Keyboard.JustDown(enter)) {
			player.health = 1
			start()
		}

		// if player is dead, they lost
		if (player.health < 0) {
			// this.physics.pause()
			gameOver = true
		}
	}

	function setGraphic(key) {
		if (character.graphics[key].animated) player.anims.play(`player.${key}.animation`, true)
		else player.setTexture(`player.${key}`)
	}
</script>

<style>
	.game-window {
		width: 100%;
		position: relative;
	}
</style>
