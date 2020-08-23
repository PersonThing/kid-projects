<div class="flex align-top">
	<div class="sub-nav nav-container">
		{#each tabs as t}
			<a class="sub-nav-item" class:active={tab == t.name} href="{baseUrl}/{t.name}/new">{t.name}</a>
			{#if t.name == tab}
				<div class="sub-nav">
					<a href="{baseUrl}/{t.name}/new" class="sub-nav-item" class:new={store[activeName] == null}>+ New</a>
					{#each Object.keys(store).sort() as name}
						<a class="sub-nav-item" class:active={activeName == name} href="{baseUrl}/{t.name}/{name}">
							{#if tab != 'levels'}
								<Art name={tab == 'art' ? name : getGraphic(name, t.graphicKey)} scale={1} />
							{/if}
							<div class="flex-column">
								<span>{name}</span>

								<div>
									{#if tab == 'levels'}
										<img src={store[name].thumbnail} class="level-thumbnail" alt="" />
									{/if}
								</div>
							</div>
						</a>
					{/each}
				</div>
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
		{ name: 'art' },
		{ name: 'blocks', graphicKey: 'graphic' },
		{ name: 'characters', graphicKey: 'graphics.still' },
		{ name: 'enemies', graphicKey: 'graphics.still' },
		{ name: 'levels', graphicKey: null },
	]

	function getGraphic(name, key) {
		let item = store[name]
		key.split('.').forEach(p => {
			item = item[p]
		})
		return item
	}
</script>

<style lang="scss">
	@import '../css/variables';

	.nav-container {
		width: 200px;
	}
	.content-container {
		width: calc(100vw - 200px);
	}

	.sub-nav .sub-nav {
		padding-left: 5px;
		margin-left: 15px;
		max-height: 60vh;
		overflow-x: hidden;
		overflow-y: auto;
		border-left: 1px solid #eee;

		.sub-nav-item {
			padding: 3px 7px;
		}
	}

	.sub-nav .sub-nav-item {
		padding: 5px 7px;
		display: flex;
		flex-direction: row;

		font-size: 13px;
		color: #666;

		:global(img) {
			margin-right: 5px;
			height: 20px;
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
	}

	.sub-nav-item.new {
		color: $success;
	}
</style>
