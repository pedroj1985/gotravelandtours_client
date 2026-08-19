import { ref } from "vue";

interface Notification {
  message: string;
  type: string;
}

export function useNotification() {
  const notification = ref<Notification | null>(null);
  const showNotification = (message: string, type = "info", duration = 3000) => {
    notification.value = { message, type };
    setTimeout(() => {
      notification.value = null;
    }, duration);
  };
  return {
    notification,
    showNotification
  };
}
