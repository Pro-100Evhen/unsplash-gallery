import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaginatedPhotos } from "@/domain/photo/types";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { renderWithStore } from "@/test/renderWithStore";

const { listPhotosMock, redirectMock } = vi.hoisted(() => ({
  listPhotosMock: vi.fn(),
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("next/cache", () => ({ io: vi.fn().mockResolvedValue(undefined) }));
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/lib/unsplash/client", () => ({ listPhotos: listPhotosMock }));

import { PhotoFeed } from "./page";

const response: PaginatedPhotos = {
  items: [
    {
      ...galleryPhotoFixture,
      altDescription: "A server-rendered mountain lake",
    },
  ],
  page: 1,
  perPage: 20,
  total: 1,
  totalPages: 1,
};

describe("PhotoFeed", () => {
  beforeEach(() => {
    listPhotosMock.mockReset();
    redirectMock.mockClear();
  });

  it("returns photo content from the selected server page", async () => {
    listPhotosMock.mockResolvedValue(response);
    renderWithStore(await PhotoFeed({ page: 1 }));

    expect(listPhotosMock).toHaveBeenCalledWith(1, 20);
    expect(
      screen.getByRole("img", { name: "A server-rendered mountain lake" }),
    ).toBeInTheDocument();
  });

  it("returns an empty state when Unsplash has no photos", async () => {
    listPhotosMock.mockResolvedValue({ ...response, items: [], total: 0 });
    renderWithStore(await PhotoFeed({ page: 1 }));

    expect(screen.getByRole("status")).toHaveTextContent("No photos yet");
  });

  it("requests the page selected in the URL", async () => {
    listPhotosMock.mockResolvedValue({
      ...response,
      page: 3,
      total: 60,
      totalPages: 3,
    });
    renderWithStore(await PhotoFeed({ page: 3 }));

    expect(listPhotosMock).toHaveBeenCalledWith(3, 20);
  });

  it("redirects an out-of-range page to the last available page", async () => {
    listPhotosMock.mockResolvedValue({
      ...response,
      items: [],
      page: 5,
      total: 40,
      totalPages: 2,
    });

    await expect(PhotoFeed({ page: 5 })).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/?page=2");
  });
});
