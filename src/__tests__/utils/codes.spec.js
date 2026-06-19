import { describe, it, expect } from "vitest";
import { codes } from "../../utils/codes";

describe("codes", () => {
  it("should define invalidCredentials as 401", () => {
    expect(codes.invalidCredentials).toBe(401);
  });

  it("should export a non-empty object", () => {
    expect(Object.keys(codes).length).toBeGreaterThan(0);
  });

  it("should have only numeric status codes", () => {
    Object.values(codes).forEach(value => {
      expect(typeof value).toBe("number");
    });
  });
});
