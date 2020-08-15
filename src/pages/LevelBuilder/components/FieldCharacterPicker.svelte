<div class="form-group">
	<label for="graphic">
		<slot>Characters</slot>
	</label>
	<div class="options">
		{#each Object.keys($characterStore) as name}
			<div class:active={value.contains(name)} on:click={() => toggle(name)}>
				<Art name={$characterStore[name].graphicStill} />
			</div>
		{/each}
	</div>
</div>

<script>
	import artStore from '../../../stores/art-store'
	import characterStore from '../../../stores/character-store'
	import Art from './Art.svelte'
	export let value = []
	export let filter = null

	$: options = Object.keys($artStore).filter(name => filter == null || filter($artStore[name]))

	function toggle(name) {
		value = value.contains(name) ? value.filter(v => v != name) : [...value, name]
	}
</script>

<style>
	.options {
		overflow: auto;
	}
	.options > div {
		padding: 10px;
		float: left;
		border-radius: 0.25rem;
	}
	.options > div.active {
		background: #007bff;
	}
</style>
