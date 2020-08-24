<QuickDropdown btnClass="color-picker-toggle" noCaret bind:isOpen>
	<span slot="label">
		<div class="color-choice" style="background: {getBackground(value)}" title="Change color" />
	</span>
	<div class="color-picker-choices">
		{#each colors as colorGroup}
			<div class="color-group">
				{#each colorGroup as color}
					<div
						class="color-choice"
						class:selected={value == color}
						on:click={() => select(color)}
						style="background: {getBackground(color)}; width: {colorSize}px; height: {colorSize}px;" />
				{/each}
			</div>
		{/each}
	</div>
</QuickDropdown>

<script>
	import QuickDropdown from './QuickDropdown.svelte'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let value = 'transparent'
	let alpha = 255
	let isOpen = false

	function select(color) {
		console.log(color)
		value = color
		dispatch('change', color)
		isOpen = false
	}

	function getBackground(color) {
		return color != 'transparent' ? color : 'repeating-linear-gradient(-45deg, transparent, #eee 10px)'
	}

	// super half-assed generated color groups
	const colorSteps = 10
	const colorDarknessSteps = 25
	const rainbowIntervals = [rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255)]
	const colorSize = 600 / colorSteps / rainbowIntervals.length
	let colors = []
	$: if (alpha != null)
		colors = (function () {
			let result = []
			let rainbow = []
			for (let i = 0; i < rainbowIntervals.length; i++) {
				rainbow = rainbow.concat(
					lerpColorsBetween(rainbowIntervals[i], i == rainbowIntervals.length - 1 ? rainbowIntervals[0] : rainbowIntervals[i + 1], colorSteps).slice(
						0,
						colorSteps - 1
					)
				)
			}

			let blackToGreySteps = rainbowIntervals.length * (colorSteps - 1)
			result.push(lerpColorsBetween(rgb(255, 255, 255), rgb(0, 0, 0), blackToGreySteps))

			for (let i = 1; i < colorDarknessSteps; i++) result.push(rainbow.map(r => darken(r, i / (colorDarknessSteps - 1))))
			for (let i = 1; i < colorDarknessSteps - 1; i++) result.push(rainbow.map(r => lighten(r, i / (colorDarknessSteps - 1))))

			return result.map(group => group.map(c => `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`))
		})()

	function rgb(r, g, b) {
		return { r, g, b }
	}

	function lerpColorsBetween(color1, color2, steps) {
		return [...Array(steps)].map((_, t) => lerpRGB(color1, color2, t / (steps - 1)))
	}

	function lerpRGB(color1, color2, t) {
		return {
			r: Math.round(color1.r + (color2.r - color1.r) * t),
			g: Math.round(color1.g + (color2.g - color1.g) * t),
			b: Math.round(color1.b + (color2.b - color1.b) * t),
		}
	}

	function lighten(color, t) {
		return {
			r: Math.min(Math.round(color.r + (255 - color.r) * t), 255),
			g: Math.min(Math.round(color.g + (255 - color.g) * t), 255),
			b: Math.min(Math.round(color.b + (255 - color.b) * t), 255),
		}
	}

	function darken(color, t) {
		return {
			r: Math.max(Math.round(color.r - 255 * (1 - t)), 0),
			g: Math.max(Math.round(color.g - 255 * (1 - t)), 0),
			b: Math.max(Math.round(color.b - 255 * (1 - t)), 0),
		}
	}
</script>

<style lang="scss">
	@import '../css/variables';

	:global(.color-picker-toggle .color-choice) {
		border-radius: 3px;
		height: 31px;
		width: 48px;
		padding: 12px 15px;
		@include med-box-shadow();
	}

	.color-group {
		clear: both;
		display: flex;
		flex-direction: row;
		align-items: flex-start;

		&:first-child {
			margin-bottom: 10px;
		}
	}

	.color-choice {
		position: relative;
		cursor: pointer;

		&:focus {
			outline: none;
		}
	}

	.color-picker-choices {
		padding: 5px;

		.color-choice {
			height: 30px;
			z-index: 9;
			color: #fff;

			&:hover,
			&.selected {
				@include big-box-shadow();
				z-index: 10;
				transform: scale(1.5);
				border: 1px solid white;
			}
		}
	}
</style>
