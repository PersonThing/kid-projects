<div class="list-group">
	<a href="{href}/new" class="list-group-item list-group-item-action" class:list-group-item-success={items[activeName] == null}>New</a>
	{#each Object.keys(items) as itemName}
		<a class="list-group-item list-group-item-action" class:active={activeName == itemName} href="{href}/{itemName}">{itemName}</a>
	{/each}
</div>

<script>
	import { createEventDispatcher } from 'svelte'
	export let items = {}
	export let activeName = null
	export let href = ''
	const dispatch = createEventDispatcher()
</script>
