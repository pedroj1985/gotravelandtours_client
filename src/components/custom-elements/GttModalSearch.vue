<template>
  <div class="c-modal-backdrop">
    <div class="c-modal custom-margin">
      <div class="c-modal-body">
        <div class="modal-row">
          <div class="first-column img-container">
            <slot name="image"></slot>
          </div>
          <div class="second-column">
            <slot name="searching-text"></slot>
            <div class="progression-bar">
              <div class="gtt-progress-bar">
                <div class="gtt-progress-bar-inner"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-row c-modal-bottom">
          <div class="first-column">
            <img class="modal-logo" src="/img/logo_colibri_colored.png" alt="Colibri Viajes" />
          </div>
          <div class="second-column">
            <slot name="searching-fields"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gtt-progress-bar {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}
.gtt-progress-bar-inner {
  width: 100%;
  height: 100%;
  background: #7fa300;
  animation: gtt-progress-indeterminate 1.5s ease-in-out infinite;
}
@keyframes gtt-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>

<script setup lang="ts">
import { ref } from "vue"

const loading = ref(true)
</script>
