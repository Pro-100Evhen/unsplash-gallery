import { describe, expect, it } from "vitest";
import { GALLERY_PER_PAGE } from "@/features/gallery/pagination";
import { parseSearchParams } from "./searchParams";

describe("parseSearchParams", () => {
  it("trims a valid query and parses a positive page", () => {
    expect(
      parseSearchParams({ query: "  mountain lake  ", page: "3" }),
    ).toEqual({
      valid: true,
      query: "mountain lake",
      page: 3,
      perPage: GALLERY_PER_PAGE,
    });
  });

  it.each([
    [{}, "empty-query"],
    [{ query: "   " }, "empty-query"],
    [{ query: ["forest", "ocean"] }, "invalid-query"],
    [{ query: "x".repeat(101) }, "invalid-query"],
  ] as const)("returns an invalid result for %j", (input, reason) => {
    expect(parseSearchParams(input)).toEqual({
      valid: false,
      reason,
      page: 1,
      perPage: GALLERY_PER_PAGE,
    });
  });

  it("normalizes an invalid page without rejecting a valid query", () => {
    expect(parseSearchParams({ query: "forest", page: "wrong" })).toEqual({
      valid: true,
      query: "forest",
      page: 1,
      perPage: GALLERY_PER_PAGE,
    });
  });
});
