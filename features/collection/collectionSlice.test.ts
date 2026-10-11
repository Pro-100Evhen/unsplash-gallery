import { describe, expect, it } from "vitest";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import {
  collectionReducer,
  removePhoto,
  savePhoto,
  selectIsPhotoSaved,
  selectSavedPhotos,
} from "./collectionSlice";

describe("collectionSlice", () => {
  it("saves a photo only once by id", () => {
    const once = collectionReducer(undefined, savePhoto(galleryPhotoFixture));
    const twice = collectionReducer(
      once,
      savePhoto({ ...galleryPhotoFixture, altDescription: "Updated text" }),
    );

    expect(twice.items).toEqual([galleryPhotoFixture]);
  });

  it("removes a saved photo by id", () => {
    const saved = collectionReducer(undefined, savePhoto(galleryPhotoFixture));
    const result = collectionReducer(
      saved,
      removePhoto(galleryPhotoFixture.id),
    );

    expect(result.items).toEqual([]);
  });

  it("keeps the same state when removing an unknown id", () => {
    const saved = collectionReducer(undefined, savePhoto(galleryPhotoFixture));
    const result = collectionReducer(saved, removePhoto("unknown"));

    expect(result).toBe(saved);
  });

  it("selects the stable list and saved state", () => {
    const collection = collectionReducer(
      undefined,
      savePhoto(galleryPhotoFixture),
    );
    const state = { collection };

    expect(selectSavedPhotos(state)).toBe(collection.items);
    expect(selectSavedPhotos(state)).toBe(selectSavedPhotos(state));
    expect(selectIsPhotoSaved(state, galleryPhotoFixture.id)).toBe(true);
    expect(selectIsPhotoSaved(state, "unknown")).toBe(false);
  });
});
