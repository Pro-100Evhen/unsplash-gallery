import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAppSelector } from "@/store/hooks";
import AppProviders from "./providers";

function StoreConsumer() {
  const savedPhotoCount = useAppSelector(
    (state) => state.collection.items.length,
  );

  return <span>Saved photos: {savedPhotoCount}</span>;
}

describe("AppProviders", () => {
  it("provides a Redux store to client descendants", () => {
    render(
      <AppProviders>
        <StoreConsumer />
      </AppProviders>,
    );

    expect(screen.getByText("Saved photos: 0")).toBeVisible();
  });
});
