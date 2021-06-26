<BuildLayout tab="particles" activeId={input.id} store={$project.particles}>
	<Form on:submit={save} {hasChanges}>
		<div class="flex align-top g1">
			<div class="flex-grow">
				<FieldText name="name" bind:value={input.name} placeholder="Type a name...">Name</FieldText>
				<FieldArtPicker bind:value={input.graphic}>Graphic</FieldArtPicker>
				<FieldCheckbox name="bring-to-front" bind:checked={input.bringToFront}>Render in front of graphic?</FieldCheckbox>
				<FieldRange name="alpha-start" bind:value={input.alpha.start} min=0 max=1 step=0.1>Alpha start</FieldRange>
				<FieldRange name="alpha-end" bind:value={input.alpha.end} min=0 max=1 step=0.1>Alpha end</FieldRange>
				<FieldNumber name="scale-start" bind:value={input.scale.start} min=0 max=10 step=0.01>Scale start</FieldNumber>
				<FieldNumber name="scale-end" bind:value={input.scale.end} min=0 max=10 step=0.01>Scale end</FieldNumber>
				<FieldNumber name="speed" bind:value={input.speed} min=0 max=500 step=1>Speed</FieldNumber>
				<FieldNumber name="angle-min" bind:value={input.angle.min} min=-180 max=180 step=1>Angle min</FieldNumber>
				<FieldNumber name="angle-max" bind:value={input.angle.max} min=-180 max=180 step=1>Angle max</FieldNumber>
				<FieldNumber name="lifespan" bind:value={input.lifespan} min=0 max=10000 step=1>Lifespan (MS)</FieldNumber>
				<FieldNumber name="frequency" bind:value={input.frequency} min=1 max=10000 step=1>Spawn frequency (MS)</FieldNumber>
				<div class="form-group">
					<label for="blend-mode">Blend mode</label>
					<InputSelect name="blend-mode" options={[{value: null, label: 'None'},'SCREEN', 'MULTIPLY', 'ADD', 'ERASE']} bind:value={input.blendMode} />
				</div>
				<div class="form-group">
					<label for="color-rgba">Tint</label>
					<ColorPicker bind:value={input.colorRgba} />
				</div>
				<!-- TODO: preview the particles -->
			</div>
			<div style="width: 200px;">
				{#if input.graphic && canRender}
					<ParticlesPreview value={input} {previewBackgroundColor} />
				{/if}
				<ColorPicker bind:value={previewBackgroundColor} />
			</div>
		</div>

		<span slot="buttons">
			{#if !isAdding}
				<button type="button" class="btn btn-danger" on:click={del}>Delete</button>
			{/if}
		</span>
	</Form>
</BuildLayout>

<script>
	import { buildDefaultParticlesConfig } from '../../services/particles'
	import { push } from 'svelte-spa-router'
	import BuildLayout from '../../components/BuildLayout.svelte'
	import ColorPicker from '../../components/ColorPicker.svelte'
	import FieldArtPicker from '../../components/FieldArtPicker.svelte'
	import FieldNumber from '../../components/FieldNumber.svelte'
	import FieldRange from '../../components/FieldRange.svelte'
	import FieldText from '../../components/FieldText.svelte'
	import Form from '../../components/Form.svelte'
	import InputSelect from '../../components/InputSelect.svelte'
	import ParticlesPreview from '../../components/ParticlesPreview.svelte'
	import project from '../../stores/active-project-store'
	import validator from '../../services/validator'
	import { getNextId } from '../../stores/project-store'
import FieldCheckbox from '../../components/FieldCheckbox.svelte';

	export let params = {}

	let input = createDefaultInput()
	let previewBackgroundColor = 'rgba(43, 43, 43, 255)'
	let canRender = false

	$: paramId = decodeURIComponent(params.id) || 'new'
	$: paramId == 'new' ? create() : edit(paramId)
	$: isAdding = input.id == null
	$: hasChanges = input != null && !validator.equals(input, $project.particles[input.id])

	// re-render preview whenever anything in input or preview background color changes
	$: if (input && previewBackgroundColor) {
		canRender = false
		setTimeout(function() {
			canRender = true
		}, 0)
	}

	function save() {
		if (validator.empty(input.name)) {
			document.getElementById('name').focus()
			return
		}
		if (isAdding) input.id = getNextId($project.particles)
		$project.particles[input.id] = JSON.parse(JSON.stringify(input))
		push(`/${$project.name}/build/particles/${encodeURIComponent(input.id)}`)
	}

	function edit(name) {
		if (!$project.particles.hasOwnProperty(name)) return
		input = {
			...buildDefaultParticlesConfig(),
			...JSON.parse(JSON.stringify($project.particles[name])),
		}
	}

	function create() {
		input = createDefaultInput()
	}

	function createDefaultInput() {
		return buildDefaultParticlesConfig()
	}

	function del() {
		if (confirm(`Are you sure you want to delete "${input.name}"?`)) {
			delete $project.particles[input.id]
			$project.particles = $project.particles
			push(`/${$project.name}/build/particles/new`)
		}
	}
</script>