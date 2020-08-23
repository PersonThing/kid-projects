{#if graphic != null && graphic.png != null}
	{#if graphic.animated}
		<div class="inline-block">
			<AnimationPreview {...graphic} simple {scale} />
		</div>
	{:else}
		<img
			src={graphic.png}
			alt={graphic.name}
			title={graphic.name}
			style="transform: rotate({spin}deg); width: {graphic.width * scale}px; height: {graphic.height * scale}px;" />
	{/if}
{/if}

<script>
	import { getContext } from 'svelte'
	import project from '../stores/active-project-store'
	import AnimationPreview from './AnimationPreview.svelte'

	export let name
	export let spin = 0
	export let scale = 2

	let graphic
	$: if (name != null) graphic = $project.art[name]
</script>
