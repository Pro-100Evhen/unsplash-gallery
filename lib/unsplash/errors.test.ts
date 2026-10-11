import { describe, expect, it } from "vitest";
import {
  UnsplashApiError,
  createUnsplashHttpError,
  normalizeUnsplashError,
} from "./errors";

describe("createUnsplashHttpError", () => {
  it.each([
    [401, "unauthorized"],
    [403, "rate-limit"],
    [404, "not-found"],
    [500, "unknown"],
  ] as const)("maps HTTP %i to the %s category", (status, category) => {
    const error = createUnsplashHttpError(status);

    expect(error).toBeInstanceOf(UnsplashApiError);
    expect(error.category).toBe(category);
    expect(error.status).toBe(status);
  });
});

describe("normalizeUnsplashError", () => {
  it("preserves an existing UnsplashApiError", () => {
    const original = createUnsplashHttpError(404);

    expect(normalizeUnsplashError(original)).toBe(original);
  });

  it("maps fetch TypeError failures to the network category", () => {
    const cause = new TypeError("fetch failed");
    const error = normalizeUnsplashError(cause);

    expect(error.category).toBe("network");
    expect(error.status).toBeNull();
    expect(error.cause).toBe(cause);
  });

  it("maps aborted requests to the timeout category", () => {
    const cause = new DOMException("The operation timed out", "TimeoutError");
    const error = normalizeUnsplashError(cause);

    expect(error.category).toBe("timeout");
    expect(error.status).toBeNull();
    expect(error.cause).toBe(cause);
  });

  it("maps unexpected values to the unknown category", () => {
    const error = normalizeUnsplashError("unexpected failure");

    expect(error.category).toBe("unknown");
    expect(error.status).toBeNull();
  });
});
