<div class="row">
	<div class="col-2">
		<div class="list-group">
			<a class="list-group-item list-group-item-action" class:active={tab == 'blocks'} href="#/game-builder/blocks">Blocks</a>
			<a class="list-group-item list-group-item-action" class:active={tab == 'characters'} href="#/game-builder/characters">Characters</a>
			<a class="list-group-item list-group-item-action" class:active={tab == 'enemies'} href="#/game-builder/enemies">Enemies</a>
			<a class="list-group-item list-group-item-action" class:active={tab == 'levels'} href="#/game-builder/levels">Levels</a>
		</div>
	</div>
	<div class="col">
		<Router {routes} {prefix} />
	</div>
</div>

<script>
	export let params = {}
	import Router from 'svelte-spa-router'
	import BlockBuilder from './BlockBuilder.svelte'
	import CharacterBuilder from './CharacterBuilder.svelte'
	import EnemyBuilder from './EnemyBuilder.svelte'
	import LevelBuilder from './LevelBuilder.svelte'
	$: tab = params.tab || 'blocks'

	const prefix = '/game-builder'
	const routes = {
		'/': BlockBuilder,
		'/blocks': BlockBuilder,
		'/characters': CharacterBuilder,
		'/enemies': EnemyBuilder,
		'/levels': LevelBuilder,
	}
</script>
