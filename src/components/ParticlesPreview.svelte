<div class="game-window">
	<div bind:this={container} />
</div>

<script>
	import { onMount, onDestroy } from 'svelte'
	import { rgbaStringToHex } from '../services/rgba-to-hex'
	import getAnimationKey from './PhaserGame/GetAnimationKey'
	import project from '../stores/active-project-store'
	import { createParticles } from '../services/particles'

	export let value
	export let previewBackgroundColor

	let container

	let config
	let game
	let preloadedData
	let scene

	onMount(() => {
		start()
	})

	function start() {
		destroyGame()
		preload().then(() => {
			if (container == null) return

			config = {
				type: Phaser.AUTO,
				parent: container,
				scene: {
					create: onCreate
				},
				physics: {
					default: 'arcade',
					arcade: {
						// gravity: { y: gravityPixelsPerSecond },
						// debug: true,
					},
				},
				width: 200,
				height: 400,
				pixelArt: true,
				render: {
					transparent: true
				}
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
			preloadArt(value.graphic).then(art => {
				preloadedData = [art]
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
		if (previewBackgroundColor != 'transparent' && previewBackgroundColor != null)
			this.cameras.main.setBackgroundColor(rgbaStringToHex(previewBackgroundColor))

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

		const { emitter } = createParticles(this, value)
    this.input.on('pointermove', pointer => {
      emitter.setPosition(pointer.x, pointer.y)
    })
	}
</script>
