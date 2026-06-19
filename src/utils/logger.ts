type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const isDev = process.env.NODE_ENV !== "production";
const currentLevel = LOG_LEVELS[import.meta.env.VITE_LOG_LEVEL as LogLevel] ?? 0;

interface Logger {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

export const logger: Logger = {
  debug(...args: unknown[]) {
    if (isDev && currentLevel <= 0) console.debug("[DEBUG]", ...args);
  },
  info(...args: unknown[]) {
    if (isDev && currentLevel <= 1) console.info("[INFO]", ...args);
  },
  warn(...args: unknown[]) {
    if (currentLevel <= 2) console.warn("[WARN]", ...args);
  },
  error(...args: unknown[]) {
    if (currentLevel <= 3) console.error("[ERROR]", ...args);
  }
};

export default logger;
