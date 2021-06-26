<ul class="nav nav-tabs">
	{#each tabs as t}
		<li class="nav-item">
			<a class="nav-link" class:active={tab == t.slug} href="{baseUrl}/{t.slug}/new">{t.name}</a>
		</li>
	{/each}
</ul>

<div class="page-container">
	<div class="nav-container">
		{#each tabs as t (t.name)}
			{#if t.slug == tab}
				<a href="{baseUrl}/{t.slug}/new" class="sub-nav-item" class:new={store[activeName] == null}>+ New {t.singular}</a>
				{#each Object.values(store).sort() as item}
					<a class="sub-nav-item" class:active={activeName == item.name} href="{baseUrl}/{t.slug}/{item.id}">
						{#if tab != 'levels'}
							<Art id={tab == 'art' ? item.id : getGraphic(item, t.graphicKey)} scale={1} />
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
			{/if}
		{/each}
	</div>

	<div class="content-container">
		<slot />
	</div>
</div>

<script>
	import Art from './Art.svelte'
	import project from '../stores/active-project-store'

	export let tab
	export let activeName
	export let store

	$: baseUrl = `#/${$project.name}/build`

	const tabs = [
		{ name: 'Art', singular: 'art' },
		{ name: 'Particles', singular: 'particle effect', graphicKey: 'graphic' },
		{ name: 'Blocks', singular: 'block', graphicKey: 'graphic' },
		{ name: 'Characters', singular: 'character', graphicKey: 'graphics.still' },
		{ name: 'Enemies', singular: 'enemy', graphicKey: 'graphics.still' },
		{ name: 'Levels', singular: 'level', graphicKey: null },
	].map(t => ({
		...t,
		slug: t.name.toLowerCase()
	}))

	function getGraphic(item, key) {
		key.split('.').forEach(p => {
			item = item[p]
		})
		return item
	}
</script>

<style lang="scss">
	@import '../css/variables';

	.page-container {
		height: calc(100vh - 126px);
		display: flex;
		flex-direction: row;
		align-items: stretch;
	}

	.nav-container {
		width: 250px;
		height: 100%;
		overflow: auto;
		border-right: 1px solid #ced4da;
	}

	.content-container {
		width: calc(100vw - 200px);
		height: 100%;
		overflow: auto;
	}

	.sub-nav-item {
		padding: 5px 7px;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5px;

		font-size: 13px;
		color: #666;

		:global(img) {
			margin-right: 5px;
			width: 25px;
		}

		&:hover {
			color: $success;
			text-decoration: none;
			font-weight: bold;
		}
		&.active {
			color: $primary;
			font-weight: bold;
		}

		&.new {
			color: $success;
		}
	}
</style>
