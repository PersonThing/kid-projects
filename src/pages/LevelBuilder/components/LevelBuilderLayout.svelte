<div class="flex align-top">
	<div>
		<div class="list-group">
			<a class="list-group-item list-group-item-action" class:active={tab == 'art'} href={baseUrl}>Art</a>
			{#each tabs as t}
				<a class="list-group-item list-group-item-action" class:active={tab == t.name} href="{baseUrl}/{t.name}/new">{t.name}</a>
				{#if t.name == tab}
					<div class="list-group sub-nav">
						<a href="{baseUrl}/{t.name}/new" class="list-group-item list-group-item-action" class:list-group-item-success={store[activeName] == null}>
							+ New
						</a>
						{#each Object.keys(store) as name}
							<a class="list-group-item list-group-item-action" class:active={activeName == name} href="{baseUrl}/{t.name}/{name}">
								<Art name={store[name][t.graphicKey]} />
								{name}
							</a>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</div>
	<div class="flex-grow">
		<slot />
	</div>
</div>

<script>
	import Art from './Art.svelte'

	export let tab
	export let activeName
	export let store

	const baseUrl = '#/level-builder'

	const tabs = [
		{ name: 'blocks', graphicKey: 'graphic' },
		{ name: 'characters', graphicKey: 'graphicStill' },
		{ name: 'enemies', graphicKey: 'graphicStill' },
		{ name: 'levels', graphicKey: null },
	]
</script>

<style>
	.sub-nav {
		margin-left: 20px;
	}
	.sub-nav .list-group-item {
		padding: 6px 12px;
	}
</style>
