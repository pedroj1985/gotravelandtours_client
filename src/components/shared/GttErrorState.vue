<template>
  <div class="gtt-error-state">
    <div class="gtt-error-state-icon">
      <i class="mdi mdi-alert-circle-outline"></i>
    </div>
    <h3 class="gtt-error-state-title"><slot name="title">Error de conexión</slot></h3>
    <p class="gtt-error-state-description"><slot>No se pudieron cargar los datos. Intente nuevamente.</slot></p>
    <button v-if="retryable" @click="$emit('retry')" class="gtt-error-state-retry">
      <i class="mdi mdi-refresh"></i> Reintentar
    </button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "GttErrorState" });

withDefaults(defineProps<{
  retryable?: boolean
}>(), {
  retryable: false
});

const emit = defineEmits<{
  (e: "retry"): void
}>();
</script>

<style scoped>
.gtt-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.gtt-error-state-icon {
  font-size: 3.5rem;
  color: #ef5350;
  margin-bottom: 1rem;
}

.gtt-error-state-icon i {
  font-size: inherit;
}

.gtt-error-state-title {
  font-size: 1.25rem;
  color: #c62828;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.gtt-error-state-description {
  font-size: 0.95rem;
  color: #757575;
  margin: 0 0 1.5rem;
  max-width: 400px;
}

.gtt-error-state-retry {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  background-color: #ef5350;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.gtt-error-state-retry:hover {
  background-color: #c62828;
}

.gtt-error-state-retry i {
  font-size: 1.1rem;
}
</style>
