<ul class="nav">
	<li class="nav-item">
		<a class="nav-link" href="#/bub-the-bobcat">Play!</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" href="#/level-builder">Level Builder</a>
	</li>
</ul>

<main>
	<Router {routes} />
</main>

<script>
	// svelte-spa-router for hash routing since this is just going to be hosted on github pages
	import Router from 'svelte-spa-router'
	import LevelBuilder from './pages/LevelBuilder/Index.svelte'
	import BubTheBobcat from './pages/BubTheBobcat/Index.svelte'
	import NotFound from './pages/NotFound.svelte'

	const routes = {
		'/level-builder/:tab?/:name?': LevelBuilder,
		'/bub-the-bobcat': BubTheBobcat,
		'*': NotFound,
	}
</script>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
