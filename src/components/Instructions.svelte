<div class="instructions">
	<table>
		{#each keyBinds as bind}
			<tr>
				<td>{bind.key}</td>
				<td>
					=
					{@html bind.action}
				</td>
			</tr>
		{/each}
	</table>
</div>

<script>
	export let canDoubleJump
	export let abilities

	$: keyBinds = [
		{
			key: 'A or Left Arrow',
			action: 'Move Left',
		},
		{
			key: 'D or Right Arrow',
			action: 'Move Right',
		},
		{
			key: 'Space',
			action: `Jump${canDoubleJump ? ', press again to double jump' : ''}`,
		},
		...abilities.map(a => ({
			key: a.key,
			action: `Select ability: <strong>${a.name}</strong>`,
		})),
		{
			key: 'Left or right click',
			action: 'Use selected ability',
		},
		{
			key: 'Enter',
			action: 'Restart',
		},
		// {
		// 	key: 'P or Escape',
		// 	action: 'Pause',
		// },
	]
</script>

<style>
	.instructions {
		padding: 10px;
	}

	table td {
		font-size: 12px;
	}

	table tr td:first-child {
		text-align: right;
	}
	table tr td:last-child {
		text-align: left;
	}
</style>
