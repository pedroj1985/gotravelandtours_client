import { logger } from "./logger";

const RETRY_DELAYS = [1000, 2000, 4000];

let toastInstance: ((message: string, options?: Record<string, unknown>) => void) | null = null;

export function setToastInstance(toast: (message: string, options?: Record<string, unknown>) => void) {
  toastInstance = toast;
}

export function notifyError(message: string, options: { duration?: number } & Record<string, unknown> = {}) {
  if (toastInstance) {
    toastInstance(message, {
      type: "error",
      autoClose: options.duration || 5000,
      ...options
    });
  }
}

export function getErrorMessage(error: Record<string, unknown>): string {
  if ((error.response as Record<string, unknown>)?.data && typeof (error.response as Record<string, unknown>).data === "object" && ((error.response as Record<string, unknown>).data as Record<string, unknown>)?.message) return ((error.response as Record<string, unknown>).data as Record<string, unknown>).message as string;
  if ((error.response as Record<string, unknown>)?.data) return String((error.response as Record<string, unknown>).data);
  if (error.message) return error.message as string;
  return "Ha ocurrido un error inesperado";
}

export function getErrorStatus(error: Record<string, unknown>): number {
  return ((error.response as Record<string, unknown>)?.status as number) || 0;
}

export function isNetworkError(error: Record<string, unknown>): boolean {
  return !error.response && typeof error.message === "string" && error.message.includes("Network");
}

export function isTimeoutError(error: Record<string, unknown>): boolean {
  return error.code === "ECONNABORTED" || (typeof error.message === "string" && error.message.includes("timeout"));
}

export function isServerError(error: Record<string, unknown>): boolean {
  const status = getErrorStatus(error);
  return status >= 500 && status < 600;
}

export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, context = ""): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < maxRetries && (isNetworkError(error as Record<string, unknown>) || isServerError(error as Record<string, unknown>))) {
        logger.warn(`Retry ${attempt + 1}/${maxRetries} for ${context}: ${(error as Error).message}`);
        await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Unreachable");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupGlobalErrorHandler(app: any) {
  app.config.errorHandler = (err: unknown, vm: unknown, info: string) => {
    const componentName = (vm as Record<string, unknown>)?.$options && ((vm as Record<string, unknown>).$options as Record<string, unknown>)?.name ? ((vm as Record<string, unknown>).$options as Record<string, unknown>).name as string : "Unknown";
    logger.error(`[${componentName}] ${info}:`, err);
    notifyError(getErrorMessage(err as Record<string, unknown>));
  };

  app.config.warnHandler = (msg: string, vm: unknown, trace: string) => {
    if (typeof msg === "string" && (msg.includes("deprecated") || msg.includes("Internal"))) return;
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
