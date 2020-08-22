<div class="form-group">
	<strong>
		<slot />
	</strong>

	<ArtPicker bind:value={value.art} />

	{#if value.art != null}
		<div class="card bg-light">
			<div class="card-body">
				<div>
					<label class="mb-0">
						<input type="checkbox" bind:checked={value.animated} />
						Animated
					</label>
				</div>
				{#if value.animated}
					<div class="mt-1">
						<label for="frame-width">Frame width</label>
						<input id="frame-width" type="number" bind:value={value.frameWidth} min={1} max={200} step={1} />

						<label for="frame-width">Frame rate</label>
						<input id="frame-rate" type="number" bind:value={value.frameRate} min={1} max={60} step={1} />

						<label>
							<input type="checkbox" bind:checked={value.yoyo} />
							Loop back
						</label>
					</div>
					<div class="frame-split-preview">
						<img src={$project.art[value.art].png} width={$project.art[value.art].width * 2} alt="preview frame splits" />
						{#each [...Array(numFrames)] as x, frameNumber}
							<div class="splitter" style="left: {value.frameWidth * 2 * frameNumber}px; width: {value.frameWidth * 2}px;">{frameNumber + 1}</div>
						{/each}
					</div>
					<div class="animation-preview" bind:this={phaserPreviewElement} />
				{/if}
			</div>
		</div>
	{/if}
</div>

<script>
	import { onMount, onDestroy } from 'svelte'
	import InputPngData from './InputPngData.svelte'
	import ArtPicker from './ArtPicker.svelte'
	import project from '../stores/active-project-store'
	import debounce from '../services/debounce'
	import Art from './Art.svelte'

	export let value = {
		art: null,
		frameWidth: 40,
		frameRate: 5,
	}
	let mounted = false
	let image

	let phaserPreviewElement
	let config
	let objects
	let game
	let cursors

	const reloadDebounced = debounce(reload, 50)
	$: if (value != null && value.art != null && mounted) reloadDebounced()
	$: numFrames = value.art != null ? Math.ceil($project.art[value.art].width / value.frameWidth) : 0
	// Math.ceil(art.width / value.frameWidth)

	onMount(() => {
		mounted = true
	})

	onDestroy(() => {
		destroyIfLoaded()
	})

	function destroyIfLoaded() {
		if (game != null) {
			game.destroy()
			if (phaserPreviewElement != null) {
				phaserPreviewElement.querySelectorAll('*').forEach(n => n.remove())
			}
		}
	}

	function reload() {
		image = new Image()
		image.onload = () => {
			destroyIfLoaded()

			if (phaserPreviewElement == null) return

			config = {
				type: Phaser.AUTO,
				parent: phaserPreviewElement,
				scene: {
					create: create,
				},
				physics: {
					default: 'arcade',
					arcade: {
						gravity: { y: 1500 },
						debug: false,
					},
				},
				width: $project.art[value.art].width * 2,
				height: $project.art[value.art].height * 2,
				pixelArt: true,
			}

			game = new Phaser.Game(config)
		}
		image.src = $project.art[value.art].png
	}

	function create() {
		const art = $project.art[value.art]

		this.textures.addSpriteSheet('preview-sprite-sheet', image, {
			frameWidth: value.frameWidth,
			frameHeight: art.height,
		})

		this.anims.create({
			key: 'preview-animation',
			frames: this.anims.generateFrameNumbers('preview-sprite-sheet', {
				start: 0,
				end: numFrames,
			}),
			frameRate: value.frameRate,
			repeat: -1,
			yoyo: value.yoyo,
		})

		objects = {}
		objects.player = this.physics.add.sprite(0, 0, 'preview-sprite-sheet')
		objects.player.setScale(2, 2)
		objects.player.setCollideWorldBounds(true)

		this.cameras.main.setBackgroundColor('#C6F4FF')
		objects.player.anims.play('preview-animation', true)
	}
</script>

<style lang="scss">
	.frame-split-preview {
		position: relative;
		padding-top: 10px;

		.splitter {
			position: absolute;
			top: 0;
			bottom: 0;
			border-right: 1px solid black;
			color: red;
			font-size: 10px;
			text-align: center;
		}
	}
</style>
