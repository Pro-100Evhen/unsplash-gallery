import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GallerySkeleton } from "./GallerySkeleton";

describe("GallerySkeleton", () => {
  it("exposes a distinct busy loading state", () => {
    render(<GallerySkeleton />);

    expect(
      screen.getByRole("status", { name: "Loading photos" }),
    ).toHaveAttribute("aria-busy", "true");
  });
});
