<template>
  <div class="gtt-empty-state">
    <div class="gtt-empty-state-icon">
      <slot name="icon">
        <i class="mdi mdi-inbox-outline"></i>
      </slot>
    </div>
    <h3 class="gtt-empty-state-title"><slot name="title">Sin resultados</slot></h3>
    <p class="gtt-empty-state-description"><slot>No se encontraron datos para mostrar.</slot></p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "GttEmptyState" });
</script>

<style scoped>
.gtt-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.gtt-empty-state-icon {
  font-size: 3.5rem;
  color: #bdbdbd;
  margin-bottom: 1rem;
}

.gtt-empty-state-icon i {
  font-size: inherit;
}

.gtt-empty-state-title {
  font-size: 1.25rem;
  color: #757575;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.gtt-empty-state-description {
  font-size: 0.95rem;
  color: #9e9e9e;
  margin: 0;
  max-width: 400px;
}
</style>
