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
			<div class="list-group-item">
				<h4 class="mb-0">{levelName}</h4>
				<img src={$levels[levelName].thumbnail} style="background: {$levels[levelName].background}" />
				<div class="flex-row">
					{#each $levels[levelName].playableCharacters as characterName}
						<button class="btn btn-secondary mr-1" on:click={() => selectLevel(levelName, characterName)}>
							<Art name={$characters[characterName].graphicStill} />
							{characterName}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

<script>
	import Art from '../LevelBuilder/components/Art.svelte'
	import Game from './Game.svelte'
	import levels from '../../stores/level-store'
	import characters from '../../stores/character-store'
	import LevelPreview from './LevelPreview.svelte'

	let levelName
	let characterName

	$: sortedLevelNames = Object.keys($levels).sort()

	function selectLevel(l, c) {
		levelName = l
		characterName = c
	}
</script>
