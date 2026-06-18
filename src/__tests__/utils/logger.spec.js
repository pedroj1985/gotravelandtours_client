import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Record original env
const originalEnv = { ...process.env };

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  process.env.NODE_ENV = originalEnv.NODE_ENV;
  process.env.VUE_APP_LOG_LEVEL = originalEnv.VUE_APP_LOG_LEVEL;
});

function loadLogger() {
  // Clear the module cache so env vars are re-evaluated
  vi.resetModules();
  return import("../../utils/logger");
}

describe("logger (dev mode, level=debug)", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "development";
    process.env.VUE_APP_LOG_LEVEL = "debug";
  });

  it("should log debug in dev with level debug", async () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.debug("test msg");
    expect(debugSpy).toHaveBeenCalledWith("[DEBUG]", "test msg");
    debugSpy.mockRestore();
  });

  it("should log info in dev with level debug", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.info("info msg");
    expect(infoSpy).toHaveBeenCalledWith("[INFO]", "info msg");
    infoSpy.mockRestore();
  });

  it("should log warn in any mode", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.warn("warn msg");
    expect(warnSpy).toHaveBeenCalledWith("[WARN]", "warn msg");
    warnSpy.mockRestore();
  });

  it("should log error in any mode", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.error("error msg");
    expect(errorSpy).toHaveBeenCalledWith("[ERROR]", "error msg");
    errorSpy.mockRestore();
  });
});

describe("logger (production mode)", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
    process.env.VUE_APP_LOG_LEVEL = "debug";
  });

  it("should NOT log debug in production", async () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.debug("should not appear");
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });

  it("should NOT log info in production", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.info("should not appear");
    expect(infoSpy).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it("should log warn in production", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.warn("warn in prod");
    expect(warnSpy).toHaveBeenCalledWith("[WARN]", "warn in prod");
    warnSpy.mockRestore();
  });

  it("should log error in production", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.error("error in prod");
    expect(errorSpy).toHaveBeenCalledWith("[ERROR]", "error in prod");
    errorSpy.mockRestore();
  });
});

describe("logger (log level filtering)", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "development";
  });

  it("should filter out debug when level is info", async () => {
    process.env.VUE_APP_LOG_LEVEL = "info";
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.debug("should not appear");
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });

  it("should filter out info when level is warn", async () => {
    process.env.VUE_APP_LOG_LEVEL = "warn";
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.info("should not appear");
    expect(infoSpy).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it("should default to level 0 when level is unknown", async () => {
    process.env.VUE_APP_LOG_LEVEL = "unknown";
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { default: logger } = await loadLogger();
    logger.debug("debug with unknown level");
    expect(debugSpy).toHaveBeenCalledWith("[DEBUG]", "debug with unknown level");
    debugSpy.mockRestore();
  });
});
