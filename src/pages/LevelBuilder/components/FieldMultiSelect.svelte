<div class="form-group">
	<label for={name}>
		<slot />
	</label>
	<select multiple {name} id={name} bind:value class="form-control">
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>

<script>
	export let value = []
	export let name = 'select'
	export let options = []
</script>
