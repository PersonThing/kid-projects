<Router {routes} {prefix} />

<script>
	export let params = {}
	import Router from 'svelte-spa-router'
	import ArtMaker from './ArtMaker.svelte'
	import BlockBuilder from './BlockBuilder.svelte'
	import CharacterBuilder from './CharacterBuilder.svelte'
	import EnemyBuilder from './EnemyBuilder.svelte'
	import LevelBuilder from './LevelBuilder.svelte'

	$: tab = params.tab || 'art'

	const prefix = '/level-builder'
	const routes = {
		'/art/:name?': ArtMaker,
		'/blocks/:name?': BlockBuilder,
		'/characters/:name?': CharacterBuilder,
		'/enemies/:name?': EnemyBuilder,
		'/levels/:name?': LevelBuilder,
	}
</script>
