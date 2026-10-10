import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { PhotoSummary } from "@/lib/unsplash/types";
import { GalleryView } from "./GalleryView";

const photo: PhotoSummary = {
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
    id: "user-one",
    username: "ada",
    name: "Ada Example",
    profileImageUrl: "https://images.unsplash.com/profile",
    profileUrl: "https://unsplash.com/@ada",
  },
};

describe("GalleryControls", () => {
  it("starts in comfortable mode and switches to compact mode", async () => {
    const user = userEvent.setup();
    render(<GalleryView photos={[photo]} />);

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
    render(<GalleryView photos={[photo]} />);
    const comfortableButton = screen.getByRole("button", {
      name: "Comfortable gallery view",
    });

    await user.click(comfortableButton);

    expect(comfortableButton).toHaveAttribute("aria-pressed", "true");
  });

  it("supports keyboard navigation and activation", async () => {
    const user = userEvent.setup();
    render(<GalleryView photos={[photo]} />);

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
