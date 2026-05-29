<template>
  <button
    class="gtt_btn"
    v-bind:type="type"
    v-bind:disabled="disabled"
    v-on:click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'GttButton',
  props: {
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.gtt_btn {
  @include gtt-button;
}

.gtt_btn:disabled {
  background-color: var(--color-text-disabled);
  cursor: not-allowed;
}

.gtt_btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}
</style>
