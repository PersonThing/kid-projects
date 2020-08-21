<div class="form-group">
	<label for={name}>
		<slot />
	</label>
	<input {name} id={name} type="text" bind:value class="form-control" bind:this={field} />
</div>

<script>
	import { onMount } from 'svelte'

	export let value = null
	export let name = 'text'

	let field
</script>
