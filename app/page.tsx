import { io } from "next/cache";
import { Suspense } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { GallerySkeleton } from "@/components/feedback/GallerySkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import { Gallery } from "@/features/gallery/Gallery";
import { listPhotos } from "@/lib/unsplash/client";
import styles from "./page.module.scss";

export async function PhotoFeed() {
  await io();

  const { items } = await listPhotos();

  if (items.length === 0) {
    return (
      <EmptyState
        title="No photos yet"
        description="Unsplash did not return any photos. Please try again later."
      />
    );
  }

  return <Gallery photos={items} />;
}

export default function Home() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <h1 className={styles.heading}>Discover photos</h1>
        <Suspense fallback={<GallerySkeleton />}>
          <PhotoFeed />
        </Suspense>
      </PageContainer>
    </main>
  );
}
