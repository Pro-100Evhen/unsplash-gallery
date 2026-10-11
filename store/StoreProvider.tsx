"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { hydrateCollection } from "@/features/collection/collectionSlice";
import { setDensity } from "@/features/gallery/preferencesSlice";
import { makeStore, type AppStore } from "./index";
import {
  PERSISTENCE_VERSION,
  readPersistedState,
  writePersistedState,
} from "./persistence";

type StoreProviderProps = Readonly<{
  children: ReactNode;
  store?: AppStore;
}>;

const clientStore = makeStore();
const initialServerState = clientStore.getState();

export function StoreProvider({ children, store }: StoreProviderProps) {
  const appStore = store ?? clientStore;
  const serverState = store?.getState() ?? initialServerState;

  useEffect(() => {
    const persistedState = readPersistedState(window.localStorage);

    if (persistedState) {
      appStore.dispatch(hydrateCollection(persistedState.collection.items));
      appStore.dispatch(setDensity(persistedState.preferences.density));
    }

    return appStore.subscribe(() => {
      const state = appStore.getState();

      writePersistedState(window.localStorage, {
        version: PERSISTENCE_VERSION,
        collection: state.collection,
        preferences: state.preferences,
      });
    });
  }, [appStore]);

  return (
    <Provider store={appStore} serverState={serverState}>
      {children}
    </Provider>
  );
}
