import { Typography } from "@mui/material";
import { io } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { GalleryLoadingState } from "@/components/feedback/GalleryLoadingState";
import { PageContainer } from "@/components/layout/PageContainer";
import { GalleryView } from "@/features/gallery/GalleryView";
import {
  GALLERY_PER_PAGE,
  parsePageParam,
  shouldRedirectPageParam,
} from "@/features/gallery/pagination";
import { listPhotos } from "@/lib/unsplash/client";
import styles from "./page.module.scss";

type HomeSearchParams = Promise<{ page?: string | string[] }>;

export async function PhotoFeed({ page = 1 }: { page?: number }) {
  await io();
  const photos = await listPhotos(page, GALLERY_PER_PAGE);

  if (
    photos.totalPages !== null &&
    photos.totalPages > 0 &&
    page > photos.totalPages
  ) {
    redirect(`/?page=${photos.totalPages}`);
  }

  if (photos.items.length === 0) {
    return (
      <>
        <Typography component="h1" variant="h2">
          Discover Photos
        </Typography>
        <EmptyState
          title="No photos yet"
          description="Unsplash did not return any photos. Please try again later."
        />
      </>
    );
  }

  return (
    <GalleryView
      photos={photos.items}
      title="Discover Photos"
      page={photos.page}
      totalPages={photos.totalPages}
    />
  );
}

async function PaginatedPhotoFeed({
  searchParams,
}: {
  searchParams: HomeSearchParams;
}) {
  const { page } = await searchParams;
  const parsedPage = parsePageParam(page);

  if (shouldRedirectPageParam(page)) {
    redirect(parsedPage === 1 ? "/" : `/?page=${parsedPage}`);
  }

  return <PhotoFeed page={parsedPage} />;
}

function PhotoFeedFallback() {
  return <GalleryLoadingState title="Loading photos…" />;
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
          <PaginatedPhotoFeed searchParams={searchParams} />
        </Suspense>
      </PageContainer>
    </main>
  );
}
