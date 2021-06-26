<div class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          <slot name="title" />
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" on:click={close}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <slot />
    </div>
  </div>
</div>

<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  function close() {
    dispatch('close')
  }
</script>
