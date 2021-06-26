<a href="{baseUrl}/{t.slug}/new" class="sub-nav-item" class:new={store[activeId] == null}>+ New {t.singular}</a>
{#each Object.values(store).sort() as item}
	<a class="sub-nav-item" href="{baseUrl}/{item.id}">
		{#if slug != 'levels'}
			<Art id={slug == 'art' ? item.id : getGraphic(item, t.graphicKey)} scale={1} />
		{:else}
			<div class="art-preview">
				<img src={item.thumbnail} />
			</div>
		{/if}
		<div class="flex-column">
			<span>{item.name}</span>
		</div>
	</a>
{/each}

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'
	export let store
	export let slug

	$: baseUrl = `#/${$project.name}/build/${slug}`

	function getGraphic(item, key) {
		key.split('.').forEach(p => {
			item = item[p]
		})
		return item
	}
</script>