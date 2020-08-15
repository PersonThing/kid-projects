<div class="row">
	<div class="col-2">
		<div class="list-group">
			<a class="list-group-item list-group-item-action" class:active={tab == 'art'} href="#/level-builder">Art</a>
			<a class="list-group-item list-group-item-action" class:active={tab == 'blocks'} href="#/level-builder/blocks/new">Blocks</a>
			<a class="list-group-item list-group-item-action" class:active={tab == 'characters'} href="#/level-builder/characters/new">Characters</a>
			<a class="list-group-item list-group-item-action" class:active={tab == 'enemies'} href="#/level-builder/enemies/new">Enemies</a>
			<a class="list-group-item list-group-item-action" class:active={tab == 'levels'} href="#/level-builder/levels/new">Levels</a>
		</div>
	</div>
	<div class="col">
		<Router {routes} {prefix} />
	</div>
</div>

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
		'/': ArtMaker,
		'/blocks/:name?': BlockBuilder,
		'/characters/:name?': CharacterBuilder,
		'/enemies/:name?': EnemyBuilder,
		'/levels/:name?': LevelBuilder,
	}
</script>
