import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnsplashApiError } from "@/lib/unsplash/errors";
import { photoDetailsFixture } from "@/test/fixtures/photos";

const { getPhotoMock, notFoundMock } = vi.hoisted(() => ({
  getPhotoMock: vi.fn(),
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

vi.mock("@/lib/unsplash/client", () => ({ getPhoto: getPhotoMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));

import PhotoPage, { generateMetadata } from "./page";

describe("PhotoPage", () => {
  beforeEach(() => {
    getPhotoMock.mockReset();
    notFoundMock.mockClear();
  });

  it("server-renders details for the decoded route id", async () => {
    getPhotoMock.mockResolvedValue(photoDetailsFixture);

    render(await PhotoPage({ params: Promise.resolve({ id: "photo/one" }) }));

    expect(getPhotoMock).toHaveBeenCalledWith("photo/one");
    expect(
      screen.getByRole("heading", { name: "Photo by Ada Example" }),
    ).toBeVisible();
  });

  it("renders the not-found boundary for a missing photo", async () => {
    getPhotoMock.mockRejectedValue(
      new UnsplashApiError("Missing photo", {
        category: "not-found",
        status: 404,
      }),
    );

    await expect(
      PhotoPage({ params: Promise.resolve({ id: "missing" }) }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(notFoundMock).toHaveBeenCalledOnce();
  });

  it("does not convert other API failures into a 404", async () => {
    const networkError = new UnsplashApiError("Offline", {
      category: "network",
    });
    getPhotoMock.mockRejectedValue(networkError);

    await expect(
      PhotoPage({ params: Promise.resolve({ id: "photo-one" }) }),
    ).rejects.toBe(networkError);
    expect(notFoundMock).not.toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    getPhotoMock.mockReset();
  });

  it("uses the photo description for metadata", async () => {
    getPhotoMock.mockResolvedValue(photoDetailsFixture);

    await expect(
      generateMetadata({ params: Promise.resolve({ id: "photo-one" }) }),
    ).resolves.toMatchObject({
      title: "Mountain lake",
      description: "Mountain lake",
    });
  });

  it("falls back to accessible photo text when description is absent", async () => {
    getPhotoMock.mockResolvedValue({
      ...photoDetailsFixture,
      description: null,
    });

    await expect(
      generateMetadata({ params: Promise.resolve({ id: "photo-one" }) }),
    ).resolves.toMatchObject({
      title: photoDetailsFixture.altDescription,
      description: photoDetailsFixture.altDescription,
    });
  });
});
