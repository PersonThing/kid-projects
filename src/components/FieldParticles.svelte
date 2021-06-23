<FieldCheckbox name="{name}Enabled" bind:checked={value.enabled}>Emit particles?</FieldCheckbox>
{#if value.enabled}
	<div class="field-group flex align-top g1">
		<div style="width: 200px;">
			{#if value.graphic && canRender}
				<ParticlesPreview value={value} {previewBackgroundColor} />
			{/if}
			<ColorPicker bind:value={previewBackgroundColor} />
		</div>
		<div class="flex-grow">
			<FieldArtPicker bind:value={value.graphic}>Graphic</FieldArtPicker>
			<FieldRange name="{name}-alpha-start" bind:value={value.alpha.start} min=0 max=1 step=0.1>Alpha start</FieldRange>
			<FieldRange name="{name}-alpha-end" bind:value={value.alpha.end} min=0 max=1 step=0.1>Alpha end</FieldRange>
			<FieldNumber name="{name}-scale-start" bind:value={value.scale.start} min=0 max=10 step=0.01>Scale start</FieldNumber>
			<FieldNumber name="{name}-scale-end" bind:value={value.scale.end} min=0 max=10 step=0.01>Scale end</FieldNumber>
			<FieldNumber name="{name}-speed" bind:value={value.speed} min=0 max=500 step=1>Speed</FieldNumber>
			<FieldNumber name="{name}-angle-min" bind:value={value.angle.min} min=-180 max=180 step=1>Angle min</FieldNumber>
			<FieldNumber name="{name}-angle-max" bind:value={value.angle.max} min=-180 max=180 step=1>Angle max</FieldNumber>
			<FieldNumber name="{name}-lifespan" bind:value={value.lifespan} min=0 max=10000 step=1>Lifespan (MS)</FieldNumber>
			<FieldNumber name="{name}-frequency" bind:value={value.frequency} min=1 max=10000 step=1>Spawn frequency (MS)</FieldNumber>
			<div class="form-group">
				<label for="{name}-blend-mode">Blend mode</label>
				<InputSelect name="{name}-blend-mode" options={[{value: null, label: 'None'},'SCREEN', 'MULTIPLY', 'ADD', 'ERASE']} bind:value={value.blendMode} />
			</div>
			<div class="form-group">
				<label for="{name}-color-rgba">Tint</label>
				<ColorPicker bind:value={value.colorRgba} />
			</div>
			<!-- TODO: preview the particles -->
		</div>
	</div>
{/if}

<script>
	import ColorPicker from './ColorPicker.svelte'
	import FieldArtPicker from './FieldArtPicker.svelte'
	import FieldCheckbox from './FieldCheckbox.svelte'
	import FieldNumber from './FieldNumber.svelte'
	import FieldRange from './FieldRange.svelte'
	import InputSelect from './InputSelect.svelte'
	import { buildDefaultParticlesConfig } from '../services/particles'
	import ParticlesPreview from './ParticlesPreview.svelte'

	export let name = 'particles'
	export let value = buildDefaultParticlesConfig()

	let previewBackgroundColor = 'rgba(43, 43, 43, 255)'
	let canRender = false

	$: if (value.frequency == null) {
		value = {
			...buildDefaultParticlesConfig(),
			...value
		}
	}

	// re-render preview whenever anything in value or preview background color changes
	$: if (value && previewBackgroundColor) {
		canRender = false
		setTimeout(function() {
			canRender = true
		}, 0)
	}
</script>