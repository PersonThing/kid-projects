<!-- Fields for each character:
<ul>
	<li>Standing still graphic (import from pixel art maker)</li>
	<li>(optional) Moving graphic 1</li>
	<li>(optional) Moving graphic 2</li>
	<li>(optional) Moving graphic 3</li>
	<li>Maximum velocity on ground</li>
	<li>Jump velocity</li>
	<li>Gravity Modifier 0-1 (0 = don't fall at all (if 0, need to give a down key), 1 = normal falling speed)</li>
	<li>Fall damage multiplier 0-1 (0 = no fall damage, 1 = normal fall damage)</li>
	<li>Max health</li>
	<li>Abilities... need scripts for them... come up with something pluggable?</li>
</ul> -->

<LevelBuilderLayout tab="characters" activeName={input.name} store={$characters}>
	<Form on:submit={save} {hasChanges}>
		<FieldText name="name" bind:value={input.name} autofocus>Name</FieldText>
		<FieldArtPicker bind:value={input.graphicStill} filter={notBlockFilter}>Standing still graphic</FieldArtPicker>
		<div class="form-group">
			<label>Motion graphics</label>
			<div class="card bg-light">
				<div class="card-body">
					<div class="flex align-top motion-graphics-fields">
						{#each input.motionGraphics as g, index}
							<FieldArtPicker bind:value={g} filter={notBlockFilter}>
								Frame {index + 1}
								<a href="#/" class="text-danger" on:click|preventDefault={() => removeMotionGraphicFrame(index)}>
									<Icon data={removeIcon} />
								</a>
							</FieldArtPicker>
						{/each}
						<button type="button" class="btn btn-sm btn-info" on:click={addMotionGraphicFrame}>Add frame</button>
					</div>
					<FieldNumber bind:value={input.framesPerGraphic} max={100}>Frames per graphic (60 = 1 second)</FieldNumber>
					{#if previewMotionGraphic}
						<div>
							<input type="checkbox" bind:checked={previewMoving} id="moving" />
							<label for="moving">Preview moving</label>
							<div class="motion-preview" style="height: {$artStore[input.graphicStill].height * 2}px;">
								<LivingSprite x={posX} vx={posDir} frame={previewFrame} {...input} hideHealth />
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<!--
			todo, let them select up to 3 moving graphics to cycle through
			sprite will sit on each graphic for X # of frames?
			<FieldArtPicker bind:value={input.graphicMoving1} filter={notBlockFilter}>Moving graphics</FieldArtPicker>
		-->
		<FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>Max velocity</FieldNumber>
		<FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>Jump velocity</FieldNumber>
		<FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>Gravity multiplier</FieldNumber>
		<FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>Fall damage multiplier</FieldNumber>
		<FieldNumber name="maxHealth" bind:value={input.maxHealth}>Max health</FieldNumber>
		<FieldNumber name="dps" bind:value={input.dps}>DPS (when in contact with enemies - we will replace this with abilities later)</FieldNumber>
		<FieldCheckbox name="canFly" bind:checked={input.canFly}>Can fly?</FieldCheckbox>
		<FieldCheckbox name="canSpin" bind:checked={input.canSpin}>Can spin attack?</FieldCheckbox>
		{#if input.canSpin}
			<div class="card bg-light">
				<div class="card-body">
					<FieldArtPicker bind:value={input.graphicSpinning} filter={notBlockFilter} spin>Spin attack graphic</FieldArtPicker>
				</div>
			</div>
		{/if}
		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={() => del(input.name)}>Delete</button>
			{/if}
		</span>
	</Form>
</LevelBuilderLayout>

<script>
	import { push } from 'svelte-spa-router'
	import characters from '../../stores/character-store'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldArtPicker from './components/FieldArtPicker.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import FieldText from './components/FieldText.svelte'
	import Form from './components/Form.svelte'
	import LevelBuilderLayout from './components/LevelBuilderLayout.svelte'
	import validator from '../../services/validator'
	import artStore from '../../stores/art-store'
	import { onDestroy } from 'svelte'
	import Icon from 'svelte-awesome'
	import { remove as removeIcon } from 'svelte-awesome/icons'
	import LivingSprite from '../Play/LivingSprite.svelte'

	const notBlockFilter = b => b.width != 20 || b.height != 20

	export let params = {}
	let input = {}
	$: paramName = decodeURIComponent(params.name) || 'new'
	$: paramName == 'new' ? create() : edit(paramName)
	$: isAdding = paramName == 'new'
	$: hasChanges = input != null && !validator.equals(input, $characters[input.name])

	// animation preview stuff
	let motionState = 0
	let motionDelta = 1
	let posX = 0
	let posDir = 1
	let previewMoving = true
	$: previewMotionGraphics = input.motionGraphics.length > 0 ? input.motionGraphics.filter(g => g != null) : [input.graphicStill]
	$: previewMotionGraphic = previewMotionGraphics[motionState] != null ? $artStore[previewMotionGraphics[motionState]].png : null

	let lastRequestedFrame
	let previewFrame = 0
	animationLoop()
	function animationLoop() {
		previewFrame++

		// move the character
		if (previewMoving) {
			posX += (input.maxVelocity || 0) * posDir
			if (posX > 300 || posX < 0) posDir = posDir * -1
		} else {
			posX = 0
			posDir = 1
		}
		lastRequestedFrame = window.requestAnimationFrame(animationLoop)
	}
	onDestroy(() => {
		window.cancelAnimationFrame(lastRequestedFrame)
	})
	function addMotionGraphicFrame() {
		input.motionGraphics = [...input.motionGraphics, null]
	}
	function removeMotionGraphicFrame(index) {
		input.motionGraphics.splice(index, 1)
		input.motionGraphics = input.motionGraphics
	}
	// end animation preview stuff

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		$characters[input.name] = JSON.parse(JSON.stringify(input))
		push(`/level-builder/characters/${encodeURIComponent(input.name)}`)
	}

	function edit(name) {
		if (!$characters.hasOwnProperty(name)) return
		input = {
			...createDefaultInput(),
			...JSON.parse(JSON.stringify($characters[name])),
		}
	}

	function create() {
		input = createDefaultInput()
	}

	function createDefaultInput() {
		return {
			graphicStill: null,
			graphicSpinning: null,
			motionGraphics: [null],
			framesPerGraphic: 5,
			name: '',
			maxHealth: 100,
			maxVelocity: 5,
			jumpVelocity: 10,
			gravityMultiplier: 1,
			fallDamageMultiplier: 1,
			dps: 100,
			canFly: false,
			canSpin: true,
		}
	}

	function del(name) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			delete $characters[name]
			$characters = $characters
			push('/level-builder/characters/new')
		}
	}
</script>

<style lang="scss">
	.motion-preview {
		position: relative;
		background: #eee;
		padding: 20px;

		img {
			position: relative;
		}
	}

	:global(.motion-graphics-fields > div) {
		margin-right: 5px;
	}
</style>
