<ul class="nav nav-pills">
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
