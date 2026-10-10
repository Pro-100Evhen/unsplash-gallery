import { z } from "zod";
import { SEARCH_QUERY_MAX_LENGTH } from "@/features/search/searchSchema";
import { listPhotos, searchPhotos } from "@/lib/unsplash/client";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(2).max(1_000),
  query: z.string().trim().max(SEARCH_QUERY_MAX_LENGTH).optional(),
});

const invalidPaginationResponse = {
  error: {
    code: "INVALID_PAGINATION",
    message: "Invalid photo pagination parameters.",
  },
};

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const parsedParams = paginationSchema.safeParse({
    page: url.searchParams.get("page"),
    query: url.searchParams.get("query") ?? undefined,
  });

  if (!parsedParams.success) {
    return Response.json(invalidPaginationResponse, { status: 400 });
  }

  const { page, query } = parsedParams.data;

  try {
    const photos = query
      ? await searchPhotos(query, page)
      : await listPhotos(page);

    return Response.json(photos);
  } catch {
    return Response.json(
      {
        error: {
          code: "PHOTO_FETCH_FAILED",
          message: "Unable to load more photos.",
        },
      },
      { status: 502 },
    );
  }
}
