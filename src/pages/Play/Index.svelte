{#if levelName != null}
	<div class="mb-2">
		<button type="button" on:click={() => (levelName = null)} class="btn btn-secondary">&lt; Change level</button>
		<a href="#/{$project.name}/build/levels/{encodeURIComponent(levelName)}" class="btn btn-light" role="button">Edit {levelName}</a>
		<a href="#/{$project.name}/build/characters/{encodeURIComponent(characterName)}" class="btn btn-light" role="button">Edit {characterName}</a>
	</div>

	<PhaserGame {levelName} {characterName} />
{:else}
	<div class="list-group">
		{#each Object.keys($project.levels).sort() as levelName}
			<div class="list-group-item">
				<h4 class="mb-0">{levelName}</h4>
				<div style="height: 50px; overflow: hidden;">
					<img src={$project.levels[levelName].thumbnail} style="background: {$project.levels[levelName].background}" alt="level preview" />
				</div>
				<div class="flex">
					{#each $project.levels[levelName].playableCharacters as characterName}
						<a class="btn btn-light m-1" href="#/{$project.name}/play/{levelName}/{characterName}">
							Play as {characterName}
							<Art name={$project.characters[characterName].graphics.moving} />
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

	$: levelName = params?.levelName != null ? decodeURIComponent(params.levelName) : null
	$: characterName = params?.characterName != null ? decodeURIComponent(params.characterName) : null
</script>
