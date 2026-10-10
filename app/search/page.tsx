import { Typography } from "@mui/material";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/feedback/EmptyState";
import { GalleryLoadingState } from "@/components/feedback/GalleryLoadingState";
import { PageContainer } from "@/components/layout/PageContainer";
import { GalleryView } from "@/features/gallery/GalleryView";
import { shouldRedirectPageParam } from "@/features/gallery/pagination";
import {
  parseSearchParams,
  type SearchParamsResult,
} from "@/features/search/searchParams";
import { searchPhotos } from "@/lib/unsplash/client";
import styles from "../page.module.scss";

type SearchPageParams = Promise<{
  query?: string | string[];
  page?: string | string[];
}>;

function InvalidSearchState({
  reason,
}: {
  reason: "empty-query" | "invalid-query";
}) {
  return (
    <>
      <Typography component="h1" variant="h2">
        Search Photos
      </Typography>
      <EmptyState
        title={
          reason === "empty-query" ? "Start with a search" : "Invalid search"
        }
        description={
          reason === "empty-query"
            ? "Enter a subject in the search field to discover photos."
            : "Use a search term between 1 and 100 characters."
        }
      />
    </>
  );
}

export async function SearchResults({
  parsed,
}: {
  parsed: SearchParamsResult;
}) {
  if (!parsed.valid) {
    return <InvalidSearchState reason={parsed.reason} />;
  }

  const photos = await searchPhotos(parsed.query, parsed.page, parsed.perPage);
  const title = `Results for “${parsed.query}”`;

  if (
    photos.totalPages !== null &&
    photos.totalPages > 0 &&
    parsed.page > photos.totalPages
  ) {
    const params = new URLSearchParams({
      query: parsed.query,
      page: String(photos.totalPages),
    });
    redirect(`/search?${params.toString()}`);
  }

  if (photos.items.length === 0) {
    return (
      <>
        <Typography component="h1" variant="h2">
          {title}
        </Typography>
        <EmptyState
          title="No photos found"
          description="Try another search term."
        />
      </>
    );
  }

  return (
    <GalleryView
      photos={photos.items}
      title={title}
      page={photos.page}
      totalPages={photos.totalPages}
    />
  );
}

async function SearchContent({
  searchParams,
}: {
  searchParams: SearchPageParams;
}) {
  const params = await searchParams;
  const parsed = parseSearchParams(params);

  if (parsed.valid && shouldRedirectPageParam(params.page)) {
    const canonicalParams = new URLSearchParams({ query: parsed.query });

    if (parsed.page > 1) {
      canonicalParams.set("page", String(parsed.page));
    }

    redirect(`/search?${canonicalParams.toString()}`);
  }

  return <SearchResults parsed={parsed} />;
}

function SearchFallback() {
  return <GalleryLoadingState title="Searching photos…" />;
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchPageParams;
}) {
  return (
    <main className={styles.main}>
      <PageContainer>
        <Suspense fallback={<SearchFallback />}>
          <SearchContent searchParams={searchParams} />
        </Suspense>
      </PageContainer>
    </main>
  );
}
