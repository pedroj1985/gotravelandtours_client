const isDev = process.env.NODE_ENV !== "production";

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel = LOG_LEVELS[process.env.VUE_APP_LOG_LEVEL] || 0;

export const logger = {
  debug(...args) {
    if (isDev && currentLevel <= 0) console.debug("[DEBUG]", ...args);
  },
  info(...args) {
    if (isDev && currentLevel <= 1) console.info("[INFO]", ...args);
  },
  warn(...args) {
    if (currentLevel <= 2) console.warn("[WARN]", ...args);
  },
  error(...args) {
    if (currentLevel <= 3) console.error("[ERROR]", ...args);
  }
};

export default logger;
