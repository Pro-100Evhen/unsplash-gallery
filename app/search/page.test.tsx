import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaginatedPhotos } from "@/domain/photo/types";
import { galleryPhotoFixture } from "@/test/fixtures/photos";

const { redirectMock, searchPhotosMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  searchPhotosMock: vi.fn(),
}));

vi.mock("@/lib/unsplash/client", () => ({ searchPhotos: searchPhotosMock }));
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  usePathname: () => "/search",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams({ query: "forest" }),
}));

import { SearchResults } from "./page";

const response: PaginatedPhotos = {
  items: [
    {
      ...galleryPhotoFixture,
      id: "forest-one",
      width: 1200,
      height: 800,
      color: "#cccccc",
      altDescription: "A forest path",
      author: {
        ...galleryPhotoFixture.author,
        name: "Photo Author",
      },
    },
  ],
  page: 2,
  perPage: 20,
  total: 40,
  totalPages: 2,
};

describe("SearchResults", () => {
  beforeEach(() => {
    searchPhotosMock.mockReset();
    redirectMock.mockClear();
  });

  it("does not request Unsplash for an empty query", async () => {
    render(
      await SearchResults({
        parsed: { valid: false, reason: "empty-query", page: 1, perPage: 20 },
      }),
    );

    expect(searchPhotosMock).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Start with a search");
  });

  it("requests and server-renders the selected search page", async () => {
    searchPhotosMock.mockResolvedValue(response);
    render(
      await SearchResults({
        parsed: { valid: true, query: "forest", page: 2, perPage: 20 },
      }),
    );

    expect(searchPhotosMock).toHaveBeenCalledWith("forest", 2, 20);
    expect(screen.getByRole("img", { name: "A forest path" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Results for “forest”" }),
    ).toBeVisible();
  });

  it("renders a distinct zero-results state", async () => {
    searchPhotosMock.mockResolvedValue({ ...response, items: [], total: 0 });
    render(
      await SearchResults({
        parsed: { valid: true, query: "nothing", page: 1, perPage: 20 },
      }),
    );

    expect(screen.getByRole("status")).toHaveTextContent("No photos found");
  });

  it("redirects an out-of-range search page and preserves the query", async () => {
    searchPhotosMock.mockResolvedValue({
      ...response,
      items: [],
      page: 5,
      totalPages: 2,
    });

    await expect(
      SearchResults({
        parsed: { valid: true, query: "green forest", page: 5, perPage: 20 },
      }),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith(
      "/search?query=green+forest&page=2",
    );
  });
});
