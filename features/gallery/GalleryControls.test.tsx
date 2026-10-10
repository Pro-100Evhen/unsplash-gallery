import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { GalleryView } from "./GalleryView";

describe("GalleryControls", () => {
  it("starts in comfortable mode and switches to compact mode", async () => {
    const user = userEvent.setup();
    render(<GalleryView photos={[galleryPhotoFixture]} />);

    const comfortableButton = screen.getByRole("button", {
      name: "Comfortable gallery view",
    });
    const compactButton = screen.getByRole("button", {
      name: "Compact gallery view",
    });

    expect(
      screen.getByRole("group", { name: "Gallery layout" }),
    ).toBeInTheDocument();
    expect(comfortableButton).toHaveAttribute("aria-pressed", "true");

    await user.click(compactButton);

    expect(compactButton).toHaveAttribute("aria-pressed", "true");
    expect(comfortableButton).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps the selected mode when its button is clicked again", async () => {
    const user = userEvent.setup();
    render(<GalleryView photos={[galleryPhotoFixture]} />);
    const comfortableButton = screen.getByRole("button", {
      name: "Comfortable gallery view",
    });

    await user.click(comfortableButton);

    expect(comfortableButton).toHaveAttribute("aria-pressed", "true");
  });

  it("supports keyboard navigation and activation", async () => {
    const user = userEvent.setup();
    render(<GalleryView photos={[galleryPhotoFixture]} />);

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Comfortable gallery view" }),
    ).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    const compactButton = screen.getByRole("button", {
      name: "Compact gallery view",
    });
    expect(compactButton).toHaveFocus();

    await user.keyboard(" ");
    expect(compactButton).toHaveAttribute("aria-pressed", "true");
  });
});
