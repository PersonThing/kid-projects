<div class="form-group">
	<label>
		<slot />
	</label>
	{#each abilities as a, i}
		<div class="card bg-light">
			<div class="card-body">
				<FieldNumber name="ability-damage-{i}" bind:value={a.damage}>Damage</FieldNumber>
				<FieldCheckbox name="ability-ranged-{i}" bind:checked={a.ranged}>Ranged?</FieldCheckbox>
				{#if a.ranged}
					<FieldNumber name="ability-projectile-velocity-x-{i}" bind:value={a.projectileVelocityX}>Projectile velocity X</FieldNumber>
					<FieldNumber name="ability-projectile-velocity-y-{i}" bind:value={a.projectileVelocityY}>Projectile velocity Y</FieldNumber>
					<FieldNumber name="ability-projectile-gravity-multiplier-{i}" min={0} step={0.01} max={1} bind:value={a.projectileGravityMultiplier}>
						Gravity multiplier
					</FieldNumber>
					<FieldArtPicker name="ability-graphics-projectile-{i}" bind:value={a.graphics.projectile}>Projectile graphic</FieldArtPicker>
					<FieldArtPicker name="ability-graphics-character-{i}" bind:value={a.graphics.character}>Character graphic</FieldArtPicker>
				{/if}
			</div>
		</div>
	{/each}
	<div>
		<button on:click={addAbility} class="btn btn-success btn-sm">
			<Icon data={plusIcon} />
			Add ability
		</button>
	</div>
</div>

<script>
	import FieldCheckbox from './FieldCheckbox.svelte'
	import FieldNumber from './FieldNumber.svelte'
	import FieldArtPicker from './FieldArtPicker.svelte'
	import Icon from 'svelte-awesome'
	import { plus as plusIcon } from 'svelte-awesome/icons'

	export let abilities = []

	function addAbility() {
		abilities = abilities.concat(createDefaultAbility())
	}

	function createDefaultAbility() {
		return {
			ranged: false,
			damage: 50,
			projectileVelocityX: 500,
			projectileVelocityY: 0,
			projectileGravityMultiplier: 0.1,

			graphics: {
				character: null,
				projectile: null,
			},

			// TODO: settings for emitters or other cool stuff Phaser can do?
		}
	}

	/*
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
{/if}<script>
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
*/
</script>
