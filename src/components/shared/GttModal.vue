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

<style scoped>
.gtt_modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.gtt_modal {
  background: #fff;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(0,0,0,.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.gtt_modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  font-family: 'Helvetica Neue LT Std-Roman', Arial, sans-serif;
  color: #212f3d;
}
.gtt_modal_close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #212f3d;
}
.gtt_modal_body {
  padding: 20px;
  font-size: 16px;
  color: #212f3d;
}
.gtt_modal_footer {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}
</style>
