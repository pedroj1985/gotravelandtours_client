<template>
  <div v-if="show" class="gtt_modal_overlay" v-on:click.self="$emit('close')">
    <div class="gtt_modal">
      <div class="gtt_modal_header">
        <slot name="header">
          <span>{{ title }}</span>
        </slot>
        <button class="gtt_modal_close" v-on:click="$emit('close')">&times;</button>
      </div>
      <div class="gtt_modal_body">
        <slot />
      </div>
      <div class="gtt_modal_footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GttModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.gtt_modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.gtt_modal {
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-md);
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gtt_modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  font-size: var(--font-size-lg);
  font-family: var(--font-family);
  color: var(--color-text-primary);
}

.gtt_modal_close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: transform var(--transition-normal);

  &:hover {
    transform: scale(1.2);
  }
}

.gtt_modal_body {
  padding: var(--spacing-lg);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.gtt_modal_footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  text-align: right;
}
</style>
