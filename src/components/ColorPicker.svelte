<!-- <div class="color-picker">
	{#each colors as color}
		<button
			type="button"
			style="background: {color != 'transparent' ? color : 'linear-gradient(110deg, rgba(200,200,200,1) 45%, rgba(255,255,255,1) 55%, rgba(255,255,255,1) 100%)'}"
			class:active={color == value}
			on:click={() => selectColor(color)} />
	{/each}
</div> -->
<QuickDropdown btnClass="color-picker-toggle" noCaret anyItemClickCloses>
	<span slot="label">
		<div data-test={name} class="color-choice" style="background: {getBackground(value)}" title="Change color" />
	</span>
	<div class="color-picker-choices">
		{#each colors as color}
			<div class="color-choice" class:selected={value == color} on:click={() => select(color)} style="background: {getBackground(color)}">
				{#if value == color}
					<Icon data={checkIcon} />
				{/if}
			</div>
		{/each}
	</div>
</QuickDropdown>

<script>
	import QuickDropdown from './QuickDropdown.svelte'
	import Icon from 'svelte-awesome'
	import { check as checkIcon } from 'svelte-awesome/icons'

	export let value = 'transparent'

	function select(color) {
		value = color
	}

	function getBackground(color) {
		return color != 'transparent' ? color : 'repeating-linear-gradient(-45deg, transparent, #eee 10px)'
	}

	// random collection of colors kids requested.. lazy
	const colors = [
		'transparent',
		'white',
		'rgb(204, 204, 204)',
		'rgb(160, 164, 160)',
		'rgb(102, 102, 102)',
		'rgb(51, 51, 51)',
		'black',
		'rgb(119, 59, 11)',
		'blue',
		'pink',
		'yellow',
		'orange',
		'purple',
		'teal',
		'green',
		'rgb(40, 40, 184)',
		'rgb(40, 80, 224)',
		'rgb(80, 80, 248)',
		'rgb(120, 124, 248)',
		'rgb(160, 0, 16)',
		'red',
		'rgb(248, 0, 32)',
		'rgb(208, 124, 96)',
		'rgb(248, 208, 176)',
		'rgb(253, 240, 232)',
		'rgb(245, 222, 208)',
		'rgb(220, 201, 187)',
		'rgb(197, 179, 167)',
		'rgb(186, 167, 153)',
		'rgb(146, 129, 119)',
		'rgb(120, 107, 99)',
		'rgb(80, 68, 68)',
		'rgb(122, 80, 55)',
		'rgb(178, 105, 58)',
		'rgb(203, 140, 97)',
		'rgb(238, 187, 155)',
		'rgb(75, 53, 39)',
	]
</script>

<style lang="scss">
	@import '../css/variables';

	:global(.color-picker-toggle .color-choice) {
		@include med-box-shadow();
	}

	.color-choice {
		float: left;
		vertical-align: top;
		min-width: 48px;
		position: relative;
		height: 100%;
		color: #fff;
		text-align: center;
		padding: 12px 15px;
		cursor: pointer;

		&:focus {
			outline: none;
		}
	}

	.color-picker-choices {
		width: 347px;
		overflow: auto;
		padding: 5px;

		.color-choice {
			height: 30px;
			padding: 2px 15px;
			z-index: 9;
			color: #fff;

			&:hover,
			&.selected {
				@include big-box-shadow();
				z-index: 10;
				transform: scale(1.25);
			}
		}
	}
</style>
