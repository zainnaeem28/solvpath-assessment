import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/mockApi";
import { toUserMessage, withRetry } from "@/lib/apiClient";

describe("withRetry", () => {
  it("returns on first success", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    await expect(withRetry(fn, { retries: 2, delayMs: 1 })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries transient 503 failures then succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new ApiError(503, "temporarily unavailable"))
      .mockResolvedValueOnce("recovered");

    await expect(withRetry(fn, { retries: 2, delayMs: 1 })).resolves.toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not retry 404 client errors", async () => {
    const fn = vi.fn().mockRejectedValue(new ApiError(404, "missing"));
    await expect(withRetry(fn, { retries: 2, delayMs: 1 })).rejects.toThrow("missing");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not retry generic Error", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(withRetry(fn, { retries: 2, delayMs: 1 })).rejects.toThrow("boom");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("toUserMessage", () => {
  it("prefers ApiError messages", () => {
    expect(toUserMessage(new ApiError(500, "boom"), "fallback")).toBe("boom");
  });
});
