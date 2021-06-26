<PlayEditProjectNav />

{#if $project != null && prefix != null}
	<Router {prefix} {routes} />
{/if}

<script>
	import Router from 'svelte-spa-router'
	import Build from './Build/Build.svelte'
	import Play from './Play/Play.svelte'
	import projects, { PROJECT_VERSION } from '../stores/project-store'
	import project from '../stores/active-project-store'
	import PlayEditProjectNav from '../components/PlayEditProjectNav.svelte'

	export let params = {}

	$: if (params.projectName != null) {
		let name = decodeURIComponent(params.projectName)
		$project = $projects.find(p => p.name == name) || createProject(name)
	}

	$: prefix = `/${encodeURIComponent($project.name)}`
	const routes = {
		'/build/:tab?/:id?': Build,
		'/play/:levelId?/:characterId?': Play,
	}

	function createProject(name) {
		return {
			version: PROJECT_VERSION,
			name,
			art: {},
			projectiles: {},
			blocks: {},
			characters: {},
			enemies: {},
			levels: {},
		}
	}
</script>
