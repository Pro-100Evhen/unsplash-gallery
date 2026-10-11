import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GalleryDensity } from "./types";

export interface PreferencesState {
  density: GalleryDensity;
}

export const initialPreferencesState: PreferencesState = {
  density: "comfortable",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: initialPreferencesState,
  reducers: {
    setDensity(state, action: PayloadAction<GalleryDensity>) {
      state.density = action.payload;
    },
  },
});

type PreferencesRootState = Readonly<{
  preferences: PreferencesState;
}>;

export const { setDensity } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
export const selectDensity = (state: PreferencesRootState) =>
  state.preferences.density;
