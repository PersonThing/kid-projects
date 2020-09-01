<!-- temporary implementation since i'm better with svelte than i am with phaser. messily duplicating key listeners... -->

<div class="ability-bar">
	{#if abilities != null}
		{#each abilities as ability}
			<div class="ability-button" class:active={activeKey == ability.key}>
				<div class="ability-key">{ability.key}</div>
				<Art name={ability.graphics.projectile || ability.graphics.character} />
				<div class="ability-name">{ability.name}</div>
			</div>
		{/each}
	{/if}
</div>

<svelte:window on:keydown={onKeyDown} />

<script>
	import { onMount } from 'svelte'

	import Art from '../Art.svelte'

	import SkillKeys from './SkillKeys'

	export let abilities
	let activeKey = null

	function onKeyDown(e) {
		console.log(e)
		const keyName = e.code.replace(/^Key/, '')
		if (SkillKeys.indexOf(keyName) > -1) activeKey = keyName
	}

	onMount(() => {
		if (activeKey == null) activeKey = abilities.length > 0 ? abilities[0].key : null
	})
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
