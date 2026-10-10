import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PhotoSummary } from "@/lib/unsplash/types";
import { PhotoCard } from "./PhotoCard";

const photoFixture: PhotoSummary = {
  id: "photo/one",
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

describe("PhotoCard", () => {
  it("links the image to the encoded photo details route without nesting attribution links", () => {
    render(<PhotoCard photo={photoFixture} />);

    const detailsLink = screen.getByRole("link", {
      name: `View ${photoFixture.altDescription}`,
    });

    expect(detailsLink).toHaveAttribute("href", "/photos/photo%2Fone");
    expect(detailsLink.querySelector("a")).toBeNull();
  });

  it("preserves image dimensions and accessible fallback text", () => {
    render(
      <PhotoCard
        photo={{ ...photoFixture, altDescription: "Photo by Ada Example" }}
      />,
    );

    const image = screen.getByRole("img", { name: "Photo by Ada Example" });

    expect(image).toHaveAttribute("width", "2400");
    expect(image).toHaveAttribute("height", "1600");
    expect(image).toHaveStyle({ backgroundColor: "#aabbcc" });
  });

  it("adds Unsplash attribution parameters to external links", () => {
    render(<PhotoCard photo={photoFixture} />);

    for (const name of ["Ada Example", "Unsplash"]) {
      const link = screen.getByRole("link", { name });
      const url = new URL(link.getAttribute("href") ?? "");

      expect(url.searchParams.get("utm_source")).toBe("arounda_photo_gallery");
      expect(url.searchParams.get("utm_medium")).toBe("referral");
    }
  });
});
