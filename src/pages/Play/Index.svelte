{#if levelName != null}
	<div class="mb-2">
		<button type="button" on:click={() => (levelName = null)} class="btn btn-info">&lt; Change level</button>
		<a href="#/{$project.name}/build/levels/{encodeURIComponent(levelName)}" class="btn btn-light" role="button">Edit {levelName}</a>
		<a href="#/{$project.name}/build/characters/{encodeURIComponent(characterName)}" class="btn btn-light" role="button">Edit {characterName}</a>
	</div>

	<Game level={$project.levels[levelName]} character={$project.characters[characterName]} />
{:else}
	<div class="list-group">
		{#each sortedLevelNames as levelName}
			<div class="list-group-item">
				<h4 class="mb-0">{levelName}</h4>
				<img src={$project.levels[levelName].thumbnail} style="background: {$project.levels[levelName].background}" alt="level preview" />
				<div class="flex-row">
					{#each $project.levels[levelName].playableCharacters as characterName}
						<button class="btn btn-light m-1" on:click={() => selectLevel(levelName, characterName)}>
							<Art name={$project.characters[characterName].graphicStill} />
							{characterName}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

<script>
	import Art from '../../components/Art.svelte'
	import Game from '../../components/Game.svelte'
	import LevelPreview from '../../components/LevelPreview.svelte'
	import project from '../../stores/active-project-store'

	let levelName
	let characterName

	$: sortedLevelNames = Object.keys($project.levels).sort()

	function selectLevel(l, c) {
		levelName = l
		characterName = c
	}
</script>
