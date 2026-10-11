import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { renderWithStore } from "@/test/renderWithStore";
import { Gallery } from "./Gallery";
import styles from "./Gallery.module.scss";

describe("Gallery", () => {
  it("renders every photo exactly once", () => {
    const photos = [
      galleryPhotoFixture,
      {
        ...galleryPhotoFixture,
        id: "photo-two",
        altDescription: "A forest trail",
      },
    ];

    renderWithStore(<Gallery photos={photos} density="comfortable" />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getAllByRole("img", { name: galleryPhotoFixture.altDescription }),
    ).toHaveLength(1);
    expect(screen.getAllByRole("img", { name: "A forest trail" })).toHaveLength(
      1,
    );
  });

  it.each(["comfortable", "compact"] as const)(
    "maps the %s density to a dedicated layout class",
    (density) => {
      renderWithStore(
        <Gallery photos={[galleryPhotoFixture]} density={density} />,
      );

      expect(screen.getByRole("list", { name: "Photo gallery" })).toHaveClass(
        styles[density],
      );
    },
  );

  it("does not render a layout wrapper for an empty list", () => {
    const { container } = render(<Gallery photos={[]} density="comfortable" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("eagerly loads the masonry photos that can appear above the fold", () => {
    const photos = Array.from({ length: 12 }, (_, index) => ({
      ...galleryPhotoFixture,
      id: `photo-${index}`,
      altDescription: `Photo ${index}`,
    }));

    renderWithStore(<Gallery photos={photos} density="comfortable" />);

    const images = screen.getAllByRole("img");
    images
      .slice(0, 10)
      .forEach((image) => expect(image).toHaveAttribute("loading", "eager"));
    images
      .slice(10)
      .forEach((image) => expect(image).toHaveAttribute("loading", "lazy"));
  });
});
