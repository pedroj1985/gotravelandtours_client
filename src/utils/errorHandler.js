import { logger } from "./logger";

const RETRY_DELAYS = [1000, 2000, 4000];

let toastInstance = null;

export function setToastInstance(toast) {
  toastInstance = toast;
}

export function notifyError(message, options = {}) {
  if (toastInstance) {
    toastInstance(message, {
      type: "error",
      autoClose: options.duration || 5000,
      ...options
    });
  }
}

export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data) return String(error.response.data);
  if (error.message) return error.message;
  return "Ha ocurrido un error inesperado";
}

export function getErrorStatus(error) {
  return error.response?.status || 0;
}

export function isNetworkError(error) {
  return !error.response && error.message?.includes("Network");
}

export function isTimeoutError(error) {
  return error.code === "ECONNABORTED" || error.message?.includes("timeout");
}

export function isServerError(error) {
  const status = getErrorStatus(error);
  return status >= 500 && status < 600;
}

export async function withRetry(fn, maxRetries = 2, context = "") {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < maxRetries && (isNetworkError(error) || isServerError(error))) {
        logger.warn(`Retry ${attempt + 1}/${maxRetries} for ${context}: ${error.message}`);
        await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
        continue;
      }
      throw error;
    }
  }
}

export function setupGlobalErrorHandler(app) {
  app.config.errorHandler = (err, vm, info) => {
    const componentName = vm?.$options?.name || "Unknown";
    logger.error(`[${componentName}] ${info}:`, err);
    notifyError(getErrorMessage(err));
  };

  app.config.warnHandler = (msg, vm, trace) => {
    if (msg?.includes("deprecated") || msg?.includes("Internal")) return;
    logger.warn(msg, trace);
  };
}

export default {
  notifyError,
  getErrorMessage,
  isNetworkError,
  isServerError,
  withRetry,
  setupGlobalErrorHandler,
  setToastInstance
};
