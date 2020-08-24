<div class="game-window">
	{#if level != null && character != null}
		{#if gameOver}
			<GameOver {score} {player} won={gameWon} {level} />
		{:else if paused}
			<Paused />
		{/if}
		<div bind:this={container} />
	{/if}
	<Status {level} {score} />
	<Instructions />
</div>

<script>
	import { magnet, image } from 'svelte-awesome/icons'
	import { onMount, onDestroy } from 'svelte'
	import { rgbaStringToHex } from '../services/rgba-to-hex'
	import Enemy from './PhaserGame/Enemy'
	import GameOver from './GameOver.svelte'
	import HealthBar from './PhaserGame/HealthBar'
	import Instructions from './Instructions.svelte'
	import Paused from './Paused.svelte'
	import Player from './PhaserGame/Player'
	import project from '../stores/active-project-store'
	import Status from './Status.svelte'

	export let level = null
	export let character = null

	// TODO: make editable in level or on individual enemies
	const leashRange = 400

	const gravityPixelsPerSecond = 2000

	let container

	let gameOver
	let gameWon
	let score
	let paused

	let blocks
	let simpleBlocks
	let effectBlocks
	let consumableBlocks

	let worldSimpleBlocks
	let worldEffectBlocks
	let worldConsumableBlocks

	let config
	let game
	let preloadedData
	let cursors
	let spacebarKey
	let enterKey
	let rKey
	let player
	let enemies

	let gameWidth = 1200
	let gameHeight = 600

	let levelWidth
	let levelHeight

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
				...$project.blocks[b.name],
				...b,
			}))

		effectBlocks = blocks.filter(b => (b.dps > 0 || b.throwOnTouch) && !b.consumable)
		simpleBlocks = blocks.filter(b => b.dps == 0 && !b.throwOnTouch && !b.consumable)
		consumableBlocks = blocks.filter(b => b.consumable)

		start()
	})

	// $: if (level != null && character != null && container != null) start()

	function start() {
		destroyGame()
		preload().then(() => {
			if (container == null) return

			gameOver = false
			gameWon = false
			paused = false
			score = 0
			gameWidth = window.innerWidth

			levelWidth = Math.max(...level.blocks.map(b => b.x + b.width * 2))
			levelHeight = Math.max(...level.blocks.map(b => b.y + b.height * 2))

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
						gravity: { y: gravityPixelsPerSecond },
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
			// load block art
			const distinctBlockArt = [...new Set(level.blocks.map(b => $project.blocks[b.name].graphic))]
			let loadingPromises = distinctBlockArt.map(name => preloadArt(name))

			// load player art
			loadingPromises = loadingPromises.concat(
				Object.keys(character.graphics)
					.filter(key => character.graphics[key] != null)
					.map(key => preloadArt(character.graphics[key]))
			)

			// load enemy art
			const distinctEnemies = [...new Set(level.enemies.map(e => e.name))].map(name => $project.enemies[name])
			loadingPromises = loadingPromises.concat(
				distinctEnemies.flatMap(enemy =>
					Object.keys(enemy.graphics)
						.filter(key => enemy.graphics[key] != null)
						.map(key => preloadArt(enemy.graphics[key]))
				)
			)

			Promise.all(loadingPromises).then(data => {
				preloadedData = data
				resolve()
			})
		})
	}

	function preloadArt(name) {
		const art = $project.art[name]
		return new Promise((res, rej) => {
			const image = new Image()
			image.onload = () =>
				res({
					...art,
					image,
				})
			image.src = art.png
		})
	}

	function onCreate() {
		this.cameras.main.setBackgroundColor(rgbaStringToHex(level.background))

		// set up textures and sprites for all blocks, character, and enemies in level
		preloadedData.forEach(art => {
			if (art.animated) {
				// animated spritesheet
				this.textures.addSpriteSheet(art.name, art.image, {
					frameWidth: art.frameWidth,
					frameHeight: art.height,
				})
				this.anims.create({
					key: getAnimationKey(art.name),
					frames: this.anims.generateFrameNumbers(art.name, {
						start: 0,
						end: Math.ceil(art.width / art.frameWidth),
					}),
					frameRate: art.frameRate,
					repeat: -1,
					yoyo: art.yoyo,
				})
			} else {
				// simple static image
				this.textures.addImage(art.name, art.image)
			}
		})

		// add blocks as static objects
		// TODO: block class to abstract this...
		worldSimpleBlocks = this.physics.add.staticGroup()
		simpleBlocks.forEach(b => {
			const template = $project.blocks[b.name]
			const art = $project.art[template.graphic]
			const block = worldSimpleBlocks.create(b.x, translateY(b.y, b.height), art.name)
			console.log(art.name, art.animated)
			if (art.animated) block.anims.play(getAnimationKey(art.name), true)
		})
		worldEffectBlocks = this.physics.add.staticGroup()
		effectBlocks.forEach(b => {
			const template = $project.blocks[b.name]
			const art = $project.art[template.graphic]
			const block = worldEffectBlocks.create(b.x, translateY(b.y, b.height), art.name)
			if (art.animated) block.anims.play(getAnimationKey(art.name), true)
			block.dps = b.dps
			block.throwOnTouch = b.throwOnTouch
		})
		worldConsumableBlocks = this.physics.add.staticGroup()
		consumableBlocks.forEach(b => {
			const template = $project.blocks[b.name]
			const art = $project.art[template.graphic]
			const block = worldConsumableBlocks.create(b.x, translateY(b.y, b.height), art.name)
			if (art.animated) block.anims.play(getAnimationKey(art.name), true)
			block.dps = b.dps
			block.throwOnTouch = b.throwOnTouch
			block.consumable = true
			block.healthOnConsume = b.healthOnConsume
			block.scoreOnConsume = b.scoreOnConsume
		})

		// add player
		const startingY =
			translateY(Math.max(...blocks.filter(b => b.x == 0).map(b => b.y)), blocks[0].height) - $project.art[character.graphics.still].height
		console.log(startingY)
		player = this.physics.add.existing(new Player(this, 0, startingY, character.graphics.still, character))
		this.physics.add.collider(player, worldSimpleBlocks)
		this.physics.add.collider(player, worldEffectBlocks, onEffectBlockCollision)
		this.physics.add.overlap(player, worldConsumableBlocks, onConsumableBlockOverlap)

		// add enemies
		enemies = this.physics.add.group()
		enemies.runChildUpdate = true
		level.enemies.forEach(e => {
			const template = $project.enemies[e.name]
			enemies.add(new Enemy(this, e.x, translateY(e.y, $project.art[template.graphics.still].height), template.graphics.still, template, player))
		})
		this.physics.add.collider(enemies, worldSimpleBlocks)
		this.physics.add.collider(enemies, worldEffectBlocks, onEffectBlockCollision)
		this.physics.add.overlap(player, enemies, onPlayerEnemyOverlap)

		// camera and player bounds
		this.physics.world.setBounds(0, -levelHeight, levelWidth, levelHeight + gameHeight + 500)
		this.cameras.main.setBounds(0, -levelHeight, levelWidth, levelHeight + gameHeight)
		this.cameras.main.startFollow(player)

		// configure input
		cursors = this.input.keyboard.createCursorKeys()
		spacebarKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
		rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
	}

	function translateY(y, height) {
		return gameHeight - y - height / 2
	}

	function onEffectBlockCollision(sprite, block) {
		sprite.damage(block.dps / 60)
		if (block.throwOnTouch) sprite.setVelocityY(-1000)
	}

	function onConsumableBlockOverlap(sprite, block) {
		if (block.healthOnConsume) sprite.damage(-block.healthOnConsume)
		if (block.scoreOnConsume) score += block.scoreOnConsume
		if (block.throwOnTouch) sprite.setVelocityY(-1000)
		block.disableBody(true, true)
	}

	function onPlayerEnemyOverlap(player, enemy) {
		if (player.spinning) {
			enemy.damage(player.template.dps / 60)
		} else {
			player.damage(enemy.template.dps / 60)
		}
	}

	function onUpdate() {
		// restart game
		if (Phaser.Input.Keyboard.JustDown(enterKey) || (gameOver && Phaser.Input.Keyboard.JustDown(spacebarKey))) start()

		if (gameOver) return

		// jumping
		if (player.body.touching.down || character.canFly) {
			if (Phaser.Input.Keyboard.JustDown(spacebarKey)) player.setVelocityY(-character.jumpVelocity)
		}

		// moving left
		if (cursors.left.isDown && !cursors.right.isDown) {
			const newVelocity =
				player.body.touching.down || character.canFly
					? -character.maxVelocity
					: Math.max(player.body.velocity.x - character.maxVelocity / 15, -character.maxVelocity)
			player.setVelocityX(newVelocity)
			player.flipX = true
			setGraphic(player.spinning ? 'spinning' : 'moving')
		} else if (cursors.right.isDown && !cursors.isDown) {
			// moving right
			const newVelocity =
				player.body.touching.down || character.canFly
					? character.maxVelocity
					: Math.min(player.body.velocity.x + character.maxVelocity / 15, character.maxVelocity)
			player.setVelocityX(newVelocity)
			player.flipX = false
			setGraphic(player.spinning ? 'spinning' : 'moving')
		} else if (player.body.touching.down) {
			// stop if touching ground
			player.setVelocityX(0)
			setGraphic(player.spinning ? 'spinning' : 'still')
		}

		// r key to spin
		if (Phaser.Input.Keyboard.JustDown(rKey) && character.canSpin) {
			player.spinning = true
		} else if (Phaser.Input.Keyboard.JustUp(rKey)) {
			player.spinning = false
		}

		if (player.spinning) {
			player.setAngularVelocity(1080 * (player.body.velocity.x < 0 ? -1 : 1))
		} else {
			// rotate player based on y velocity
			player.setAngularVelocity(0)
			player.setRotation((player.body.velocity.y / 1800) * (player.body.velocity.x < 0 ? -1 : 1))
		}

		// if player is dead or fell out bottom of world, they lost
		if (!player.alive) {
			this.physics.pause()
			gameOver = true
		}
	}

	function setGraphic(key) {
		if (character.graphics[key] == null) key = 'still'
		const art = $project.art[character.graphics[key]]
		if (art.animated) player.anims.play(getAnimationKey(art.name), true)
		else player.setTexture(art.name)
	}

	function getAnimationKey(key) {
		return `${key}.animation`
	}
</script>

<style>
	.game-window {
		width: 100%;
		position: relative;
	}
</style>
