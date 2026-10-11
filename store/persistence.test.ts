import { describe, expect, it, vi } from "vitest";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import {
  PERSISTENCE_VERSION,
  parsePersistedState,
  readPersistedState,
  writePersistedState,
} from "./persistence";

const validState = {
  version: PERSISTENCE_VERSION,
  auth: {
    user: { id: "user-1", name: "Ada Lovelace", email: "ada@example.com" },
  },
  collection: { items: [galleryPhotoFixture] },
  preferences: { density: "compact" as const },
};

describe("persistence", () => {
  it("parses a valid versioned state", () => {
    expect(parsePersistedState(JSON.stringify(validState))).toEqual(validState);
  });

  it("migrates version 1 state without losing saved photos", () => {
    const legacyState = {
      version: 1,
      collection: validState.collection,
      preferences: validState.preferences,
    };

    expect(parsePersistedState(JSON.stringify(legacyState))).toEqual({
      ...validState,
      auth: { user: null },
    });
  });

  it("rejects sensitive or unknown auth fields", () => {
    expect(
      parsePersistedState(
        JSON.stringify({
          ...validState,
          auth: { ...validState.auth, password: "password1" },
        }),
      ),
    ).toBeNull();
  });

  it.each([
    [null, "missing value"],
    ["not json", "invalid JSON"],
    [JSON.stringify({ ...validState, version: 999 }), "unknown version"],
    [
      JSON.stringify({
        ...validState,
        preferences: { density: "invalid" },
      }),
      "invalid state shape",
    ],
  ])("returns null for %s (%s)", (value, reason) => {
    expect(parsePersistedState(value), reason).toBeNull();
  });

  it("reads from and writes to the provided storage boundary", () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(validState)),
      setItem: vi.fn(),
    };

    expect(readPersistedState(storage)).toEqual(validState);
    writePersistedState(storage, validState);

    expect(storage.setItem).toHaveBeenCalledWith(
      "arounda-photo-gallery",
      JSON.stringify(validState),
    );
  });

  it("handles unavailable browser storage without crashing", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error("Storage blocked");
      }),
      setItem: vi.fn(() => {
        throw new Error("Storage blocked");
      }),
    };

    expect(readPersistedState(storage)).toBeNull();
    expect(() => writePersistedState(storage, validState)).not.toThrow();
  });
});
