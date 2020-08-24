<div class="instructions">
	<table>
		{#each keyBinds as bind}
			<tr>
				<td>{bind.key}</td>
				<td>= {bind.action}</td>
			</tr>
		{/each}
	</table>
</div>

<script>
	const keyBinds = [
		{
			key: 'Left + Right Arrow',
			action: 'Move',
		},
		{
			key: 'Space',
			action: 'Jump',
		},
		{
			key: 'R',
			action: 'Spin Attack / Shield',
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
