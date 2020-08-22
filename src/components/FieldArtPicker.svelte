<div class="form-group">
	<label for="graphic">
		<slot>Graphic</slot>
	</label>
	<ArtPicker bind:value {name} {placeholder} {spin} {blocks} />
</div>

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	import InputSelect from './InputSelect.svelte'
	import ArtPicker from './ArtPicker.svelte'
	export let value = null
	export let spin = 0
	export let name = 'graphic-picker'
	export let placeholder = 'Select art'
	export let blocks = false
</script>
