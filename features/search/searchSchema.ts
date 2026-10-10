import { z } from "zod";

export const SEARCH_QUERY_MAX_LENGTH = 100;

export const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Enter a search term.")
    .max(
      SEARCH_QUERY_MAX_LENGTH,
      `Search terms must be ${SEARCH_QUERY_MAX_LENGTH} characters or fewer.`,
    ),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
