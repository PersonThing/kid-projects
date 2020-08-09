<ul class="nav">
	<li class="nav-item">
		<a class="nav-link" href="#/pixel-art-maker">Pixel Art Maker</a>
	</li>
	<li class="nav-item">
		<a class="nav-link" href="#/bub-the-bobcat">Bub the Bobcat</a>
	</li>
</ul>

<main>
	<!-- <Router>
		<Route path="pixel-art-maker" component={PixelArtMaker} />
		<Route path="bub-the-bobcat" component={BubTheBobcat} />
  </Router> -->

	<Router {routes} />
</main>

<script>
	// import { Router, Route, links } from 'svelte-routing'

	import Router from 'svelte-spa-router'
	import BubTheBobcat from './pages/BubTheBobcat/Index.svelte'
	import PixelArtMaker from './pages/PixelArtMaker/Index.svelte'
	import NotFound from './pages/NotFound.svelte'

	const routes = {
		'/bub-the-bobcat': BubTheBobcat,
		'/pixel-art-maker': PixelArtMaker,
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
