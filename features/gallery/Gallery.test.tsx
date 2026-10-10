import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PhotoSummary } from "@/lib/unsplash/types";
import { Gallery } from "./Gallery";

const photoFixture: PhotoSummary = {
  id: "photo-one",
  createdAt: "2026-01-10T12:00:00Z",
  width: 2400,
  height: 1600,
  color: "#aabbcc",
  blurHash: null,
  altDescription: "A lake surrounded by mountains",
  urls: {
    raw: "https://images.unsplash.com/raw",
    full: "https://images.unsplash.com/full",
    regular: "https://images.unsplash.com/regular",
    small: "https://images.unsplash.com/small",
    thumb: "https://images.unsplash.com/thumb",
  },
  unsplashUrl: "https://unsplash.com/photos/photo-one",
  author: {
    id: "user-1",
    username: "ada",
    name: "Ada Example",
    profileImageUrl: "https://images.unsplash.com/profile",
    profileUrl: "https://unsplash.com/@ada",
  },
};

describe("Gallery", () => {
  it("renders every photo exactly once", () => {
    const photos = [
      photoFixture,
      {
        ...photoFixture,
        id: "photo-two",
        altDescription: "A forest trail",
      },
    ];

    render(<Gallery photos={photos} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getAllByRole("img", { name: photoFixture.altDescription }),
    ).toHaveLength(1);
    expect(screen.getAllByRole("img", { name: "A forest trail" })).toHaveLength(
      1,
    );
  });

  it("does not render a layout wrapper for an empty list", () => {
    const { container } = render(<Gallery photos={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
