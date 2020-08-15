<div class="flex align-top">
	<div>
		<strong>Blocks</strong>
		{#each Object.keys($blockStore) as blockName}
			<div>{blockName}</div>
		{/each}
		<div class="mt-3">
			<strong>Enemies</strong>
			{#each Object.keys($enemyStore) as enemyName}
				<div>{enemyName}</div>
			{/each}
		</div>
	</div>
	<div class="flex-grow">
		<div style="background: {background}; height: {height}px;">
			<!-- same level component as actual game uses -->
			<Level {blocks} {enemies} />
		</div>
	</div>
</div>

<script>
	import Level from '../../BubTheBobcat/Level.svelte'

	import blockStore from '../../../stores/block-store'
	import enemyStore from '../../../stores/enemy-store'

	export let background = null
	export let blocks = []
	export let enemies = []

	let height = 100

	// make level viewer at least 100px higher than the highest block
	$: height = Math.max(...blocks.map(b => b.y + b.height)) + 100
</script>
