{#if levelName != null}
	<button type="button" on:click={() => (levelName = null)} class="btn btn-info">&lt; Change level</button>
	<a href="#/level-builder/levels/{encodeURIComponent(levelName)}" class="btn btn-warning" role="button">Edit level</a>
	<Game level={$levels[levelName]} character={$characters[characterName]} />
{:else}
	<div class="list-group">
		{#each Object.keys($levels) as levelName}
			{#each $levels[levelName].playableCharacters as characterName}
				<div class="list-group-item list-group-item-action" on:click={() => selectLevel(levelName, characterName)}>
					<Art name={$characters[characterName].graphicStill} />
					{levelName} as {characterName}
				</div>
			{/each}
		{/each}
	</div>
{/if}

<script>
	import Art from '../LevelBuilder/components/Art.svelte'
	import Game from './Game.svelte'
	import levels from '../../stores/level-store'
	import characters from '../../stores/character-store'

	let levelName
	let characterName

	function selectLevel(l, c) {
		levelName = l
		characterName = c
	}
</script>
