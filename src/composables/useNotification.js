// Composable para lógica de notificaciones (Vue 3 Composition API)
import { ref } from 'vue';

export function useNotification() {
  const notification = ref(null);
  const showNotification = (message, type = 'info', duration = 3000) => {
    notification.value = { message, type };
    setTimeout(() => {
      notification.value = null;
    }, duration);
  };
  return {
    notification,
    showNotification,
  };
}
