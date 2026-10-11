import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GalleryPhoto } from "@/domain/photo/types";

export type SavedPhoto = GalleryPhoto;

export interface CollectionState {
  items: SavedPhoto[];
}

export const initialCollectionState: CollectionState = {
  items: [],
};

const collectionSlice = createSlice({
  name: "collection",
  initialState: initialCollectionState,
  reducers: {
    hydrateCollection(state, action: PayloadAction<SavedPhoto[]>) {
      state.items = action.payload.filter(
        (photo, index, photos) =>
          photos.findIndex((candidate) => candidate.id === photo.id) === index,
      );
    },
    savePhoto(state, action: PayloadAction<SavedPhoto>) {
      if (!state.items.some((photo) => photo.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removePhoto(state, action: PayloadAction<string>) {
      const index = state.items.findIndex(
        (photo) => photo.id === action.payload,
      );

      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
  },
});

type CollectionRootState = Readonly<{
  collection: CollectionState;
}>;

export const { hydrateCollection, removePhoto, savePhoto } =
  collectionSlice.actions;
export const collectionReducer = collectionSlice.reducer;

export const selectSavedPhotos = (state: CollectionRootState) =>
  state.collection.items;

export const selectIsPhotoSaved = (
  state: CollectionRootState,
  photoId: string,
) => state.collection.items.some((photo) => photo.id === photoId);
