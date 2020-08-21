{#if graphic != null && graphic.png != null}
	<img
		src={graphic.png}
		alt={graphic.name}
		title={graphic.name}
		style="transform: rotate({spin}deg); {height != null ? 'max-height: ' + height + 'px' : ''}" />
{/if}

<script>
	import toPNG from '../services/to-png'
	import artStore from '../stores/art-store'

	export let name
	export let height = null
	export let spin = 0

	let graphic

	$: if (name != null) {
		graphic = $artStore[name]
		// set png for any that haven't been saved with png yet
		if (graphic != null && graphic.png == null) {
			graphic.png = toPNG(graphic, graphic.width, graphic.height)
		}
	}
</script>
