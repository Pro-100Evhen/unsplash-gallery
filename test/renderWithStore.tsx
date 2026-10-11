import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store";

type StoreRenderOptions = Omit<RenderOptions, "wrapper"> & {
  store?: AppStore;
};

export function renderWithStore(
  ui: ReactElement,
  { store = makeStore(), ...options }: StoreRenderOptions = {},
) {
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>, options),
  };
}
