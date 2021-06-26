{#if levelId != null}
	<div class="mb-2">
		<a href="#/{$project.name}/play" class="btn btn-secondary" role="button">&lt; Change level</a>
		<a href="#/{$project.name}/build/levels/{encodeURIComponent(levelId)}" class="btn btn-light" role="button">Edit {$project.levels[levelId].name}</a>
		<a href="#/{$project.name}/build/characters/{encodeURIComponent(characterId)}" class="btn btn-light" role="button">Edit {$project.characters[characterId].name}</a>
	</div>

	<PhaserGame {levelId} {characterId} />
{:else}
	<div class="list-group">
		{#each playableLevels as level}
			<div class="list-group-item">
				<h3 class="mb-0">{level.name}</h3>
				<div class="flex g1 align-top">
					<div style="height: 100px; width: 100px; border-radius: 5px; overflow: hidden; background: url({level.thumbnail}) no-repeat left top; background-color: {level.background};"></div>
					<div>
						<div class="flex g1 align-top">
							{#each level.playableCharacters as characterId}
							<a class="btn btn-success btn-sm flex g1" href="#/{$project.name}/play/{level.id}/{characterId}">
								<Art id={$project.characters[characterId].graphics.moving} />
								Play as {$project.characters[characterId].name}
							</a>
							{/each}
						</div>
						{#if playerData.hasBeatenLevel(level.id)}
							<div class="flex g1">
								<div>
									<div><strong>High scores</strong></div>
									{#each playerData.getHighScores(level.id) as highScore, i}
										<div>{i+1}. <strong>{highScore.score}</strong> as <strong>{$project.characters[highScore.characterId].name}</strong></div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
		<div class="list-group-item">
			<h4 class="mb-0 text-{lockedLevels.length ? 'muted' : 'success'}">
				{#if lockedLevels.length}
				{lockedLevels.length} more level{lockedLevels.length > 1 ? 's' : ''} can be unlocked
				{:else if !beatWholeGame}
				You have unlocked all levels
				{:else}
				You beat the whole game!
				{/if}
			</h4>
		</div>
	</div>
	<button on:click={resetPlayerData} class="btn btn-info btn-sm">Reset cleared levels / clear high scores</button>
{/if}

<script>
	import { sortByName } from '../../services/object-utils'
	import Art from '../../components/Art.svelte'
	import PhaserGame from '../../components/PhaserGame.svelte'
	import project from '../../stores/active-project-store'
	import playerData from '../../stores/player-data'

	export let params

	$: levelId = params?.levelId != null ? decodeURIComponent(params.levelId) : null
	$: characterId = params?.characterId != null ? decodeURIComponent(params.characterId) : null

	$: levels = Object.values($project.levels)
		.map(l => ({
			...l,
			levelData: $playerData[l.id], // just to force update when player data changes..
			playable: playerData.hasBeatenAllLevels(l.requiredLevels),
			beaten: playerData.hasBeatenLevel(l.id)
		}))
		.sort(sortByName)

	$: playableLevels = levels.filter(l => l.playable)
	$: lockedLevels = levels.filter(l => !l.playable)
	$: beatWholeGame = levels.every(l => l.beaten)

	function resetPlayerData() {
		playerData.reset()
	}
</script>
