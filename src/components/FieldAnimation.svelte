<div class="form-group">
	<strong>
		<slot />
	</strong>
	<div class="card bg-light mb-3">
		<div class="card-body">
			<div class="flex align-top motion-graphics-fields">
				<FieldNumber bind:value={framesPerGraphic} max={100}>Frames per graphic</FieldNumber>
				<FieldCheckbox bind:checked={loopBack}>Loop backwards, or start from beginning?</FieldCheckbox>
				{#each graphics as g, index}
					<FieldArtPicker bind:value={g}>
						Frame {index + 1}
						<a href="#/" class="text-danger" on:click|preventDefault={() => removeFrame(index)}>
							<Icon data={removeIcon} />
						</a>
					</FieldArtPicker>
				{/each}
				<button type="button" class="btn btn-sm btn-info" on:click={addFrame}>Add frame</button>
			</div>
			{#if previewGraphic != null}
				<div>
					<div class="motion-preview" style="height: {previewGraphic.height * 2}px;">
						<LivingSprite x={0} vx={posDir} frame={previewFrame} hideHealth motionGraphics={graphics} {framesPerGraphic} />
						<LivingSprite
							x={posX + previewGraphic.width * 2}
							vx={posDir}
							frame={previewFrame}
							hideHealth
							motionGraphics={graphics}
							{framesPerGraphic} />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<script>
	import { onDestroy } from 'svelte'
	import { remove as removeIcon } from 'svelte-awesome/icons'
	import project from '../stores/active-project-store'
	import FieldArtPicker from './FieldArtPicker.svelte'
	import FieldNumber from './FieldNumber.svelte'
	import Icon from 'svelte-awesome'
	import LivingSprite from './LivingSprite.svelte'
	import FieldCheckbox from './FieldCheckbox.svelte'

	export let graphics = []
	export let framesPerGraphic = 5
	export let loopBack = true
	export let vx = 5

	let motionState = 0
	let motionDelta = 1
	let posX = 0
	let posDir = 1
	let lastRequestedFrame
	let previewFrame = 0

	$: previewGraphics = graphics.length > 0 ? graphics.filter(g => g != null) : []
	$: previewGraphic = previewGraphics != null && previewGraphics[motionState] != null ? $project.art[previewGraphics[motionState]] : null

	animationLoop()

	function animationLoop() {
		previewFrame++

		posX += (vx || 0) * posDir
		if (posX > 500 || posX < 0) posDir = posDir * -1

		lastRequestedFrame = window.requestAnimationFrame(animationLoop)
	}

	onDestroy(() => {
		window.cancelAnimationFrame(lastRequestedFrame)
	})

	function addFrame() {
		graphics = [...graphics, null]
	}

	function removeFrame(index) {
		graphics.splice(index, 1)
		graphics = graphics
	}
</script>
