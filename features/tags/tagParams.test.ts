import { describe, expect, it } from "vitest";
import { parseTagParams } from "./tagParams";

describe("parseTagParams", () => {
  it.each([
    ["nature", "nature"],
    ["street%20art", "street art"],
    ["%D0%BA%D0%B8%D1%97%D0%B2", "київ"],
    ["digital storage", "digital storage"],
  ])("parses %s as the %s tag", (tag, expected) => {
    expect(parseTagParams({ tag, page: "2" })).toEqual({
      valid: true,
      query: expected,
      label: expected,
      page: 2,
      perPage: 20,
    });
  });

  it.each(["", "%20%20", "   "])("rejects the empty tag %j", (tag) => {
    expect(parseTagParams({ tag, page: "2" })).toEqual({
      valid: false,
      reason: "empty-tag",
      page: 1,
      perPage: 20,
    });
  });

  it("rejects malformed percent encoding without throwing", () => {
    expect(parseTagParams({ tag: "%E0%A4%A", page: "2" })).toEqual({
      valid: false,
      reason: "invalid-tag",
      page: 1,
      perPage: 20,
    });
  });

  it.each([
    [undefined, 1],
    ["0", 1],
    ["3", 3],
    ["999", 500],
    [["2", "3"], 1],
  ] as const)("normalizes page %j consistently", (page, expectedPage) => {
    const result = parseTagParams({ tag: "nature", page });

    expect(result.page).toBe(expectedPage);
  });
});
