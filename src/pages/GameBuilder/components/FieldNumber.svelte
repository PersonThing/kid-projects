<div class="form-group">
	<label for={name}>
		<slot />
	</label>
	<input {name} id={name} type="number" bind:value {min} {max} />
</div>

<script>
	export let value = null
	export let name = 'num'
	export let min = null
	export let max = null
</script>
