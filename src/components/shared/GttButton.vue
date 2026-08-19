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

<script setup lang="ts">
defineOptions({ name: "GttButton" });

withDefaults(
  defineProps<{
    type?: string;
    disabled?: boolean;
  }>(),
  {
    type: "button",
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
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
