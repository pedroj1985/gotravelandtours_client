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

<style scoped>
.gtt_btn {
  display: inline-block;
  padding: 10px 24px;
  font-size: 16px;
  font-family: 'Helvetica Neue LT Std-Roman', Arial, sans-serif;
  color: #fff;
  background-color: #212f3d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color .2s;
}
.gtt_btn:disabled {
  background-color: #bcbcbc;
  cursor: not-allowed;
}
.gtt_btn:hover:not(:disabled) {
  background-color: #1a2533;
}
</style>
