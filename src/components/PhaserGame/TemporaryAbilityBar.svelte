<!-- temporary implementation since i'm better with svelte than i am with phaser. messily duplicating key listeners... -->

<div class="ability-bar">
	{#if abilities != null}
		{#each abilities as ability}
			<div class="ability-button" class:active={activeKey == ability.key}>
				<div class="ability-key">{ability.key}</div>
				<Art id={ability.graphics.projectile || ability.graphics.character} />
				<div class="ability-name">{ability.name}</div>
			</div>
		{/each}
	{/if}
</div>

<script>
	import Art from '../Art.svelte'

	export let abilities
	export let activeKey
</script>

<style lang="scss">
	.ability-bar {
		position: absolute;
		bottom: 10px;
		left: 10px;
		z-index: 1000;
		display: flex;
		flex-direction: row;

		.ability-button {
			background: rgba(0, 0, 0, 0.5);
			width: 60px;
			height: 60px;
			margin-right: 5px;
			overflow: hidden;
			font-size: 10px;
			color: #fff;
			border: 5px solid transparent;
			text-align: center;

			&.active {
				border-color: white;
			}

			.ability-key {
				font-size: 14px;
			}
		}
	}
</style>
