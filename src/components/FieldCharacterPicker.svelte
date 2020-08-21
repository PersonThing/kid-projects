<div class="form-group">
	<label for="graphic">
		<slot>Characters</slot>
	</label>
	<div>
		<InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>
			<Art name={$characterStore[option.value].graphicStill} />
			{option.value}
		</InputSelect>
	</div>
	<!-- <div class="options">
		{#each options as name}
			<div class:active={value.indexOf(name) > -1} on:click={() => toggle(name)}>
				<Art name={$characterStore[name].graphicStill} />
			</div>
		{/each}
	</div> -->
</div>

<script>
	import artStore from '../stores/art-store'
	import characterStore from '../stores/character-store'
	import Art from './Art.svelte'
	import InputSelect from './InputSelect.svelte'
	export let value = []

	$: options = Object.keys($characterStore)

	function toggle(name) {
		value = value.indexOf(name) > -1 ? value.filter(v => v != name) : [...value, name].sort()
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
		margin-right: 3px;
	}
	.options > div.active {
		background: #007bff;
		/* background: #28a745; */
	}
</style>
