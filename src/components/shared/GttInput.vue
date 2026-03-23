<template>
  <div class="gtt_input_wrapper">
    <label v-if="label" v-bind:for="id" class="gtt_input_label">
      {{ label }}
    </label>
    <input
      class="gtt_input"
      v-bind:id="id"
      v-bind:type="type"
      v-bind:placeholder="placeholder"
      v-bind:value="modelValue"
      v-on:input="$emit('update:modelValue', $event.target.value)"
      v-bind:disabled="disabled"
      v-bind:maxlength="maxlength"
      v-bind:autocomplete="autocomplete"
    />
    <small v-if="error" class="gtt_input_error">{{ error }}</small>
  </div>
</template>

<script>
export default {
  name: 'GttInput',
  props: {
    modelValue: [String, Number],
    label: String,
    id: String,
    type: {
      type: String,
      default: 'text',
    },
    placeholder: String,
    disabled: Boolean,
    maxlength: Number,
    autocomplete: String,
    error: String,
  },
};
</script>

<style lang="scss" scoped>
.gtt_input_wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-lg);
}

.gtt_input_label {
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

.gtt_input {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  outline: none;
  transition: border-color var(--transition-normal);

  &:focus {
    border-color: var(--color-primary);
  }

  &:disabled {
    background: var(--color-bg-disabled);
    color: var(--color-text-disabled);
  }
}

.gtt_input_error {
  color: var(--color-error);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
}
</style>
