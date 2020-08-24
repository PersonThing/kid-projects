<FieldNumber name="dps" bind:value={input.dps}>DPS (when in contact with enemies - we will replace this with abilities later)</FieldNumber>

<FieldCheckbox name="canFly" bind:checked={input.canFly}>Can fly?</FieldCheckbox>

<FieldCheckbox name="canSpin" bind:checked={input.canSpin}>Can spin attack?</FieldCheckbox>
{#if input.canSpin}
	<div class="card bg-light mb-3">
		<div class="card-body">
			<FieldNumber name="spinDegreesPerFrame" bind:value={input.spinDegreesPerFrame} min={0} max={25}>Spin degrees per frame</FieldNumber>
			<FieldArtPicker bind:value={input.graphics.spinning} spin={previewFrame * input.spinDegreesPerFrame}>Spinning graphics</FieldArtPicker>
		</div>
	</div>
{/if}

<FieldCheckbox name="canFireProjectiles" bind:checked={input.canFireProjectiles}>
	Can fire projectiles? (Note: game doesn't actually support this yet, but you can set it up for now)
</FieldCheckbox>
{#if input.canFireProjectiles}
	<div class="card bg-light mb-3">
		<div class="card-body">
			<FieldNumber name="projectileDamage" bind:value={input.projectileDamage} min={0}>Projectile damage</FieldNumber>
			<FieldNumber name="projectileVelocity" bind:value={input.projectileVelocity} min={0} max={300}>Projectile velocity</FieldNumber>
			<FieldNumber name="projectileYStart" bind:value={input.projectileYStart} min={0} max={300}>Projectile start height</FieldNumber>
			<FieldNumber min={0} max={2} step={0.1} bind:value={input.projectileGravityMultiplier}>Projectile gravity multiplier</FieldNumber>
			<FieldArtPicker bind:value={input.graphicProjectile}>Projectile graphic</FieldArtPicker>
		</div>
		{#if input.graphicProjectile != null}
			<div class="motion-preview">
				<Art name={input.graphics.still} />
				<img
					src={$project.art[input.graphicProjectile].png}
					style="position: absolute; bottom: {projectileY}px; left: {$project.art[input.graphicProjectile].width * 2 + projectileX}px"
					alt="" />
			</div>
		{/if}
	</div>
{/if}

<script>
	import { onDestroy } from 'svelte'
	import Icon from 'svelte-awesome'
	import { spinner } from 'svelte-awesome/icons'
	import FieldNumber from './FieldNumber.svelte'
	import FieldArtPicker from './FieldArtPicker.svelte'
	import FieldCheckbox from './FieldCheckbox.svelte'
	import project from '../stores/active-project-store'
	import Art from './Art.svelte'

	// export let abilities = {}

	// todo kill this
	export let input = {}

	// animation preview stuff
	let projectileX = 0
	let projectilePosDir = 1
	let projectileY = 0
	let projectileVY = 0

	let lastRequestedFrame
	let previewFrame = 0
	animationLoop()
	function animationLoop() {
		previewFrame++

		// move the projectile if there is one
		projectileX += (input.projectileVelocity || 0) * projectilePosDir
		projectileY += projectileVY
		projectileVY -= 1 * input.projectileGravityMultiplier
		if (previewFrame % 50 == 0) {
			projectileX = 0
			projectileY = input.projectileYStart
			projectileVY = 0
		}

		lastRequestedFrame = window.requestAnimationFrame(animationLoop)
	}

	onDestroy(() => {
		window.cancelAnimationFrame(lastRequestedFrame)
	})
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
