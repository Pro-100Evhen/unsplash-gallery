import "server-only";

import { cacheLife } from "next/cache";
import { z } from "zod";
import type { PaginatedPhotos, PhotoDetails } from "@/domain/photo/types";
import {
  UnsplashApiError,
  createUnsplashHttpError,
  normalizeUnsplashError,
} from "./errors";
import { mapGalleryPhoto, mapPhotoDetails } from "./mappers";
import {
  unsplashApiPhotoDetailsSchema,
  unsplashApiPhotoSchema,
  unsplashApiSearchResponseSchema,
} from "./types";

const UNSPLASH_API_URL = "https://api.unsplash.com/";
const DEFAULT_PER_PAGE = 20;
const UNSPLASH_REQUEST_TIMEOUT_MS = 10_000;

interface UnsplashResponse<T> {
  data: T;
  headers: Headers;
}

function getAccessKey(): string {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

  if (!accessKey) {
    throw new UnsplashApiError("UNSPLASH_ACCESS_KEY is not configured.", {
      category: "unauthorized",
    });
  }

  return accessKey;
}

async function requestUnsplash<T>(
  path: string,
  schema: z.ZodType<T>,
  searchParams?: URLSearchParams,
): Promise<UnsplashResponse<T>> {
  const accessKey = getAccessKey();
  const url = new URL(path, UNSPLASH_API_URL);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      signal: AbortSignal.timeout(UNSPLASH_REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw createUnsplashHttpError(response.status);
    }

    const payload: unknown = await response.json();

    return {
      data: schema.parse(payload),
      headers: response.headers,
    };
  } catch (error) {
    throw normalizeUnsplashError(error);
  }
}

function parseTotal(value: string | null): number | null {
  if (value === null) {
    return null;
  }

  const total = Number.parseInt(value, 10);

  return Number.isNaN(total) || total < 0 ? null : total;
}

export async function listPhotos(
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): Promise<PaginatedPhotos> {
  "use cache";
  cacheLife("hours");

  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  const response = await requestUnsplash(
    "photos",
    z.array(unsplashApiPhotoSchema),
    searchParams,
  );
  const total = parseTotal(response.headers.get("x-total"));

  return {
    items: response.data.map(mapGalleryPhoto),
    page,
    perPage,
    total,
    totalPages: total === null ? null : Math.ceil(total / perPage),
  };
}

export async function searchPhotos(
  query: string,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): Promise<PaginatedPhotos> {
  "use cache";
  cacheLife("hours");

  const searchParams = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
  });
  const response = await requestUnsplash(
    "search/photos",
    unsplashApiSearchResponseSchema,
    searchParams,
  );

  return {
    items: response.data.results.map(mapGalleryPhoto),
    page,
    perPage,
    total: response.data.total,
    totalPages: response.data.total_pages,
  };
}

export async function getPhoto(id: string): Promise<PhotoDetails> {
  "use cache";
  cacheLife("minutes");

  const response = await requestUnsplash(
    `photos/${encodeURIComponent(id)}`,
    unsplashApiPhotoDetailsSchema,
  );

  return mapPhotoDetails(response.data);
}
