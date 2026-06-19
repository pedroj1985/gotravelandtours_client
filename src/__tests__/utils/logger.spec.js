import { describe, it, expect, vi } from "vitest";

// The logger reads process.env at module init time.
// We test the real logger's call-time behavior by spying on console.

// Dynamic import to test with production env
async function getProdLogger() {
  vi.resetModules();
  process.env.NODE_ENV = "production";
  process.env.VUE_APP_LOG_LEVEL = "debug";
  const mod = await import("../../utils/logger");
  return mod.default;
}

// Dynamic import to test with custom log level (only used for "unknown level" test)
async function getCustomLevelLogger(level, nodeEnv = "development") {
  vi.resetModules();
  process.env.NODE_ENV = nodeEnv;
  process.env.VUE_APP_LOG_LEVEL = level;
  const mod = await import("../../utils/logger");
  return mod.default;
}

describe("logger (dev mode, level=debug)", () => {
  it("should log debug in dev with level debug", async () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { default: logger } = await import("../../utils/logger");
    logger.debug("test msg");
    expect(debugSpy).toHaveBeenCalledWith("[DEBUG]", "test msg");
    debugSpy.mockRestore();
  });

  it("should log info in dev with level debug", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { default: logger } = await import("../../utils/logger");
    logger.info("info msg");
    expect(infoSpy).toHaveBeenCalledWith("[INFO]", "info msg");
    infoSpy.mockRestore();
  });

  it("should log warn", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { default: logger } = await import("../../utils/logger");
    logger.warn("warn msg");
    expect(warnSpy).toHaveBeenCalledWith("[WARN]", "warn msg");
    warnSpy.mockRestore();
  });

  it("should log error", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { default: logger } = await import("../../utils/logger");
    logger.error("error msg");
    expect(errorSpy).toHaveBeenCalledWith("[ERROR]", "error msg");
    errorSpy.mockRestore();
  });
});

describe("logger (production mode)", () => {
  it("should NOT log debug in production", async () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logger = await getProdLogger();
    logger.debug("should not appear");
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });

  it("should NOT log info in production", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const logger = await getProdLogger();
    logger.info("should not appear");
    expect(infoSpy).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it("should log warn in production", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logger = await getProdLogger();
    logger.warn("warn in prod");
    expect(warnSpy).toHaveBeenCalledWith("[WARN]", "warn in prod");
    warnSpy.mockRestore();
  });

  it("should log error in production", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = await getProdLogger();
    logger.error("error in prod");
    expect(errorSpy).toHaveBeenCalledWith("[ERROR]", "error in prod");
    errorSpy.mockRestore();
  });
});

describe("logger (log level filtering)", () => {
  it("should default to level 0 when level is unknown", async () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logger = await getCustomLevelLogger("unknown");
    logger.debug("debug with unknown level");
    expect(debugSpy).toHaveBeenCalledWith("[DEBUG]", "debug with unknown level");
    debugSpy.mockRestore();
  });
});
