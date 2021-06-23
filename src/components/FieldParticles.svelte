<div class="form-group">
	<strong>
		<slot>Particles</slot>
	</strong>
	<ParticlesPicker {name} bind:value />
</div>

<script>
	import ParticlesPicker from './ParticlesPicker.svelte'
	export let value = null
	export let name = 'particles-picker'
</script>
