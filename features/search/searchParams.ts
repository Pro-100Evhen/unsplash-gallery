import {
  GALLERY_PER_PAGE,
  parsePageParam,
  type RawPageParam,
} from "@/features/gallery/pagination";
import { searchSchema } from "./searchSchema";

type RawQueryParam = string | readonly string[] | undefined;

export type SearchParamsResult =
  | {
      valid: true;
      query: string;
      page: number;
      perPage: typeof GALLERY_PER_PAGE;
    }
  | {
      valid: false;
      reason: "empty-query" | "invalid-query";
      page: 1;
      perPage: typeof GALLERY_PER_PAGE;
    };

export function parseSearchParams(params: {
  query?: RawQueryParam;
  page?: RawPageParam;
}): SearchParamsResult {
  if (params.query === undefined || params.query === "") {
    return {
      valid: false,
      reason: "empty-query",
      page: 1,
      perPage: GALLERY_PER_PAGE,
    };
  }

  if (typeof params.query !== "string") {
    return {
      valid: false,
      reason: "invalid-query",
      page: 1,
      perPage: GALLERY_PER_PAGE,
    };
  }

  const parsedQuery = searchSchema.safeParse({ query: params.query });

  if (!parsedQuery.success) {
    return {
      valid: false,
      reason: params.query.trim() ? "invalid-query" : "empty-query",
      page: 1,
      perPage: GALLERY_PER_PAGE,
    };
  }

  return {
    valid: true,
    query: parsedQuery.data.query,
    page: parsePageParam(params.page),
    perPage: GALLERY_PER_PAGE,
  };
}
