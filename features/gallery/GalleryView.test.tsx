import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { renderWithStore } from "@/test/renderWithStore";
import { GalleryView } from "./GalleryView";

describe("GalleryView", () => {
  it("renders only the server-provided page and keeps density controls", async () => {
    const user = userEvent.setup();
    const photo = { ...galleryPhotoFixture, altDescription: "A forest path" };
    renderWithStore(<GalleryView photos={[photo]} title="Discover Photos" />);

    expect(screen.getByRole("img", { name: "A forest path" })).toBeVisible();
    expect(
      screen.queryByTestId("infinite-scroll-sentinel"),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Compact gallery view" }),
    );

    expect(
      screen.getByRole("button", { name: "Compact gallery view" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
