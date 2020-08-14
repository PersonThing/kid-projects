<form on:submit|preventDefault>
	<div class="card">
		<div class="card-body">
			<slot />
		</div>
		<div class="card-footer">
			<SaveBtn />
			<slot name="buttons" />
		</div>
	</div>
</form>

<script>
	import SaveBtn from './SaveBtn.svelte'
</script>
