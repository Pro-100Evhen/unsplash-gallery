import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaginatedPhotos } from "@/lib/unsplash/types";

const { listPhotosMock, searchPhotosMock } = vi.hoisted(() => ({
  listPhotosMock: vi.fn(),
  searchPhotosMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  io: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/unsplash/client", () => ({
  listPhotos: listPhotosMock,
  searchPhotos: searchPhotosMock,
}));

import { PhotoFeed } from "./page";

const response: PaginatedPhotos = {
  items: [
    {
      id: "photo-one",
      createdAt: "2026-01-10T12:00:00Z",
      width: 2400,
      height: 1600,
      color: "#aabbcc",
      blurHash: null,
      altDescription: "A server-rendered mountain lake",
      urls: {
        raw: "https://images.unsplash.com/raw",
        full: "https://images.unsplash.com/full",
        regular: "https://images.unsplash.com/regular",
        small: "https://images.unsplash.com/small",
        thumb: "https://images.unsplash.com/thumb",
      },
      unsplashUrl: "https://unsplash.com/photos/photo-one",
      author: {
        id: "user-one",
        username: "ada",
        name: "Ada Example",
        profileImageUrl: "https://images.unsplash.com/profile",
        profileUrl: "https://unsplash.com/@ada",
      },
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
    searchPhotosMock.mockReset();
  });

  it("returns photo content from the server data request", async () => {
    listPhotosMock.mockResolvedValue(response);

    render(await PhotoFeed({ query: "" }));

    expect(
      screen.getByRole("img", { name: "A server-rendered mountain lake" }),
    ).toBeInTheDocument();
  });

  it("returns an empty state when Unsplash has no photos", async () => {
    listPhotosMock.mockResolvedValue({ ...response, items: [], total: 0 });

    render(await PhotoFeed({ query: "" }));

    expect(screen.getByRole("status")).toHaveTextContent("No photos yet");
  });

  it("renders async search results instead of the default feed", async () => {
    searchPhotosMock.mockResolvedValue(response);

    render(await PhotoFeed({ query: "forest" }));

    expect(searchPhotosMock).toHaveBeenCalledWith("forest");
    expect(listPhotosMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Results for “forest”" }),
    ).toBeInTheDocument();
  });

  it("renders a specific empty state for a search without results", async () => {
    searchPhotosMock.mockResolvedValue({ ...response, items: [], total: 0 });

    render(await PhotoFeed({ query: "nothing" }));

    expect(screen.getByRole("status")).toHaveTextContent("No photos found");
  });
});
