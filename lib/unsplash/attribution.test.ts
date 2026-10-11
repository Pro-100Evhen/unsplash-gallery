import { describe, expect, it } from "vitest";
import { getUnsplashAttributionUrl } from "./attribution";

describe("getUnsplashAttributionUrl", () => {
  it("adds the application attribution parameters to Unsplash links", () => {
    expect(
      getUnsplashAttributionUrl("https://unsplash.com/photos/example?foo=bar"),
    ).toBe(
      "https://unsplash.com/photos/example?foo=bar&utm_source=arounda_photo_gallery&utm_medium=referral",
    );
  });

  it.each(["javascript:alert(1)", "https://example.com/photo", "not-a-url"])(
    "falls back to Unsplash for an unsafe URL: %s",
    (url) => {
      expect(getUnsplashAttributionUrl(url)).toBe(
        "https://unsplash.com/?utm_source=arounda_photo_gallery&utm_medium=referral",
      );
    },
  );
});
