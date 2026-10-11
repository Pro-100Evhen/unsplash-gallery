import { describe, expect, it } from "vitest";
import { makeStore } from "@/store";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { savePhoto } from "@/features/collection/collectionSlice";
import { logoutDemoUser, registerDemoUser } from "./authSlice";

const demoUser = {
  id: "user-1",
  name: "Ada Lovelace",
  email: "ada@example.com",
};

describe("authSlice", () => {
  it("registers and logs out a demo user without changing the collection", () => {
    const store = makeStore();
    store.dispatch(savePhoto(galleryPhotoFixture));
    store.dispatch(registerDemoUser(demoUser));

    expect(store.getState().auth.user).toEqual(demoUser);
    store.dispatch(logoutDemoUser());
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().collection.items).toEqual([galleryPhotoFixture]);
  });
});
