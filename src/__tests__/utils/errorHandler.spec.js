import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getErrorMessage,
  getErrorStatus,
  isNetworkError,
  isTimeoutError,
  isServerError,
  withRetry
} from "../../utils/errorHandler";

describe("getErrorMessage", () => {
  it("should extract message from error.response.data.message", () => {
    const error = {
      response: { data: { message: "Not found" } }
    };
    expect(getErrorMessage(error)).toBe("Not found");
  });

  it("should extract string from error.response.data", () => {
    const error = { response: { data: "Server error" } };
    expect(getErrorMessage(error)).toBe("Server error");
  });

  it("should return error.message if no response", () => {
    const error = new Error("Timeout");
    expect(getErrorMessage(error)).toBe("Timeout");
  });

  it("should return fallback for unknown error", () => {
    const error = {};
    expect(getErrorMessage(error)).toBe("Ha ocurrido un error inesperado");
  });

  it("should handle empty object", () => {
    expect(getErrorMessage({})).toBe("Ha ocurrido un error inesperado");
  });
});

describe("getErrorStatus", () => {
  it("should return status from response", () => {
    expect(getErrorStatus({ response: { status: 404 } })).toBe(404);
    expect(getErrorStatus({ response: { status: 500 } })).toBe(500);
  });

  it("should return 0 if no response", () => {
    expect(getErrorStatus({})).toBe(0);
    expect(getErrorStatus(new Error("Network error"))).toBe(0);
  });
});

describe("isNetworkError", () => {
  it("should detect network errors", () => {
    const error = new Error("Network Error");
    expect(isNetworkError(error)).toBe(true);
  });

  it("should return false if response exists", () => {
    const error = { response: { status: 500 }, message: "Network Error" };
    expect(isNetworkError(error)).toBe(false);
  });

  it("should return false for non-network errors", () => {
    const error = { message: "Not found" };
    expect(isNetworkError(error)).toBe(false);
  });
});

describe("isTimeoutError", () => {
  it("should detect ECONNABORTED errors", () => {
    const error = { code: "ECONNABORTED" };
    expect(isTimeoutError(error)).toBe(true);
  });

  it("should detect timeout in message", () => {
    const error = { message: "timeout of 120000ms exceeded" };
    expect(isTimeoutError(error)).toBe(true);
  });

  it("should return false for other errors", () => {
    const error = { message: "Not found" };
    expect(isTimeoutError(error)).toBe(false);
  });
});

describe("isServerError", () => {
  it("should detect 5xx errors", () => {
    expect(isServerError({ response: { status: 500 } })).toBe(true);
    expect(isServerError({ response: { status: 502 } })).toBe(true);
    expect(isServerError({ response: { status: 503 } })).toBe(true);
  });

  it("should return false for 4xx errors", () => {
    expect(isServerError({ response: { status: 400 } })).toBe(false);
    expect(isServerError({ response: { status: 401 } })).toBe(false);
    expect(isServerError({ response: { status: 404 } })).toBe(false);
  });

  it("should return false if no response", () => {
    expect(isServerError({})).toBe(false);
  });
});

describe("withRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should return successful result on first try", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const promise = withRetry(fn, 2, "test");
    vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should retry on network error and succeed", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce("success");
    const promise = withRetry(fn, 2, "test");
    vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should retry on server error and succeed", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ response: { status: 503 } })
      .mockResolvedValueOnce("ok");
    const promise = withRetry(fn, 2, "server-test");
    vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should throw after exhausting retries", async () => {
    const error = new Error("Network Error");
    const fn = vi.fn().mockRejectedValue(error);
    const promise = withRetry(fn, 2, "fail-test");
    vi.runAllTimersAsync();
    await expect(promise).rejects.toThrow("Network Error");
    expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it("should NOT retry on 4xx errors", async () => {
    const error = { response: { status: 400, data: "Bad request" } };
    const fn = vi.fn().mockRejectedValue(error);
    const promise = withRetry(fn, 2, "bad-request");
    await expect(promise).rejects.toEqual(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
