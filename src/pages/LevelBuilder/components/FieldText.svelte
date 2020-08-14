<div class="form-group">
	<label for={name}>
		<slot />
	</label>
	<input {name} id={name} type="text" bind:value />
</div>

<script>
	export let value = null
	export let name = 'text'
</script>
