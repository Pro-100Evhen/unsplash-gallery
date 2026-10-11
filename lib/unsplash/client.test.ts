import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cacheLife } from "next/cache";
import { getPhoto, listPhotos, searchPhotos } from "./client";
import { UnsplashApiError } from "./errors";
import type { UnsplashApiPhoto } from "./types";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

const apiPhoto: UnsplashApiPhoto = {
  id: "photo-1",
  created_at: "2026-01-10T12:00:00Z",
  width: 2400,
  height: 1600,
  color: "#aabbcc",
  blur_hash: "blur-hash",
  description: "Mountain lake",
  alt_description: "A lake surrounded by mountains",
  likes: 42,
  urls: {
    raw: "https://images.unsplash.com/raw",
    full: "https://images.unsplash.com/full",
    regular: "https://images.unsplash.com/regular",
    small: "https://images.unsplash.com/small",
    thumb: "https://images.unsplash.com/thumb",
  },
  links: { html: "https://unsplash.com/photos/photo-1" },
  user: {
    id: "user-1",
    username: "ada",
    name: "Ada Example",
    profile_image: {
      small: "https://images.unsplash.com/profile-small",
      medium: "https://images.unsplash.com/profile-medium",
      large: "https://images.unsplash.com/profile-large",
    },
    links: { html: "https://unsplash.com/@ada" },
  },
};

function mockResponse(
  body: unknown,
  status = 200,
  headers?: Record<string, string>,
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("Unsplash client", () => {
  beforeEach(() => {
    vi.stubEnv("UNSPLASH_ACCESS_KEY", "test-access-key");
    vi.mocked(cacheLife).mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("lists photos and maps pagination headers to an internal result", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockResponse([apiPhoto], 200, { "x-total": "21" }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await listPhotos(2, 10);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.unsplash.com/photos?page=2&per_page=10",
      {
        headers: { Authorization: "Client-ID test-access-key" },
      },
    );
    expect(result).toMatchObject({
      page: 2,
      perPage: 10,
      total: 21,
      totalPages: 3,
    });
    expect(result.items[0]?.id).toBe("photo-1");
    expect(JSON.stringify(result)).not.toContain("test-access-key");
    expect(cacheLife).toHaveBeenCalledWith("hours");
  });

  it("searches photos using encoded query parameters", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        mockResponse({ total: 1, total_pages: 1, results: [apiPhoto] }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await searchPhotos("green forest", 3, 12);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.unsplash.com/search/photos?query=green+forest&page=3&per_page=12",
      {
        headers: { Authorization: "Client-ID test-access-key" },
      },
    );
    expect(result).toMatchObject({
      page: 3,
      perPage: 12,
      total: 1,
      totalPages: 1,
    });
    expect(result.items[0]?.author.name).toBe("Ada Example");
    expect(cacheLife).toHaveBeenCalledWith("hours");
  });

  it("gets and maps full photo details without a cache error boundary", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockResponse({
        ...apiPhoto,
        tags: [{ title: "mountain" }],
        location: null,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await getPhoto("photo/id");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.unsplash.com/photos/photo%2Fid",
      {
        headers: { Authorization: "Client-ID test-access-key" },
      },
    );
    expect(result).toMatchObject({
      id: "photo-1",
      likes: 42,
      tags: [{ title: "mountain" }],
      location: null,
    });
    expect(cacheLife).not.toHaveBeenCalled();
  });

  it("rejects malformed API payloads at the transport boundary", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse([{ id: "incomplete-photo" }])),
    );

    await expect(listPhotos()).rejects.toMatchObject({
      category: "invalid-response",
    });
  });

  it.each([
    [401, "unauthorized"],
    [403, "rate-limit"],
    [404, "not-found"],
  ] as const)(
    "maps HTTP %i through the shared %s error",
    async (status, category) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(mockResponse({}, status)),
      );

      await expect(getPhoto("photo-1")).rejects.toMatchObject({
        category,
        status,
      });
    },
  );

  it("normalizes fetch failures as network errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );

    await expect(listPhotos()).rejects.toMatchObject({
      category: "network",
      status: null,
    });
  });

  it("fails before fetch when the access key is missing", async () => {
    vi.stubEnv("UNSPLASH_ACCESS_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(listPhotos()).rejects.toBeInstanceOf(UnsplashApiError);
    await expect(listPhotos()).rejects.toMatchObject({
      category: "unauthorized",
      status: null,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
