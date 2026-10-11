import type { AppStore } from "./index";
import {
  PERSISTENCE_VERSION,
  type PersistenceStorage,
  type PersistedState,
  writePersistedState,
} from "./persistence";

const PERSISTENCE_DEBOUNCE_MS = 100;

function selectPersistedState(store: AppStore): PersistedState {
  const state = store.getState();

  return {
    version: PERSISTENCE_VERSION,
    auth: state.auth,
    collection: state.collection,
    preferences: state.preferences,
  };
}

function persistedSlicesChanged(
  previous: PersistedState,
  next: PersistedState,
): boolean {
  return (
    previous.auth !== next.auth ||
    previous.collection !== next.collection ||
    previous.preferences !== next.preferences
  );
}

export function subscribeToStorePersistence(
  store: AppStore,
  storage: Pick<PersistenceStorage, "setItem">,
): () => void {
  let lastObservedState = selectPersistedState(store);
  let pendingState: PersistedState | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (pendingState) {
      writePersistedState(storage, pendingState);
      pendingState = null;
    }

    timeoutId = null;
  };

  const unsubscribe = store.subscribe(() => {
    const nextState = selectPersistedState(store);

    if (!persistedSlicesChanged(lastObservedState, nextState)) {
      return;
    }

    lastObservedState = nextState;
    pendingState = nextState;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(flush, PERSISTENCE_DEBOUNCE_MS);
  });

  return () => {
    unsubscribe();

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      flush();
    }
  };
}
