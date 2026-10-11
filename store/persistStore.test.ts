import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setDensity } from "@/features/gallery/preferencesSlice";
import { makeStore } from "./index";
import { subscribeToStorePersistence } from "./persistStore";

describe("subscribeToStorePersistence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces consecutive state changes into one storage write", () => {
    const store = makeStore();
    const storage = { setItem: vi.fn() };
    const unsubscribe = subscribeToStorePersistence(store, storage);

    store.dispatch(setDensity("compact"));
    store.dispatch(setDensity("comfortable"));
    store.dispatch(setDensity("compact"));

    expect(storage.setItem).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(storage.setItem).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it("flushes a pending state before unsubscribing", () => {
    const store = makeStore();
    const storage = { setItem: vi.fn() };
    const unsubscribe = subscribeToStorePersistence(store, storage);

    store.dispatch(setDensity("compact"));
    unsubscribe();

    expect(storage.setItem).toHaveBeenCalledTimes(1);
    vi.runAllTimers();
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("persists the latest state when a value returns to its initial value", () => {
    const store = makeStore();
    const storage = { setItem: vi.fn() };
    const unsubscribe = subscribeToStorePersistence(store, storage);

    store.dispatch(setDensity("compact"));
    store.dispatch(setDensity("comfortable"));
    vi.runAllTimers();

    expect(JSON.parse(storage.setItem.mock.calls[0]![1])).toMatchObject({
      preferences: { density: "comfortable" },
    });

    unsubscribe();
  });
});
