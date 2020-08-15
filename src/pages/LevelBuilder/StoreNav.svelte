<div class="list-group">
	<div
		class="list-group-item list-group-item-action"
		class:active={items[activeName] == null}
		href="#/"
		on:click|preventDefault={() => dispatch('create')}>
		New
	</div>
	{#each Object.keys(items) as itemName}
		<div class="list-group-item list-group-item-action" class:active={activeName == itemName} on:click={() => dispatch('edit', itemName)}>
			{itemName}
		</div>
	{/each}
</div>

<script>
	import { createEventDispatcher } from 'svelte'
	export let items = {}
	export let activeName = null
	const dispatch = createEventDispatcher()
</script>
