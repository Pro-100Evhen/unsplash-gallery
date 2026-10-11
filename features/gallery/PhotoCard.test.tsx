import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { renderWithStore } from "@/test/renderWithStore";
import { PhotoCard } from "./PhotoCard";

const photoFixture = { ...galleryPhotoFixture, id: "photo/one" };

describe("PhotoCard", () => {
  it("links the image to the encoded photo details route without nesting attribution links", () => {
    renderWithStore(<PhotoCard photo={photoFixture} density="comfortable" />);

    const detailsLink = screen.getByRole("link", {
      name: `View ${photoFixture.altDescription}`,
    });

    expect(detailsLink).toHaveAttribute("href", "/photos/photo%2Fone");
    expect(detailsLink.querySelector("a")).toBeNull();
  });

  it("preserves image dimensions and accessible fallback text", () => {
    renderWithStore(
      <PhotoCard
        photo={{ ...photoFixture, altDescription: "Photo by Ada Example" }}
        density="comfortable"
      />,
    );

    const image = screen.getByRole("img", { name: "Photo by Ada Example" });

    expect(image).toHaveAttribute("width", "2400");
    expect(image).toHaveAttribute("height", "1600");
    expect(image).toHaveStyle({ backgroundColor: "#aabbcc" });
  });

  it("shows a MUI skeleton until the photo finishes loading", async () => {
    renderWithStore(<PhotoCard photo={photoFixture} density="comfortable" />);

    const image = screen.getByRole("img", {
      name: photoFixture.altDescription,
    });
    const imageLink = screen.getByRole("link", {
      name: `View ${photoFixture.altDescription}`,
    });

    expect(screen.getByTestId("photo-loading-skeleton")).toBeVisible();
    expect(imageLink).toHaveAttribute("aria-busy", "true");

    fireEvent.load(image);

    await waitFor(() => {
      expect(
        screen.queryByTestId("photo-loading-skeleton"),
      ).not.toBeInTheDocument();
    });
    expect(imageLink).toHaveAttribute("aria-busy", "false");
  });

  it("adds Unsplash attribution parameters to external links", () => {
    renderWithStore(<PhotoCard photo={photoFixture} density="comfortable" />);

    for (const name of ["Ada Example", "Unsplash"]) {
      const link = screen.getByRole("link", { name });
      const url = new URL(link.getAttribute("href") ?? "");

      expect(url.searchParams.get("utm_source")).toBe("arounda_photo_gallery");
      expect(url.searchParams.get("utm_medium")).toBe("referral");
    }
  });

  it.each([
    ["comfortable", "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"],
    ["compact", "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw"],
  ] as const)(
    "uses responsive image sizes for %s density",
    (density, sizes) => {
      renderWithStore(<PhotoCard photo={photoFixture} density={density} />);

      expect(screen.getByRole("img")).toHaveAttribute("sizes", sizes);
    },
  );

  it("eagerly loads an above-the-fold photo when requested", () => {
    renderWithStore(
      <PhotoCard photo={photoFixture} density="comfortable" eager />,
    );

    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
  });
});
