{#if graphic?.png != null}
	<img src={graphic.png} alt={graphic.name} title={graphic.name} style="transform: rotate({rotation}deg)" />
{/if}

<script>
	import toPNG from '../to-png'
	import artStore from '../../../stores/art-store'

	export let name

	export let spin = false

	let graphic

	$: if (name != null) {
		graphic = $artStore[name]
		// set png for any that haven't been saved with png yet
		if (graphic != null && graphic.png == null) {
			graphic.png = toPNG(graphic, graphic.width, graphic.height)
		}
	}

	let spinTimeout
	let rotation = 0
	$: if (spin) {
		spinTimeout = setTimeout(() => {
			rotation += 30
		}, 25)
	} else {
		clearTimeout(spinTimeout)
	}
</script>
