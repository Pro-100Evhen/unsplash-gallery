import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GalleryLoadingState } from "./GalleryLoadingState";

describe("GalleryLoadingState", () => {
  it("renders route-specific copy and an accessible skeleton", () => {
    render(<GalleryLoadingState title="Searching photos…" />);

    expect(
      screen.getByRole("heading", { name: "Searching photos…" }),
    ).toBeVisible();
    expect(
      screen.getByRole("status", { name: "Loading photos" }),
    ).toBeVisible();
  });
});
