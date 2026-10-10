import { io } from "next/cache";
import { Typography } from "@mui/material";
import { Suspense } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { GallerySkeleton } from "@/components/feedback/GallerySkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import { GalleryView } from "@/features/gallery/GalleryView";
import { searchSchema } from "@/features/search/searchSchema";
import { listPhotos, searchPhotos } from "@/lib/unsplash/client";
import styles from "./page.module.scss";

type HomeSearchParams = Promise<{
  query?: string | string[];
}>;

export async function PhotoFeed({ query = "" }: { query?: string }) {
  await io();

  const photos = query ? await searchPhotos(query) : await listPhotos();
  const { items } = photos;
  const title = query ? `Results for “${query}”` : "Discover Photos";

  if (items.length === 0) {
    return (
      <>
        <Typography component="h1" variant="h2">
          {title}
        </Typography>
        <EmptyState
          title={query ? "No photos found" : "No photos yet"}
          description={
            query
              ? "Try another search term."
              : "Unsplash did not return any photos. Please try again later."
          }
        />
      </>
    );
  }

  return (
    <GalleryView
      key={query || "discover"}
      photos={items}
      title={title}
      query={query}
      initialPage={photos.page}
      totalPages={photos.totalPages}
    />
  );
}

async function SearchAwarePhotoFeed({
  searchParams,
}: {
  searchParams: HomeSearchParams;
}) {
  const { query: rawQuery } = await searchParams;
  const candidate = typeof rawQuery === "string" ? rawQuery.trim() : "";
  const parsedQuery = candidate
    ? searchSchema.safeParse({ query: candidate })
    : null;

  return (
    <PhotoFeed query={parsedQuery?.success ? parsedQuery.data.query : ""} />
  );
}

function PhotoFeedFallback() {
  return (
    <>
      <Typography component="h1" variant="h2">
        Loading photos…
      </Typography>
      <GallerySkeleton />
    </>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: HomeSearchParams;
}) {
  return (
    <main className={styles.main}>
      <PageContainer>
        <Suspense fallback={<PhotoFeedFallback />}>
          <SearchAwarePhotoFeed searchParams={searchParams} />
        </Suspense>
      </PageContainer>
    </main>
  );
}
