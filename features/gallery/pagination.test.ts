import { describe, expect, it } from "vitest";
import {
  MAX_GALLERY_PAGE,
  parsePageParam,
  shouldRedirectPageParam,
} from "./pagination";

describe("parsePageParam", () => {
  it.each([
    [undefined, 1],
    ["", 1],
    ["0", 1],
    ["-2", 1],
    ["1.5", 1],
    ["not-a-number", 1],
    [["2", "3"], 1],
    ["7", 7],
    [String(MAX_GALLERY_PAGE + 1), MAX_GALLERY_PAGE],
    [String(Number.MAX_SAFE_INTEGER), MAX_GALLERY_PAGE],
  ])("normalizes %j to %i", (input, expected) => {
    expect(parsePageParam(input)).toBe(expected);
  });
});

describe("shouldRedirectPageParam", () => {
  it.each([
    [undefined, false],
    ["1", false],
    ["7", false],
    ["wrong", true],
    [["2", "3"], true],
    [String(MAX_GALLERY_PAGE + 1), true],
  ])("returns %s for %j", (input, expected) => {
    expect(shouldRedirectPageParam(input)).toBe(expected);
  });
});
