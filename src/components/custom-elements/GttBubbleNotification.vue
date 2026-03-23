<template>
  <div class="bubble-wrapper hn-roman" v-if="count > 0">
    <span class="bubble">
      {{ count }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
.bubble-wrapper {
  position: absolute;
  top: -5px;
  right: -5px;
}

.bubble {
  font-size: var(--font-size-xs);
  border-radius: 100%;
  background: var(--color-primary);
  color: var(--color-text-primary);
  padding: 1px 4px;
}

@media (max-width: 1440px) {
  .bubble {
    font-size: 8px;
    padding: 0.5px 2px;
  }
}
</style>