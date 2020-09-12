<div class="game-window">
	{#if level != null && character != null}
		{#if gameOver}
			<GameOver {score} {player} won={gameWon} {level} />
		{:else if paused}
			<Paused />
		{/if}
		<TemporaryAbilityBar abilities={character.abilities} />
		<div bind:this={container} />
	{/if}
</div>

{#if character != null}
	<Instructions abilities={character.abilities} canDoubleJump={character.canDoubleJump} />
{/if}

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
	import getAnimationKey from './PhaserGame/GetAnimationKey'
	import Follower from './PhaserGame/Follower'
	import SkillKeys from './PhaserGame/SkillKeys'
	import TemporaryAbilityBar from './PhaserGame/TemporaryAbilityBar.svelte'
	import { gridSize, gravityPixelsPerSecond } from './PhaserGame/Constants'
	import { migrateLevel, migrateCharacter } from './PhaserGame/SaveDataMigrator'

	export let levelName = null
	let level

	export let characterName = null
	let character

	let scene

	// TODO: status text
	//   level: {}
	//   score: {}
	//   enemies left: {}

	// TODO: make editable in level or on individual enemies
	const attackRange = 400
	const followerLeashRange = 600

	let container

	let gameOver
	let gameWon
	let score
	let paused

	let blocks
	let backgroundBlocks
	let simpleBlocks
	let effectBlocks
	let consumableBlocks

	let config
	let game
	let preloadedData
	let cursors
	let keys = {}

	let gameWidth = 1200
	let viewportHeight = 600

	let maxLevelX
	let maxLevelY
	let player

	onMount(() => {
		character = migrateCharacter($project.characters[characterName])
		level = migrateLevel($project.levels[levelName])

		blocks = level.blocks
			.map(([name, x, y]) => ({
				...$project.blocks[name],
				x: x * gridSize,
				y: y * gridSize
			}))

		effectBlocks = blocks.filter(b => (b.damage > 0 || b.throwOnTouch) && !b.consumable)
		simpleBlocks = blocks.filter(b => (b.damage == null || b.damage == 0) && !b.throwOnTouch && !b.consumable && b.solid)
		backgroundBlocks = blocks.filter(b => (b.damage == null || b.damage == 0) && !b.throwOnTouch && !b.consumable && !b.solid)
		consumableBlocks = blocks.filter(b => b.consumable)

		start()
	})

	function start() {
		destroyGame()
		preload().then(() => {
			if (container == null) return

			gameOver = false
			gameWon = false
			paused = false
			score = 0
			gameWidth = window.innerWidth

			maxLevelX = Math.max(...level.blocks.map(b => b[1] + 1)) * gridSize
			maxLevelY = Math.max(...level.blocks.map(b => b[2] + 1)) * gridSize

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
						// debug: true,
					},
				},
				width: gameWidth,
				height: viewportHeight,
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
			const distinctBlocks = [...new Set(level.blocks.map(b => b[0]))].map(n => $project.blocks[n]).filter(b => b != null)
			const distinctEnemies = [...new Set(level.enemies.map(e => e[0]))].map(n => $project.enemies[n]).filter(e => e != null)
			const distinctCharacters = [...new Set([characterName, ...character.followers, ...distinctBlocks.flatMap(b => b.followerOnConsume || [])])].map(
				c => $project.characters[c]
			)
			const allArt = [
				...new Set([
					// blocks
					...distinctBlocks.map(b => b.graphic),

					// characters
					...distinctCharacters.flatMap(c => Object.keys(c.graphics).map(key => c.graphics[key])),

					// character abilities
					...distinctCharacters.flatMap(c => c.abilities.flatMap(a => Object.keys(a.graphics).map(key => a.graphics[key]))),

					// enemies
					...distinctEnemies.flatMap(e => Object.keys(e.graphics).map(key => e.graphics[key])),

					// enemy abilities
					...distinctEnemies
						.filter(e => e.abilities != null)
						.flatMap(e => e.abilities.flatMap(a => Object.keys(a.graphics).map(key => a.graphics[key]))),
				]),
			].filter(name => name != null)
			Promise.all(allArt.map(name => preloadArt(name))).then(data => {
				preloadedData = data
				resolve()
			})
		})
	}

	function preloadArt(name) {
		const art = $project.art[name]
		return new Promise((res, rej) => {
			const image = new Image()
			image.onload = () => {
				res({
					...art,
					image,
				})
			}
			image.src = art.png
		})
	}

	function onCreate() {
		scene = this
		// set bg color
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
		this.backgroundBlocksGroup = this.physics.add.staticGroup()
		backgroundBlocks.forEach(b => {
			const template = $project.blocks[b.name]
			const art = $project.art[template.graphic]
			const block = this.backgroundBlocksGroup.create(translateX(b.x, gridSize), translateY(b.y, gridSize), art.name)
			if (art.animated) block.anims.play(getAnimationKey(art.name), true)
		})
		this.simpleBlocksGroup = this.physics.add.staticGroup()
		simpleBlocks.forEach(b => {
			const template = $project.blocks[b.name]
			const art = $project.art[template.graphic]
			const block = this.simpleBlocksGroup.create(translateX(b.x, gridSize), translateY(b.y, gridSize), art.name)
			if (art.animated) block.anims.play(getAnimationKey(art.name), true)
		})
		this.effectBlocksGroup = this.physics.add.staticGroup()
		effectBlocks.forEach(b => {
			const template = $project.blocks[b.name]
			const art = $project.art[template.graphic]
			const block = this.effectBlocksGroup.create(translateX(b.x, gridSize), translateY(b.y, gridSize), art.name)
			if (art.animated) block.anims.play(getAnimationKey(art.name), true)
			block.template = b
		})
		this.consumableBlocksGroup = this.physics.add.staticGroup()
		consumableBlocks.forEach(b => {
			const template = $project.blocks[b.name]
			const art = $project.art[template.graphic]
			const block = this.consumableBlocksGroup.create(translateX(b.x, gridSize), translateY(b.y, gridSize), art.name)
			if (art.animated) block.anims.play(getAnimationKey(art.name), true)
			block.template = template
		})

		// configure input
		keys = {
			cursors: this.input.keyboard.createCursorKeys(),
		}
		const keysWeCareAbout = ['SPACE', 'ENTER', 'A', 'D', ...SkillKeys]
		keysWeCareAbout.forEach(k => {
			keys[k] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[k])
		})
		this.input.mouse.disableContextMenu()

		// add player
		const startingY =
			translateY(Math.max(...blocks.filter(b => b.x == 0).map(b => b.y)), gridSize) - $project.art[character.graphics.still].height
		const template = hydrateGraphics(character)
		player = this.physics.add.existing(
			new Player(this, translateX(0, template.graphics.still.width), startingY, character.graphics.still.name, template, keys)
		)
		this.player = player
		this.physics.add.collider(player, this.simpleBlocksGroup)
		this.physics.add.collider(player, this.effectBlocksGroup, onEffectBlockCollision)
		this.physics.add.overlap(player, this.consumableBlocksGroup, onConsumableBlockOverlap)

		// add player followers
		this.followers = this.physics.add.group()
		addFollowers(character.followers)
		this.physics.add.collider(this.followers, this.simpleBlocksGroup)
		this.physics.add.collider(this.followers, this.effectBlocksGroup, onEffectBlockCollision)

		// add enemies
		this.enemies = this.physics.add.group()
		level.enemies.forEach(([name, x, y]) => {
			const template = hydrateGraphics($project.enemies[name])
			const enemy = new Enemy(
				this,
				translateX(x * gridSize, template.graphics.still.width),
				translateY(y * gridSize, template.graphics.still.height),
				template.graphics.still.name,
				template,
				attackRange
			)
			this.enemies.add(enemy)
		})
		this.physics.add.collider(this.enemies, this.simpleBlocksGroup)
		this.physics.add.collider(this.enemies, this.effectBlocksGroup, onEffectBlockCollision)

		// camera and player bounds
		this.physics.world.setBounds(0, -maxLevelY, maxLevelX, maxLevelY + viewportHeight)
		this.cameras.main.setBounds(0, -maxLevelY, maxLevelX, maxLevelY + viewportHeight)
		this.cameras.main.startFollow(player)

		// score method
		let scoreText = this.add.text(10, 10, '')
		scoreText.setScrollFactor(0)
		scoreText.setColor('black')
		scoreText.setAlpha(0.8)
		this.addScore = function (s) {
			score += s
			scoreText.setText(`Score: ${score}`)
		}
		this.addScore(0)
	}

	function onUpdate() {
		if (Phaser.Input.Keyboard.JustDown(keys.ENTER)) start()
		if (gameOver) return

		// if player is dead or fell out bottom of world, you lose
		if (!player.alive) {
			this.physics.pause()
			gameOver = true
		}

		// if all enemies dead, you win
		if (this.enemies.countActive() == 0) {
			this.physics.pause()
			gameWon = true
			gameOver = true
		}
	}

	function addFollowers(followerNames) {
		if (followerNames == null || followerNames.length == 0) return
		followerNames.forEach(f => {
			const template = hydrateGraphics($project.characters[f])
			const y = player.body.y - (template.graphics.still.height - player.graphics.still.height)
			const follower = new Follower(scene, player.x, y, template.graphics.still.name, template, player, followerLeashRange)
			scene.followers.add(follower)
		})
	}

	function translateX(x, width) {
		return x + width / 2
	}

	function translateY(y, height) {
		return Math.max(maxLevelY, viewportHeight) - y - height / 2
	}

	function onEffectBlockCollision(sprite, block) {
		sprite.damage(block.template.damage)
		if (block.template.throwOnTouch) sprite.setVelocityY(-1000)
	}

	function onConsumableBlockOverlap(sprite, block) {
		if (block.template.healthOnConsume) sprite.heal(block.template.healthOnConsume)
		if (block.template.scoreOnConsume) sprite.scene.addScore(block.template.scoreOnConsume)
		if (block.template.throwOnTouch) sprite.setVelocityY(-1000)
		if (block.template.followerOnConsume != null) addFollowers(block.template.followerOnConsume)
		block.disableBody(true, true)
		block.destroy()
	}

	function hydrateGraphics(template) {
		const copy = JSON.parse(JSON.stringify(template))
		copy.graphics = hydrateGraphicsObject(copy.graphics)
		if (copy.abilities != null)
			copy.abilities = copy.abilities.map(a => ({
				...a,
				graphics: hydrateGraphicsObject(a.graphics),
			}))
		return copy
	}

	function hydrateGraphicsObject(graphics) {
		Object.keys(graphics).forEach(name => {
			graphics[name] = $project.art[graphics[name]] != null ? JSON.parse(JSON.stringify($project.art[graphics[name]])) : null
			if (graphics[name] != null && graphics[name].animated) graphics[name].width = graphics[name].frameWidth
			return graphics[name]
		})
		return graphics
	}
</script>

<style>
	.game-window {
		width: 100%;
		position: relative;
	}
</style>
