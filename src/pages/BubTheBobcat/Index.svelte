{#if levelName != null}
	<div class="mb-2">
		<button type="button" on:click={() => (levelName = null)} class="btn btn-info">&lt; Change level</button>
		<a href="#/level-builder/levels/{encodeURIComponent(levelName)}" class="btn btn-secondary" role="button">Edit {levelName}</a>
		<a href="#/level-builder/characters/{encodeURIComponent(characterName)}" class="btn btn-secondary" role="button">Edit {characterName}</a>
	</div>

	<Game level={$levels[levelName]} character={$characters[characterName]} />
{:else}
	<div class="list-group">
		{#each sortedLevelNames as levelName}
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

	$: sortedLevelNames = Object.keys($levels).sort()

	function selectLevel(l, c) {
		levelName = l
		characterName = c
	}
</script>
