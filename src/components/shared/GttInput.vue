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

<style scoped>
.gtt_input_wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.gtt_input_label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #212f3d;
  font-family: 'Helvetica Neue LT Std-Roman', Arial, sans-serif;
}
.gtt_input {
  padding: 10px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  font-size: 16px;
  color: #212f3d;
  font-family: 'Helvetica Neue LT Std-Roman', Arial, sans-serif;
  outline: none;
  transition: border-color .2s;
}
.gtt_input:focus {
  border-color: #212f3d;
}
.gtt_input:disabled {
  background: #f5f5f5;
  color: #bcbcbc;
}
.gtt_input_error {
  color: #ff0000;
  font-size: 12px;
  margin-top: 4px;
}
</style>
