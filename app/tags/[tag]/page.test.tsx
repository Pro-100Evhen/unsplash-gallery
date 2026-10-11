import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaginatedPhotos } from "@/domain/photo/types";
import type { TagParamsResult } from "@/features/tags/tagParams";
import { galleryPhotoFixture } from "@/test/fixtures/photos";
import { renderWithStore } from "@/test/renderWithStore";

const { redirectMock, searchPhotosMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  searchPhotosMock: vi.fn(),
}));

vi.mock("@/lib/unsplash/client", () => ({ searchPhotos: searchPhotosMock }));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
  redirect: redirectMock,
  usePathname: () => "/tags/street%20art",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams({ page: "2" }),
}));

import { TagResults } from "./page";

const parsedTag: Extract<TagParamsResult, { valid: true }> = {
  valid: true,
  query: "street art",
  label: "street art",
  page: 2,
  perPage: 20,
};

const response: PaginatedPhotos = {
  items: [
    {
      ...galleryPhotoFixture,
      id: "street-art-one",
      altDescription: "A colorful mural",
    },
  ],
  page: 2,
  perPage: 20,
  total: 60,
  totalPages: 3,
};

describe("TagResults", () => {
  beforeEach(() => {
    redirectMock.mockClear();
    searchPhotosMock.mockReset();
  });

  it("requests and server-renders the selected tag page", async () => {
    searchPhotosMock.mockResolvedValue(response);

    renderWithStore(await TagResults({ parsed: parsedTag }));

    expect(searchPhotosMock).toHaveBeenCalledWith("street art", 2, 20);
    expect(
      screen.getByRole("heading", { name: "Photos tagged “street art”" }),
    ).toBeVisible();
    expect(screen.getByRole("img", { name: "A colorful mural" })).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Photo gallery pagination" }),
    ).toBeVisible();
  });

  it("renders an empty state when a tag has no photos", async () => {
    searchPhotosMock.mockResolvedValue({
      ...response,
      items: [],
      total: 0,
      totalPages: 0,
    });

    renderWithStore(await TagResults({ parsed: parsedTag }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "No photos found for this tag",
    );
  });

  it("redirects an out-of-range page while preserving the encoded tag", async () => {
    searchPhotosMock.mockResolvedValue({
      ...response,
      items: [],
      page: 5,
      totalPages: 3,
    });

    await expect(
      TagResults({ parsed: { ...parsedTag, page: 5 } }),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/tags/street%20art?page=3");
  });
});
