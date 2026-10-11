import { ZodError } from "zod";

export type UnsplashErrorCategory =
  | "unauthorized"
  | "rate-limit"
  | "not-found"
  | "network"
  | "timeout"
  | "invalid-response"
  | "unknown";

interface UnsplashApiErrorOptions {
  category: UnsplashErrorCategory;
  status?: number | null;
  cause?: unknown;
}

export class UnsplashApiError extends Error {
  readonly category: UnsplashErrorCategory;
  readonly status: number | null;

  constructor(message: string, options: UnsplashApiErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "UnsplashApiError";
    this.category = options.category;
    this.status = options.status ?? null;
  }
}

export function createUnsplashHttpError(status: number): UnsplashApiError {
  switch (status) {
    case 401:
      return new UnsplashApiError("Unsplash request is unauthorized.", {
        category: "unauthorized",
        status,
      });
    case 403:
      return new UnsplashApiError("Unsplash rate limit has been reached.", {
        category: "rate-limit",
        status,
      });
    case 404:
      return new UnsplashApiError(
        "The requested Unsplash resource was not found.",
        {
          category: "not-found",
          status,
        },
      );
    default:
      return new UnsplashApiError(
        `Unsplash request failed with status ${status}.`,
        {
          category: "unknown",
          status,
        },
      );
  }
}

export function normalizeUnsplashError(error: unknown): UnsplashApiError {
  if (error instanceof UnsplashApiError) {
    return error;
  }

  const errorName =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
      ? error.name
      : null;

  if (errorName === "AbortError" || errorName === "TimeoutError") {
    return new UnsplashApiError("The Unsplash request timed out.", {
      category: "timeout",
      cause: error,
    });
  }

  if (error instanceof TypeError) {
    return new UnsplashApiError("Unable to reach Unsplash.", {
      category: "network",
      cause: error,
    });
  }

  if (error instanceof ZodError) {
    return new UnsplashApiError("Unsplash returned an invalid response.", {
      category: "invalid-response",
      cause: error,
    });
  }

  return new UnsplashApiError("Unexpected Unsplash error.", {
    category: "unknown",
    cause: error,
  });
}
