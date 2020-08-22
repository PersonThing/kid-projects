<div class="form-group">
	<strong>
		<slot />
	</strong>

	<ArtPicker bind:value={value.art} />

	{#if value.art != null}
		<div class="card bg-light">
			<div class="card-body">
				<div>
					<label for="frame-width">Frame width</label>
					<input id="frame-width" type="range" bind:value={value.frameWidth} min={1} max={200} step={1} />
					{value.frameWidth}
				</div>

				<div>
					<label for="frame-width">Frame rate</label>
					<input id="frame-rate" type="range" bind:value={value.frameRate} min={1} max={20} step={1} />
					{value.frameRate}
				</div>

				<div id="{name}-preview" bind:this={phaserPreviewElement}>PREVIEW ANIMATION HERE</div>
			</div>
		</div>
	{/if}
</div>

<script>
	import { onMount } from 'svelte'
	import InputPngData from './InputPngData.svelte'
	import ArtPicker from './ArtPicker.svelte'
	import project from '../stores/active-project-store'

	export let name = 'sprite-animation'

	export let value = {
		png: null,
		frameWidth: 40,
		frameRate: 5,
	}

	let phaserPreviewElement

	// when value changes, update phaser...
	let config
	let objects
	let game
	let image

	let mounted = false
	onMount(() => {
		mounted = true
	})

	$: if (value != null && value.art != null && mounted) {
		console.log('reactive')
		if (game != null) game.destroy()
		preload().then(() => {
			config = {
				type: Phaser.AUTO,
				parent: `${name}-preview`,
				scene: {
					create: create,
					update: update,
				},
				width: 500,
				height: $project.art[value.art].height,
			}
			game = new Phaser.Game(config)
		})
	}

	function preload() {
		return new Promise((resolve, reject) => {
			image = new Image()
			image.onload = () => resolve()
			image.src = $project.art[value.art].png
		})
	}

	function create() {
		objects = {}

		this.textures.addSpriteSheet('sprites', image, {
			frameWidth: value.frameWidth,
			frameRate: value.frameRate,
		})

		this.anims.create({
			key: 'animation',
			frames: this.anims.generateFrameNumbers('sprites', { start: 0, end: Math.floor($project.art[value.art].width / value.frameWidth) }),
			frameRate: value.frameRate,
			repeat: -1,
		})

		// objects.player = this.physics.add.sprite(0, 0, 'sprites')
		// objects.player.setCollideWorldBounds(true)
	}

	function update() {}
</script>

<style>

</style>
