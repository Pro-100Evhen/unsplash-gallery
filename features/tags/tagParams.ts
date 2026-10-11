import {
  GALLERY_PER_PAGE,
  type RawPageParam,
} from "@/features/gallery/pagination";
import { parseSearchParams } from "@/features/search/searchParams";

export type TagParamsResult =
  | {
      valid: true;
      query: string;
      label: string;
      page: number;
      perPage: typeof GALLERY_PER_PAGE;
    }
  | {
      valid: false;
      reason: "empty-tag" | "invalid-tag";
      page: 1;
      perPage: typeof GALLERY_PER_PAGE;
    };

export function parseTagParams(params: {
  tag: string;
  page?: RawPageParam;
}): TagParamsResult {
  let decodedTag: string;

  try {
    decodedTag = decodeURIComponent(params.tag);
  } catch {
    return {
      valid: false,
      reason: "invalid-tag",
      page: 1,
      perPage: GALLERY_PER_PAGE,
    };
  }

  const parsedSearch = parseSearchParams({
    query: decodedTag,
    page: params.page,
  });

  if (!parsedSearch.valid) {
    return {
      valid: false,
      reason:
        parsedSearch.reason === "empty-query" ? "empty-tag" : "invalid-tag",
      page: 1,
      perPage: GALLERY_PER_PAGE,
    };
  }

  return {
    valid: true,
    query: parsedSearch.query,
    label: decodedTag.trim(),
    page: parsedSearch.page,
    perPage: parsedSearch.perPage,
  };
}
