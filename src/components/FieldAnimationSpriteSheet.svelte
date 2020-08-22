<div class="form-group">
	<strong>
		<slot />
	</strong>

	<ArtPicker bind:value={value.art} />

	<div>
		<label for="frame-width">Frame width</label>
		<input id="frame-width" type="range" bind:value={value.frameWidth} min={1} max={200} step={1} />
		{value.frameWidth}
	</div>

	<div>
		<label for="frame-width">Frame rate</label>
		<input id="frame-rate" type="range" bind:value={value.frameRate} min={1} max={20} step={1} />
		{value.frameRate}
	</div>

	<div>PREVIEW ANIMATION HERE</div>
</div>

<script>
	import InputPngData from './InputPngData.svelte'
	import ArtPicker from './ArtPicker.svelte'

	export let value = {
		png: null,
		frameWidth: 40,
		frameRate: 5,
	}
</script>

<style>

</style>
