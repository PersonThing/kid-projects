{#if $project != null && prefix != null}
	<Router {prefix} {routes} />
{/if}

<script>
	import Router from 'svelte-spa-router'
	import ArtMaker from './ArtMaker.svelte'
	import ParticlesBuilder from './ParticlesBuilder.svelte'
	import BlockBuilder from './BlockBuilder.svelte'
	import CharacterBuilder from './CharacterBuilder.svelte'
	import EnemyBuilder from './EnemyBuilder.svelte'
	import LevelBuilder from './LevelBuilder.svelte'
	import project from '../../stores/active-project-store'

	$: prefix = `/${encodeURIComponent($project.name)}/build`

	const routes = {
		'/art/:id?': ArtMaker,
		'/particles/:id?': ParticlesBuilder,
		'/blocks/:id?': BlockBuilder,
		'/characters/:id?': CharacterBuilder,
		'/enemies/:id?': EnemyBuilder,
		'/levels/:id?': LevelBuilder,
	}
</script>
