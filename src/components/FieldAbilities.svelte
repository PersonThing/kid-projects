<div class="form-group">
	<label>
		<slot />
	</label>
	<div class="card bg-light mb-2">
		<div class="card-body">
			<table class="table">
				<thead>
					<tr>
						<th />
						{#if requireKeybinds}
							<th>Key</th>
						{:else}
							<th>Range</th>
						{/if}
						<th>Name</th>
						<th>Graphic</th>
						<th>Damage per hit</th>
						<th>Attack rate (MS)</th>
						<th>Projectile?</th>
						<th>Projectile Graphic</th>
						<th>Projectile Velocity</th>
						<th>Projectile Gravity Multiplier</th>
					</tr>
				</thead>

				<tbody>
					{#each abilities as a, i}
						<tr>
							<td>
								<button type="button" class="btn btn-danger" on:click={() => removeAbility(i)}>
									<Icon data={removeIcon} />
								</button>
							</td>
							{#if requireKeybinds}
								<td>
									<InputSelect name="ability-key-{i}" inline options={availableKeys} let:option bind:value={a.key}>{option.value}</InputSelect>
								</td>
							{:else}
								<td>
									<input type="number" min={0} max={10000} bind:value={a.range} />
								</td>
							{/if}
							<td>
								<input type="text" bind:value={a.name} />
							</td>
							<td>
								<FieldArtPicker name="ability-graphics-character-{i}" bind:value={a.graphics.character} placeholder="Character graphic" />
							</td>
							<td />
							<td>
								<input type="number" bind:value={a.damage} />
							</td>
							<td>
								<input type="number" bind:value={a.attackRateMs} min={0} max={120000} />
							</td>
							<td>
								<input type="checkbox" bind:checked={a.projectile} />
							</td>
							{#if a.projectile}
								<td>
									<FieldArtPicker name="ability-graphics-projectile-{i}" bind:value={a.graphics.projectile} placeholder="Projectile graphic" />
								</td>
								<td>
									<input type="number" bind:value={a.projectileVelocity} min={0} max={10000} />
								</td>
								<!-- <td>
									<input type="number" bind:value={a.projectileGravityMultiplier} min={0} max={1} step={0.01} />
								</td> -->
							{:else}
								<td colspan="4" />
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<div>
		<button on:click={addAbility} class="btn btn-success btn-sm" type="button">
			<Icon data={plusIcon} />
			Add ability
		</button>
	</div>
</div>

<script>
	import { plus as plusIcon, remove as removeIcon } from 'svelte-awesome/icons'
	import FieldArtPicker from './FieldArtPicker.svelte'
	import FieldCheckbox from './FieldCheckbox.svelte'
	import FieldNumber from './FieldNumber.svelte'
	import FieldText from './FieldText.svelte'
	import Icon from 'svelte-awesome'
	import InputSelect from './InputSelect.svelte'

	export let abilities = []
	export let requireKeybinds = true // whether to show key bind field

	const availableKeys = ['Q', 'W', 'E', 'R']

	function addAbility() {
		abilities = abilities.concat(createDefaultAbility())
	}

	function removeAbility(i) {
		abilities.splice(i, 1)
		abilities = abilities
	}

	function createDefaultAbility() {
		return {
			name: '',
			key: 'R',
			projectile: false,
			range: 400,
			damage: 50,
			attackRateMs: 500,
			projectileVelocity: 500,
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

<style lang="scss">
	.table {
		thead th {
			border-top: none;
		}
	}
</style>
