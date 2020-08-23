<div class="form-group">
	<strong>
		<slot />
	</strong>

	<ArtPicker bind:value />
</div>

<script>
	import AnimationPreview from './AnimationPreview.svelte'
	import Art from './Art.svelte'
	import ArtPicker from './ArtPicker.svelte'
	import InputPngData from './InputPngData.svelte'
	import project from '../stores/active-project-store'

	export let value = null

	$: art = value != null ? $project.art[value] : null
</script>
