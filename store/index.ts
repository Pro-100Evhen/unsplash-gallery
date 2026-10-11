import { configureStore } from "@reduxjs/toolkit";
import { collectionReducer } from "@/features/collection/collectionSlice";
import { preferencesReducer } from "@/features/gallery/preferencesSlice";
import { authReducer } from "@/features/auth/authSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      collection: collectionReducer,
      preferences: preferencesReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
