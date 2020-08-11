<rect {x} {y} {width} {height} fill={color} stroke="black" />
<!-- {#if interactive}
	<line x1={x} x2={x + width} y1={y + height} y2={y + height} stroke="black" />
{/if} -->

<script>
	export let y = 0
	export let x = 0
	export let width = 0
	export let height = 0
	export let interactive = true
	export let color = 'rgb(8,95,8)'
</script>
