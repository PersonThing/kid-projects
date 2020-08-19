<ul class="nav">
	<li class="nav-item">
		<a class="nav-link" href="#/level-builder/art/new">Level Builder</a>
	</li>
	{#if canPlay}
		<li class="nav-item">
			<a class="nav-link" href="#/play">Play!</a>
		</li>
	{/if}
</ul>

<main>
	<Router {routes} />
</main>

<script>
	// svelte-spa-router for hash routing since this is just going to be hosted on github pages
	import Router from 'svelte-spa-router'
	import LevelBuilder from './pages/LevelBuilder/Index.svelte'
	import Play from './pages/Play/Index.svelte'
	import NotFound from './pages/NotFound.svelte'

	import levelStore from './stores/level-store'

	$: canPlay = Object.keys($levelStore).length > 0

	const routes = {
		'/level-builder/:tab?/:name?': LevelBuilder,
		'/play': Play,
		'*': LevelBuilder,
	}
</script>

<style>
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>
