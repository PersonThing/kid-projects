{#if graphic?.png != null}
	<img src={graphic.png} alt={graphic.name} title={graphic.name} />
{/if}

<script>
	import toPNG from '../to-png'

	export let graphic

	// set png for any that haven't been saved with png yet
	$: if (graphic != null && graphic.png == null) {
		graphic.png = toPNG(graphic, graphic.width, graphic.height)
	}
</script>
