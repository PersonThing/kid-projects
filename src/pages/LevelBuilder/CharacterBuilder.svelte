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
						<FieldNumber bind:value={input.framesPerGraphic} max={100}>Frames per graphic</FieldNumber>
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
					{#if previewMotionGraphic}
						<div>
							<div class="motion-preview" style="height: {$artStore[input.graphicStill].height * 2}px;">
								<LivingSprite x={0} vx={posDir} frame={previewFrame} {...input} hideHealth />
								<LivingSprite x={posX + $artStore[input.graphicStill].width * 2} vx={posDir} frame={previewFrame} {...input} hideHealth />
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
					<FieldNumber name="spinDegreesPerFrame" bind:value={input.spinDegreesPerFrame} min={0} max={25}>Spin degrees per frame</FieldNumber>
					<FieldArtPicker bind:value={input.graphicSpinning} filter={notBlockFilter} spin={previewFrame * input.spinDegreesPerFrame}>
						Spin attack graphic
					</FieldArtPicker>
				</div>
			</div>
		{/if}

		<FieldCheckbox name="canFireProjectiles" bind:checked={input.canFireProjectiles}>
			Can fire projectiles? (Note: game doesn't actually support this yet, but you can set it up for now)
		</FieldCheckbox>
		{#if input.canFireProjectiles}
			<div class="card bg-light">
				<div class="card-body">
					<FieldNumber name="projectileVelocity" bind:value={input.projectileVelocity} min={0} max={300}>Projectile velocity</FieldNumber>
					<FieldNumber name="projectileYStart" bind:value={input.projectileYStart} min={0} max={300}>Projectile start height</FieldNumber>
					<FieldNumber min={0} max={2} step={0.1} bind:value={input.projectileGravityMultiplier}>Projectile gravity multiplier</FieldNumber>
					<FieldArtPicker bind:value={input.graphicProjectile} filter={notBlockFilter}>Projectile graphic</FieldArtPicker>
				</div>
				{#if input.graphicProjectile != null}
					<div class="motion-preview">
						<img src={$artStore[input.graphicStill].png} />
						<img
							src={$artStore[input.graphicProjectile].png}
							style="position: absolute; bottom: {projectileY}px; left: {$artStore[input.graphicStill].width * 2 + 10 + projectileX}px" />
					</div>
				{/if}
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
	import { onDestroy } from 'svelte'
	import { push } from 'svelte-spa-router'
	import { remove as removeIcon } from 'svelte-awesome/icons'
	import artStore from '../../stores/art-store'
	import characters from '../../stores/character-store'
	import FieldArtPicker from './components/FieldArtPicker.svelte'
	import FieldCheckbox from './components/FieldCheckbox.svelte'
	import FieldNumber from './components/FieldNumber.svelte'
	import FieldRange from './components/FieldRange.svelte'
	import FieldText from './components/FieldText.svelte'
	import Form from './components/Form.svelte'
	import Icon from 'svelte-awesome'
	import LevelBuilderLayout from './components/LevelBuilderLayout.svelte'
	import LivingSprite from '../Play/LivingSprite.svelte'
	import validator from '../../services/validator'
	import Art from './components/Art.svelte'

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
	let projectileX = 0
	let projectilePosDir = 1
	let projectileY = 0
	let projectileVY = 0
	$: previewMotionGraphics = input.motionGraphics.length > 0 ? input.motionGraphics.filter(g => g != null) : [input.graphicStill]
	$: previewMotionGraphic = previewMotionGraphics[motionState] != null ? $artStore[previewMotionGraphics[motionState]].png : null

	let lastRequestedFrame
	let previewFrame = 0
	animationLoop()
	function animationLoop() {
		previewFrame++

		// move the character
		posX += (input.maxVelocity || 0) * posDir
		if (posX > 300 || posX < 0) posDir = posDir * -1

		// move the projectile if there is one
		projectileX += (input.projectileVelocity || 0) * projectilePosDir
		projectileY += projectileVY
		projectileVY -= 1 * input.projectileGravityMultiplier
		if (projectileX > 300) {
			projectileX = 0
			projectileY = input.projectileYStart
			projectileVY = 0
		}
		// console.log(projectileY, projectileVY)

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
			spinDegreesPerFrame: 15,

			canFireProjectiles: false,
			projectileYStart: 20,
			projectileVelocity: 20,
			projectileGravityMultiplier: 0.1,
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
		overflow: hidden;

		img {
			position: relative;
		}
	}

	:global(.motion-graphics-fields > div) {
		margin-right: 5px;
	}
</style>
