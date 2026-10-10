import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PaginatedPhotos, PhotoSummary } from "@/lib/unsplash/types";
import { GalleryView } from "./GalleryView";

let intersectionCallback: IntersectionObserverCallback;

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

function createPhoto(id: string): PhotoSummary {
  return {
    id,
    createdAt: "2026-01-10T12:00:00Z",
    width: 1200,
    height: 800,
    color: "#cccccc",
    blurHash: null,
    altDescription: `Photo ${id}`,
    urls: {
      raw: `https://images.unsplash.com/${id}/raw`,
      full: `https://images.unsplash.com/${id}/full`,
      regular: `https://images.unsplash.com/${id}/regular`,
      small: `https://images.unsplash.com/${id}/small`,
      thumb: `https://images.unsplash.com/${id}/thumb`,
    },
    unsplashUrl: `https://unsplash.com/photos/${id}`,
    author: {
      id: `author-${id}`,
      username: `author-${id}`,
      name: `Author ${id}`,
      profileImageUrl: `https://images.unsplash.com/${id}/profile`,
      profileUrl: `https://unsplash.com/@author-${id}`,
    },
  };
}

describe("GalleryView infinite scroll", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads and appends the next search page only once per intersection", async () => {
    let resolveRequest!: (response: Response) => void;
    const nextPage: PaginatedPhotos = {
      items: [createPhoto("second")],
      page: 2,
      perPage: 20,
      total: 40,
      totalPages: 2,
    };
    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(
      <GalleryView
        photos={[createPhoto("first")]}
        title="Results for forest"
        query="forest"
        initialPage={1}
        totalPages={2}
      />,
    );

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      "/api/photos?page=2&query=forest",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(
      screen.getByRole("status", { name: "Loading more photos" }),
    ).toBeVisible();

    resolveRequest(
      new Response(JSON.stringify(nextPage), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("img", { name: "Photo second" })).toBeVisible();
    });
    expect(
      screen.queryByRole("status", { name: "Loading more photos" }),
    ).not.toBeInTheDocument();
  });

  it("does not observe for another page when all pages are loaded", () => {
    render(
      <GalleryView
        photos={[createPhoto("only")]}
        title="Discover Photos"
        initialPage={1}
        totalPages={1}
      />,
    );

    expect(fetch).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId("infinite-scroll-sentinel"),
    ).not.toBeInTheDocument();
  });
});
