{#if graphic?.png != null}
	<img src={graphic.png} alt={graphic.name} title={graphic.name} />
{/if}

<script>
	import toPNG from '../to-png'
	import artStore from '../../../stores/art-store'

	export let name

	let graphic

	$: if (name != null) {
		graphic = $artStore[name]
		// set png for any that haven't been saved with png yet
		if (graphic != null && graphic.png == null) {
			graphic.png = toPNG(graphic, graphic.width, graphic.height)
		}
	}
</script>
