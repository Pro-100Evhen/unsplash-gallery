import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { renderWithStore } from "@/test/renderWithStore";
import { SavePhotoButton } from "./SavePhotoButton";

describe("SavePhotoButton", () => {
  it("toggles save and remove with an accessible action name", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <SavePhotoButton photo={galleryPhotoFixture} />,
    );

    const saveButton = screen.getByRole("button", {
      name: "Save photo to collection",
    });
    await user.click(saveButton);

    expect(store.getState().collection.items).toEqual([galleryPhotoFixture]);
    const removeButton = screen.getByRole("button", {
      name: "Remove photo from collection",
    });
    await user.click(removeButton);

    expect(store.getState().collection.items).toEqual([]);
  });

  it("supports keyboard activation", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <SavePhotoButton photo={galleryPhotoFixture} />,
    );

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Save photo to collection" }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(store.getState().collection.items).toHaveLength(1);
  });

  it("stores only the minimal gallery fields from a wider DTO", async () => {
    const user = userEvent.setup();
    const widerPhoto = {
      ...galleryPhotoFixture,
      description: "Not persisted",
      likes: 42,
    };
    const { store } = renderWithStore(<SavePhotoButton photo={widerPhoto} />);

    await user.click(
      screen.getByRole("button", { name: "Save photo to collection" }),
    );

    expect(store.getState().collection.items[0]).toEqual(galleryPhotoFixture);
    expect(store.getState().collection.items[0]).not.toHaveProperty(
      "description",
    );
    expect(store.getState().collection.items[0]).not.toHaveProperty("likes");
  });
});
