{#if $project != null}
	<ul class="nav my-1">
		{#if Object.keys($project.levels).length > 0}
			<li class="nav-item">
				<a class="nav-link text-success" href="#/{$project.name}/play">
					<Icon data={playIcon} />
					Play {$project.name}
				</a>
			</li>
		{/if}

		<li class="nav-item">
			<a class="nav-link text-warning" href="#/{$project.name}/build/art/new">
				<Icon data={editIcon} />
				Edit {$project.name}
			</a>
		</li>

		<li class="nav-item">
			<a class="nav-link text-danger" href="#/" on:click|preventDefault={deleteProject}>
				<Icon data={deleteIcon} />
				Delete {$project.name}
			</a>
		</li>
	</ul>

	{#if prefix != null}
		<Router {prefix} {routes} />
	{/if}
{/if}

<script>
	// svelte-spa-router for hash routing since this is just going to be hosted on github pages
	import Router, { push } from 'svelte-spa-router'
	import Build from './Build/Index.svelte'
	import Play from './Play/Index.svelte'
	import projects from '../stores/project-store'
	import project from '../stores/active-project-store'
	import Icon from 'svelte-awesome'
	import { remove as deleteIcon, pencil as editIcon, play as playIcon } from 'svelte-awesome/icons'

	export let params = {}

	$: if (params.projectName != null) {
		let name = decodeURIComponent(params.projectName)
		$project = $projects.find(p => p.name == name) || createProject(name)
	}

	$: prefix = `/${encodeURIComponent($project.name)}`
	const routes = {
		'/build/:tab?/:name?': Build,
		'/play': Play,
	}

	function createProject(name) {
		return {
			name,
			art: {},
			blocks: {},
			characters: {},
			enemies: {},
			levels: {},
		}
	}

	function deleteProject() {
		let name = $project.name
		if (prompt(`If you are sure you want to delete this project, type the project name:?`, '') !== name) return

		// $project = null
		$projects = $projects.filter(p => p.name != name)
		params.projectName = null // or it'll just autocreate it from reactive statement above
		push(`/`)
	}
</script>
