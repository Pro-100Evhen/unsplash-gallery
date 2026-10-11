import { z } from "zod";

export const PERSISTENCE_VERSION = 1 as const;
export const PERSISTENCE_STORAGE_KEY = "arounda-photo-gallery";

const savedPhotoSchema = z
  .object({
    id: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    color: z.string().nullable(),
    altDescription: z.string().min(1),
    urls: z.object({ regular: z.string().url() }).strict(),
    unsplashUrl: z.string().url(),
    author: z
      .object({
        name: z.string().min(1),
        profileImageUrl: z.string().url(),
        profileUrl: z.string().url(),
      })
      .strict(),
  })
  .strict();

const persistedStateSchema = z
  .object({
    version: z.literal(PERSISTENCE_VERSION),
    collection: z.object({ items: z.array(savedPhotoSchema) }).strict(),
    preferences: z
      .object({ density: z.enum(["comfortable", "compact"]) })
      .strict(),
  })
  .strict();

export type PersistedState = z.infer<typeof persistedStateSchema>;

export interface PersistenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function parsePersistedState(
  value: string | null,
): PersistedState | null {
  if (value === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    const result = persistedStateSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function readPersistedState(
  storage: Pick<PersistenceStorage, "getItem">,
): PersistedState | null {
  try {
    return parsePersistedState(storage.getItem(PERSISTENCE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writePersistedState(
  storage: Pick<PersistenceStorage, "setItem">,
  state: PersistedState,
): void {
  try {
    storage.setItem(PERSISTENCE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}
