import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileIdentity } from "@/features/auth/ProfileIdentity";
import { useAppSelector } from "@/store/hooks";
import {
  PERSISTENCE_STORAGE_KEY,
  PERSISTENCE_VERSION,
} from "@/store/persistence";
import AppProviders from "./providers";

vi.mock("next/link", () => ({
  default: ({ onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    />
  ),
}));

function StoreConsumer() {
  const savedPhotoCount = useAppSelector(
    (state) => state.collection.items.length,
  );

  return <span>Saved photos: {savedPhotoCount}</span>;
}

describe("AppProviders", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("provides a Redux store to client descendants", () => {
    render(
      <AppProviders>
        <StoreConsumer />
      </AppProviders>,
    );

    expect(screen.getByText("Saved photos: 0")).toBeVisible();
  });

  it("logs out a user restored from persistence", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      PERSISTENCE_STORAGE_KEY,
      JSON.stringify({
        version: PERSISTENCE_VERSION,
        auth: {
          user: { id: "user-1", name: "Ada", email: "ada@example.com" },
        },
        collection: { items: [] },
        preferences: { density: "comfortable" },
      }),
    );

    render(
      <AppProviders>
        <ProfileIdentity />
      </AppProviders>,
    );

    await user.click(await screen.findByRole("link", { name: "Log out" }));

    expect(
      await screen.findByRole("link", { name: "Register demo profile" }),
    ).toBeVisible();
    await waitFor(() =>
      expect(
        window.localStorage.getItem(PERSISTENCE_STORAGE_KEY),
      ).not.toContain("ada@example.com"),
    );
  });
});
