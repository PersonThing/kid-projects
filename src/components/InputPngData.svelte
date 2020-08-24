<div contenteditable="true" on:paste={onPaste} class="paste-container" />
{#if value != null}
	<img src={value} alt="" />
{/if}

<script>
	export let value = null

	function onPaste(e) {
		const items = (e.clipboardData || e.originalEvent.clipboardData).items
		for (let index in items) {
			const item = items[index]
			if (item.kind === 'file') {
				const blob = item.getAsFile()
				const reader = new FileReader()
				reader.onload = function (event) {
					value = event.target.result
				}
				// data url!
				// callback(blob)
				reader.readAsDataURL(blob)
			}
		}
	}
</script>

<style>
	.paste-container {
		width: 100px;
		height: 100px;
		background: #eee;
	}
</style>
