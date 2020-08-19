<form on:submit|preventDefault>
	<div class="card">
		<div class="card-header flex">
			<SaveBtn disabled={!hasChanges} />
			<slot name="buttons" />
		</div>
		<div class="card-body">
			<slot />
		</div>
	</div>
</form>

<script>
	import SaveBtn from './SaveBtn.svelte'

	export let hasChanges = true
</script>
