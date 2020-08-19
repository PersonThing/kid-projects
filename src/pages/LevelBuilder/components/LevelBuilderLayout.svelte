<div class="flex align-top">
	<div class="sub-nav">
		{#each tabs as t}
			<a class="sub-nav-item" class:active={tab == t.name} href="{baseUrl}/{t.name}/new">{t.name}</a>
			{#if t.name == tab}
				<div class="sub-nav">
					<a href="{baseUrl}/{t.name}/new" class="sub-nav-item" class:new={store[activeName] == null}>+ New</a>
					{#each Object.keys(store).sort() as name}
						<a class="sub-nav-item" class:active={activeName == name} href="{baseUrl}/{t.name}/{name}">
							<Art name={tab == 'art' ? name : store[name][t.graphicKey]} height="20" />
							<span>{name}</span>
						</a>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
	<div class="flex-grow pl-2">
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
		{ name: 'art' },
		{ name: 'blocks', graphicKey: 'graphic' },
		{ name: 'characters', graphicKey: 'graphicStill' },
		{ name: 'enemies', graphicKey: 'graphicStill' },
		{ name: 'levels', graphicKey: null },
	]
</script>

<style lang="scss">
	@import '../../../css/variables';

	.sub-nav .sub-nav {
		padding-left: 10px;
		margin-left: 10px;
		max-height: 60vh;
		overflow: auto;
		border-left: 1px solid #eee;

		.sub-nav-item {
			padding: 3px 7px;
		}
	}

	.sub-nav .sub-nav-item {
		padding: 5px 7px;
		display: flex;
		flex-direction: row;

		font-size: 15px;
		color: #666;

		span {
			padding-left: 5px;
		}

		&:hover {
			background: #efefef;
			color: $primary;
			text-decoration: none;
		}
		&.active {
			color: $success;
		}
	}

	.sub-nav-item.new {
		color: $success;
	}
</style>
