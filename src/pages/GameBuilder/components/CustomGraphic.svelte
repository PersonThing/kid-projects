{#if graphic}
	{#if graphic.png != null}
		<img src={graphic.png} alt={graphic.name} />
	{:else}
		<svg width={graphic.width * scale} height={graphic.height * scale} alt={graphic.name}>
			{#each graphic.data as row, ri}
				{#each row as color, ci}
					{#if color != null}
						<rect x={ci * scale} y={ri * scale} width={scale} height={scale} fill={color} />
					{/if}
				{/each}
			{/each}
		</svg>
	{/if}
{/if}

<script>
	// this component renders our custom pixel art as an svg
	// so we can preview it in the level builder

	// todo instead of dynamically rendering svg, cache png data

	export let graphic

	export let scale = 2
</script>
