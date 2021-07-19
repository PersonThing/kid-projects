{#if $project != null}
  <ul class="nav {className}">
    {#if Object.keys($project.levels).length > 0}
      <li class="nav-item">
        <a class="nav-link text-success" href="#/{$project.name}/play">
          <Icon data={playIcon} />
          Play
        </a>
      </li>
    {/if}

    <li class="nav-item">
      <a class="nav-link text-warning" href="#/{$project.name}/build/art/new">
        <Icon data={editIcon} />
        Edit
      </a>
    </li>
    <slot />

    <li class="nav-item">
      <a class="nav-link text-danger" href="#/" on:click|preventDefault={deleteProject}>
        <Icon data={deleteIcon} />
        Delete project
      </a>
    </li>
  </ul>
{/if}

{#if $project != null && prefix != null}
  <Router {prefix} {routes} />
{/if}

<script>
  import Router, { push } from 'svelte-spa-router'
  import Build from './Build/Build.svelte'
  import Play from './Play/Play.svelte'
  import projects, { PROJECT_VERSION } from '../stores/project-store'
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
      particles: {},
    }
  }

  let className = ''
  export { className as class }

  function deleteProject() {
    let name = $project.name
    if (prompt(`If you are sure you want to delete this project, type the project name:?`, '') !== name) return
    $projects = $projects.filter(p => p.name != name)
    params.projectName = null // or it'll just autocreate it from reactive statement above
    push(`/`)
  }
</script>
