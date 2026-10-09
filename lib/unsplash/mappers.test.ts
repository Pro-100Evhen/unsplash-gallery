import { describe, expect, it } from "vitest";
import { mapPhotoDetails, mapPhotoSummary } from "./mappers";
import type { UnsplashApiPhoto } from "./types";

const apiPhoto: UnsplashApiPhoto = {
  id: "photo-1",
  created_at: "2026-01-10T12:00:00Z",
  width: 2400,
  height: 1600,
  color: "#aabbcc",
  blur_hash: "blur-hash",
  description: "Mountain lake",
  alt_description: "A lake surrounded by mountains",
  likes: 42,
  urls: {
    raw: "https://images.unsplash.com/raw",
    full: "https://images.unsplash.com/full",
    regular: "https://images.unsplash.com/regular",
    small: "https://images.unsplash.com/small",
    thumb: "https://images.unsplash.com/thumb",
  },
  links: {
    html: "https://unsplash.com/photos/photo-1",
  },
  user: {
    id: "user-1",
    username: "ada",
    name: "Ada Example",
    profile_image: {
      small: "https://images.unsplash.com/profile-small",
      medium: "https://images.unsplash.com/profile-medium",
      large: "https://images.unsplash.com/profile-large",
    },
    links: {
      html: "https://unsplash.com/@ada",
    },
  },
};

describe("mapPhotoSummary", () => {
  it("maps an abbreviated API photo to the internal summary contract", () => {
    expect(mapPhotoSummary(apiPhoto)).toEqual({
      id: "photo-1",
      createdAt: "2026-01-10T12:00:00Z",
      width: 2400,
      height: 1600,
      color: "#aabbcc",
      blurHash: "blur-hash",
      altDescription: "A lake surrounded by mountains",
      urls: apiPhoto.urls,
      unsplashUrl: "https://unsplash.com/photos/photo-1",
      author: {
        id: "user-1",
        username: "ada",
        name: "Ada Example",
        profileImageUrl: "https://images.unsplash.com/profile-medium",
        profileUrl: "https://unsplash.com/@ada",
      },
    });
  });

  it("falls back to a useful alt description when API text is missing", () => {
    const photoWithoutText = {
      ...apiPhoto,
      description: null,
      alt_description: null,
    };

    expect(mapPhotoSummary(photoWithoutText).altDescription).toBe(
      "Photo by Ada Example",
    );
  });
});

describe("mapPhotoDetails", () => {
  it("maps tags and location when full details are available", () => {
    const result = mapPhotoDetails({
      ...apiPhoto,
      tags: [{ title: "mountain" }, { title: "lake" }],
      location: {
        name: "Lake Louise",
        city: null,
        country: "Canada",
        position: { latitude: 51.4254, longitude: -116.1773 },
      },
    });

    expect(result.tags).toEqual([{ title: "mountain" }, { title: "lake" }]);
    expect(result.location).toEqual({
      name: "Lake Louise",
      city: null,
      country: "Canada",
    });
    expect(result.description).toBe("Mountain lake");
    expect(result.likes).toBe(42);
  });

  it("normalizes missing optional details to stable defaults", () => {
    const result = mapPhotoDetails({
      ...apiPhoto,
      description: null,
      alt_description: "  A quiet landscape  ",
      tags: undefined,
      location: undefined,
    });

    expect(result.description).toBe("A quiet landscape");
    expect(result.altDescription).toBe("A quiet landscape");
    expect(result.tags).toEqual([]);
    expect(result.location).toBeNull();
  });
});
