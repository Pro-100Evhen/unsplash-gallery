import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeStore } from "@/store";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { renderWithStore } from "@/test/renderWithStore";
import { savePhoto } from "./collectionSlice";
import { ProfileCollection } from "./ProfileCollection";

vi.mock("next/link", () => ({ default: "a" }));

describe("ProfileCollection", () => {
  it("shows an empty state with a gallery CTA", () => {
    renderWithStore(<ProfileCollection />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "My collection",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Demo profile" }),
    ).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Your collection is empty",
    );
    expect(
      screen.getByRole("link", { name: "Explore photos" }),
    ).toHaveAttribute("href", "/");
  });

  it("renders saved photos and removes them without an API request", async () => {
    const user = userEvent.setup();
    const store = makeStore();
    store.dispatch(savePhoto(galleryPhotoFixture));

    renderWithStore(<ProfileCollection />, { store });

    const headings = screen.getAllByRole("heading");
    expect(headings[0]).toHaveTextContent("My collection");
    expect(headings[0].tagName).toBe("H1");
    expect(headings[1]).toHaveTextContent("Demo profile");
    expect(headings[1].tagName).toBe("H2");
    expect(
      screen.getByRole("img", { name: galleryPhotoFixture.altDescription }),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Remove photo from collection" }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Your collection is empty",
    );
    expect(store.getState().collection.items).toEqual([]);
  });
});
