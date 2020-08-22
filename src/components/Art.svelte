{#if graphic != null && graphic.png != null}
	<img
		src={graphic.png}
		alt={graphic.name}
		title={graphic.name}
		style="transform: rotate({spin}deg); {height != null ? 'max-height: ' + height + 'px' : ''}" />
{/if}

<script>
	import { getContext } from 'svelte'
	import project from '../stores/active-project-store'

	export let name
	export let height = null
	export let spin = 0

	let graphic
	$: if (name != null) graphic = $project.art[name]
</script>
