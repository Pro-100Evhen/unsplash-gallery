import { Typography } from "@mui/material";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { GalleryLoadingState } from "@/components/feedback/GalleryLoadingState";
import { PageContainer } from "@/components/layout/PageContainer";
import { GalleryView } from "@/features/gallery/GalleryView";
import { shouldRedirectPageParam } from "@/features/gallery/pagination";
import {
  parseTagParams,
  type TagParamsResult,
} from "@/features/tags/tagParams";
import { searchPhotos } from "@/lib/unsplash/client";
import styles from "../../page.module.scss";

type TagRouteProps = Readonly<{
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}>;

type ValidTagParams = Extract<TagParamsResult, { valid: true }>;

function getTagPath(label: string, page?: number): string {
  const path = `/tags/${encodeURIComponent(label)}`;

  return page && page > 1 ? `${path}?page=${page}` : path;
}

export async function TagResults({ parsed }: { parsed: ValidTagParams }) {
  const photos = await searchPhotos(parsed.query, parsed.page, parsed.perPage);
  const title = `Photos tagged “${parsed.label}”`;

  if (
    photos.totalPages !== null &&
    photos.totalPages > 0 &&
    parsed.page > photos.totalPages
  ) {
    redirect(getTagPath(parsed.label, photos.totalPages));
  }

  if (photos.items.length === 0) {
    return (
      <>
        <Typography component="h1" variant="h2">
          {title}
        </Typography>
        <EmptyState
          title="No photos found for this tag"
          description="Try another tag or return to the gallery."
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

async function TagContent({ params, searchParams }: TagRouteProps) {
  const [{ tag }, queryParams] = await Promise.all([params, searchParams]);
  const parsed = parseTagParams({ tag, page: queryParams.page });

  if (!parsed.valid) {
    notFound();
  }

  if (shouldRedirectPageParam(queryParams.page)) {
    redirect(getTagPath(parsed.label, parsed.page));
  }

  return <TagResults parsed={parsed} />;
}

function TagFallback() {
  return <GalleryLoadingState title="Loading tagged photos…" />;
}

export default function TagPage(props: TagRouteProps) {
  return (
    <main className={styles.main}>
      <PageContainer>
        <Suspense fallback={<TagFallback />}>
          <TagContent {...props} />
        </Suspense>
      </PageContainer>
    </main>
  );
}
