{#if graphic != null && graphic.png != null}
	<div class="art-preview">
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
	</div>
{/if}

<script>
	import project from '../stores/active-project-store'
	import AnimationPreview from './AnimationPreview.svelte'

	export let id
	export let spin = 0
	export let scale = 1

	let graphic
	$: if (id != null) graphic = $project.art[id]
</script>
