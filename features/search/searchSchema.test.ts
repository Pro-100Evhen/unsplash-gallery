import { describe, expect, expectTypeOf, it } from "vitest";
import {
  SEARCH_QUERY_MAX_LENGTH,
  searchSchema,
  type SearchFormValues,
} from "./searchSchema";

describe("searchSchema", () => {
  it.each(["", "   ", "\t\n"])("rejects an empty query: %j", (query) => {
    expect(searchSchema.safeParse({ query }).success).toBe(false);
  });

  it("trims a valid query", () => {
    expect(searchSchema.parse({ query: "  mountain lake  " })).toEqual({
      query: "mountain lake",
    });
  });

  it("accepts the maximum query length", () => {
    const query = "a".repeat(SEARCH_QUERY_MAX_LENGTH);

    expect(searchSchema.parse({ query })).toEqual({ query });
  });

  it("rejects a query above the maximum length", () => {
    const query = "a".repeat(SEARCH_QUERY_MAX_LENGTH + 1);

    expect(searchSchema.safeParse({ query }).success).toBe(false);
  });

  it("infers the form value type from the schema", () => {
    expectTypeOf<SearchFormValues>().toEqualTypeOf<{ query: string }>();
  });
});
