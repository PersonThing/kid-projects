<div class="flex align-top">
	<div class="sub-nav nav-column">
		{#each tabs as t}
			<a class="sub-nav-item" class:active={tab == t.name} href="{baseUrl}/{t.name}/new">{t.name}</a>
			{#if t.name == tab}
				<div class="sub-nav">
					<a href="{baseUrl}/{t.name}/new" class="sub-nav-item" class:new={store[activeName] == null}>+ New</a>
					{#each Object.keys(store).sort() as name}
						<a class="sub-nav-item" class:active={activeName == name} href="{baseUrl}/{t.name}/{name}">
							<div class="flex-column">
								<span>{name}</span>
								<div>
									{#if tab == 'levels'}
										<img src={store[name].thumbnail} class="level-thumbnail" alt="" />
									{:else}
										<Art name={tab == 'art' ? name : store[name][t.graphicKey]} />
									{/if}
								</div>
							</div>
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
	import project from '../stores/active-project-store'

	export let tab
	export let activeName
	export let store

	$: baseUrl = `#/${$project.name}/build`

	const tabs = [
		{ name: 'art' },
		{ name: 'blocks', graphicKey: 'graphic' },
		{ name: 'characters', graphicKey: 'graphicStill' },
		{ name: 'enemies', graphicKey: 'graphicStill' },
		{ name: 'levels', graphicKey: null },
	]
</script>

<style lang="scss">
	@import '../css/variables';

	.nav-column {
		width: 250px;
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

		font-size: 15px;
		color: #666;

		:global(img) {
			margin-right: 5px;
			max-height: 20px;
		}

		img.level-thumbnail {
			width: 100px;
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
