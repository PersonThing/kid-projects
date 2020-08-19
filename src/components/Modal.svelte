<!--
  {#if showing}
    <Modal on:close={() => showing = false}>
      some content for your modal inside
    </Modal>
  {/if}
	-->
<div class="modal-backdrop" style="z-index: {zIndex - 1};" />
<div bind:this={modalEl} class="modal" role="dialog" aria-hidden style="display: block;z-index: {zIndex};">
	<!--
    only fly in for now--issue scenario:
    - edit service
    - click link from modal "Create an agreement" (when you have no agreements setup)
    - route transitions behind the modal, but the modal remains
    - removing the out transition makes it work. couldn't reproduce in REPL: https://svelte.dev/repl/cc91d9c3c13a4a198f769b4b81145839?version=3.17.1 -->
	<div class="modal-dialog {className}" in:fly={{ y: -100, duration: 300 }}>
		<div class="modal-content {contentClass}">
			<a on:click|preventDefault={close} href="/" class="modal-close btn-reset" aria-label="Close" data-test="modal-close-btn">
				<Icon data={closeIcon} />
			</a>
			<div class="modal-header">
				<slot name="title">
					{#if title != null}
						<h4>
							{@html title}
						</h4>
					{/if}
				</slot>
			</div>
			<slot />
		</div>
	</div>
</div>

<script context="module">
	// track what instances of modals are open, so we can close them one by one and unlock scrolling on the document when none are open anymore
	// todo: with svelte, we can probably refactor modal usages to put modal components at end of dom so nested modals don't get affected by parent styling. but not a big deal currently
	import { writable } from 'svelte/store'
	const modals = writable([])
	// modals.subscribe(m => console.log('modals: ', m))
</script>

<script>
	import Icon from 'svelte-awesome'
	import { close as closeIcon } from 'svelte-awesome/icons'
	import { onDestroy, createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import { lockScroll, unlockScroll } from 'services/scroll-service'

	onDestroy(() => {
		// console.log('destroying modal')
		removeCloseListeners()
		removeModal()
	})

	const dispatch = createEventDispatcher()

	let modalEl
	export let zIndex = 1050
	export let title = null
	let className = null
	export { className as class }
	export let contentClass = null

	// unique identifier for this modal
	const modalId = $modals.length + new Date().getTime()

	// when user presses escape, close the modal
	const escapeListener = e => {
		const pressedEscape = (e.which || e.keyCode) === 27
		if (pressedEscape && wasLastModalOpen() && inputNotFocused() && dropdownNotFocused()) {
			e.preventDefault()
			close()
		}
	}

	// when user clicks outside modal content, close the modal
	const backdropListener = e => {
		if (clickShouldClose(e) && wasLastModalOpen()) {
			close()
			return false
		}
	}

	$: if (modalEl) {
		addCloseListeners()
		addModal()
	} else {
		removeCloseListeners()
	}

	function clickShouldClose(e) {
		const closest = e.target.closest != null ? e.target.closest : e.target.parentElement != null ? e.target.parentElement.closest : null
		if (closest == null) return false // they might've clicked outside, but we can't tell anyway

		const clickedOutsideModal =
			e.clientX != null && e.clientY != null && document.elementFromPoint(e.clientX, e.clientY) === modalEl && e.target.closest('option') == null //didn't click a select <option> (firefox Version 62.0 (64-bit) doesn't handle this automatically)

		if (!clickedOutsideModal) return false

		const clickedScrollbar = e.clientX != null && e.clientX + 10 >= window.innerWidth
		return !clickedScrollbar
	}

	function addCloseListeners() {
		lockBodyScroll()
		document.addEventListener('keydown', escapeListener)
		document.addEventListener('mousedown', backdropListener)
		document.addEventListener('touchstart', backdropListener)
	}

	function removeCloseListeners() {
		unlockBodyScroll()
		document.removeEventListener('keydown', escapeListener)
		document.removeEventListener('mousedown', backdropListener)
		document.removeEventListener('touchstart', backdropListener)
	}

	function close() {
		dispatch('close')
	}

	function wasLastModalOpen() {
		return $modals.length > 0 && $modals[$modals.length - 1] === modalId
	}

	function inputNotFocused() {
		// make sure an in input element doesn't have focus--means user just wants to blur on that element if they press esc
		const inputFocused =
			document.activeElement != null && document.activeElement.nodeName != null && document.activeElement.nodeName.toLowerCase() === 'input'
		return !inputFocused
	}

	function dropdownNotFocused() {
		return document.activeElement.closest('.quick-dropdown') == null
	}

	function lockBodyScroll() {
		lockScroll(document.body)
	}

	function unlockBodyScroll() {
		if ($modals.length === 0) unlockScroll(document.body)
	}

	function addModal() {
		$modals = $modals.concat(modalId)
	}

	function removeModal() {
		$modals = $modals.filter(m => m !== modalId)
		unlockBodyScroll()
	}
</script>

<style lang="scss">
	@import '../../../css/variables';

	.modal-backdrop {
		opacity: 0.5;
	}

	.modal {
		overflow-y: auto;

		// hack fix for when the modal is used on a <btn confirm> instance inside a node that has white-space nowrap
		h4 {
			white-space: normal;
		}

		.modal-dialog {
			margin-top: 20px;

			&.modal-xl {
				width: 85%;
			}

			.modal-header {
				padding: 20px 50px 20px 20px;
				position: relative;

				h1,
				h2,
				h3,
				h4 {
					margin-top: 0;
					margin-bottom: 0;
				}
			}

			.modal-content {
				background: #fff;
				//overflow-y: auto;
				position: relative;

				.modal-close {
					position: absolute;
					right: 10px;
					top: 6px;
					font-size: 24px;
					z-index: 3;
					color: $black;
				}
			}

			.modal-footer {
				background: #f8f8f8;
				text-align: left;
				border-bottom-left-radius: $border-radius-large;
				border-bottom-right-radius: $border-radius-large;
				.form-group {
					margin-bottom: 0;
				}
			}
		}
	}

	.modal .modal-dialog .modal-content.match-modal {
		max-height: unset;
	}
</style>
