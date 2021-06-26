{#if levelId != null}
	<div class="mb-2">
		<a href="#/{$project.name}/play" class="btn btn-secondary" role="button">&lt; Change level</a>
		<a href="#/{$project.name}/build/levels/{encodeURIComponent(levelId)}" class="btn btn-light" role="button">Edit {$project.levels[levelId].name}</a>
		<a href="#/{$project.name}/build/characters/{encodeURIComponent(characterId)}" class="btn btn-light" role="button">Edit {$project.characters[characterId].name}</a>
	</div>

	<PhaserGame {levelId} {characterId} />
{:else}
	<div class="list-group">
		{#each Object.values($project.levels).sort() as level}
			<div class="list-group-item">
				<h4 class="mb-0">{level.name}</h4>
				<div style="height: 50px; overflow: hidden;">
					<img src={level.thumbnail} style="background: {level.background}" alt="level preview" />
				</div>
				<div class="flex">
					{#each level.playableCharacters as characterId}
						<a class="btn btn-light m-1" href="#/{$project.name}/play/{level.id}/{characterId}">
							Play as {$project.characters[characterId].name}
							<Art id={$project.characters[characterId].graphics.moving} />
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

<script>
	import Art from '../../components/Art.svelte'
	import PhaserGame from '../../components/PhaserGame.svelte'
	import project from '../../stores/active-project-store'

	export let params

	$: levelId = params?.levelId != null ? decodeURIComponent(params.levelId) : null
	$: characterId = params?.characterId != null ? decodeURIComponent(params.characterId) : null
</script>
