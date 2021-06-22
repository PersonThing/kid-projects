<ul class="nav nav-tabs">
	{#each $projects as p}
		<li class="nav-item">
			<a class="nav-link" use:active={`/${encodeURIComponent(p.name)}/*`} href="#/{encodeURIComponent(p.name)}/">{p.name}</a>
		</li>
	{/each}
	<li class="nav-item">
		<a class="nav-link" href="#/new" on:click|preventDefault={startNewProject}>
			<Icon data={addIcon} />
			Create new game
		</a>
	</li>
</ul>

<main>
	<Router {routes} />
</main>

<script>
	import Router, { push } from 'svelte-spa-router'
	import active from 'svelte-spa-router/active'
	import projects from './stores/project-store'
	import Project from './pages/Project.svelte'
	import Icon from 'svelte-awesome'
	import { plus as addIcon } from 'svelte-awesome/icons'

	const routes = {
		'/:projectName/*': Project,
	}

	function startNewProject() {
		const name = prompt('Project name?', '')
		if (name != null && name.trim().length > 0) push(`/${encodeURIComponent(name)}/`)
	}
</script>

<style>
	.nav {
		height: 41px;
	}
	main {
		position: absolute;
		top: 41px;
		height: calc(100vh - 41px);
		width: 100vw;
		background: #e5e5e5;
	}
</style>
