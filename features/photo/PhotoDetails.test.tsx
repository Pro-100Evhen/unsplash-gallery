import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PhotoDetails as PhotoDetailsDto } from "@/domain/photo/types";
import { photoDetailsFixture } from "@/test/fixtures/photos";
import { PhotoDetails } from "./PhotoDetails";

describe("PhotoDetails", () => {
  it("renders the complete photo metadata and attribution", () => {
    render(<PhotoDetails photo={photoDetailsFixture} />);

    expect(
      screen.getByRole("heading", { name: "Photo by Ada Example", level: 1 }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", {
        name: photoDetailsFixture.altDescription,
      }),
    ).toHaveAttribute("src", expect.stringContaining("regular"));
    expect(screen.getByText("Mountain lake")).toBeVisible();
    expect(screen.getByText("42 likes")).toBeVisible();
    expect(screen.getByText("January 10, 2026")).toBeVisible();
    expect(screen.getByText("Lake Louise, Canada")).toBeVisible();

    expect(screen.getByRole("link", { name: "Ada Example" })).toHaveAttribute(
      "href",
      expect.stringContaining("utm_source=arounda_photo_gallery"),
    );
    expect(screen.getByRole("link", { name: "Unsplash" })).toHaveAttribute(
      "href",
      expect.stringContaining("utm_medium=referral"),
    );
  });

  it("links tags to encoded tag routes", () => {
    render(
      <PhotoDetails
        photo={{
          ...photoDetailsFixture,
          tags: [{ title: "street art" }, { title: "sea/coast" }],
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "street art" })).toHaveAttribute(
      "href",
      "/tags/street%20art",
    );
    expect(screen.getByRole("link", { name: "sea/coast" })).toHaveAttribute(
      "href",
      "/tags/sea%2Fcoast",
    );
  });

  it("omits optional sections when their values are empty", () => {
    const minimalPhoto: PhotoDetailsDto = {
      ...photoDetailsFixture,
      description: null,
      tags: [],
      location: {
        name: null,
        city: null,
        country: null,
      },
    };

    render(<PhotoDetails photo={minimalPhoto} />);

    expect(screen.queryByText("Mountain lake")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Tags" })).toBeNull();
    expect(screen.queryByTestId("photo-location")).toBeNull();
    expect(screen.getByText("42 likes")).toBeVisible();
    expect(screen.getByText("January 10, 2026")).toBeVisible();
  });
});
