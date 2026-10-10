import { describe, expect, it } from "vitest";
import {
  createSearchHref,
  getSearchNavigationDelay,
  SEARCH_DEBOUNCE_MS,
  SEARCH_THROTTLE_MS,
  shouldAutoSearch,
} from "./searchNavigation";

describe("search navigation", () => {
  it("creates canonical search and cleared-query URLs", () => {
    expect(createSearchHref("mountain lake")).toBe(
      "/search?query=mountain+lake",
    );
    expect(createSearchHref("")).toBe("/");
  });

  it("throttles searches that follow a recent navigation", () => {
    expect(getSearchNavigationDelay(1_000, 1_250)).toBe(750);
    expect(getSearchNavigationDelay(1_000, 2_000)).toBe(SEARCH_DEBOUNCE_MS);
    expect(SEARCH_THROTTLE_MS).toBe(1_000);
  });

  it("does not automatically search incomplete one-character queries", () => {
    expect(shouldAutoSearch("")).toBe(true);
    expect(shouldAutoSearch("f")).toBe(false);
    expect(shouldAutoSearch("fo")).toBe(true);
  });
});
