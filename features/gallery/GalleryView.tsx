"use client";

import { Alert, Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PaginatedPhotos, PhotoSummary } from "@/lib/unsplash/types";
import { Gallery } from "./Gallery";
import { GalleryControls } from "./GalleryControls";
import styles from "./GalleryView.module.scss";
import type { GalleryDensity } from "./types";

type GalleryViewProps = Readonly<{
  photos: PhotoSummary[];
  title?: string;
  query?: string;
  initialPage?: number;
  totalPages?: number | null;
}>;

export const LOAD_MORE_THROTTLE_MS = 800;

function LoadMoreSkeleton() {
  return (
    <Box
      className={styles.loadMore}
      role="status"
      aria-label="Loading more photos"
      aria-live="polite"
    >
      <div className={styles.skeletonGrid} aria-hidden="true">
        {[220, 280, 200].map((height) => (
          <Skeleton
            key={height}
            variant="rounded"
            animation="wave"
            height={height}
          />
        ))}
      </div>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center" }}
      >
        Loading more photos…
      </Typography>
    </Box>
  );
}

export function GalleryView({
  photos,
  title = "Discover Photos",
  query = "",
  initialPage = 1,
  totalPages = null,
}: GalleryViewProps) {
  const [density, setDensity] = useState<GalleryDensity>("comfortable");
  const [loadedPhotos, setLoadedPhotos] = useState(photos);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(
    totalPages === null || initialPage < totalPages,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const lastLoadAtRef = useRef(0);
  const throttleTimeoutRef = useRef<number | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);

  const loadNextPage = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) {
      return;
    }

    isLoadingRef.current = true;
    lastLoadAtRef.current = Date.now();
    setIsLoadingMore(true);
    setLoadError(null);

    const nextPage = currentPage + 1;
    const searchParams = new URLSearchParams({ page: String(nextPage) });

    if (query) {
      searchParams.set("query", query);
    }

    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const response = await fetch(`/api/photos?${searchParams.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Photo pagination request failed.");
      }

      const nextPhotos = (await response.json()) as PaginatedPhotos;

      setLoadedPhotos((currentPhotos) => {
        const knownIds = new Set(currentPhotos.map((photo) => photo.id));
        const uniquePhotos = nextPhotos.items.filter(
          (photo) => !knownIds.has(photo.id),
        );

        return [...currentPhotos, ...uniquePhotos];
      });
      setCurrentPage(nextPhotos.page);
      setHasMore(
        nextPhotos.totalPages === null
          ? nextPhotos.items.length > 0
          : nextPhotos.page < nextPhotos.totalPages,
      );
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setLoadError("Could not load more photos. Please try again.");
      }
    } finally {
      if (!controller.signal.aborted) {
        isLoadingRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [currentPage, hasMore, query]);

  const scheduleNextPage = useCallback(() => {
    if (
      isLoadingRef.current ||
      throttleTimeoutRef.current !== null ||
      !hasMore ||
      loadError
    ) {
      return;
    }

    const elapsed = Date.now() - lastLoadAtRef.current;
    const delay = Math.max(0, LOAD_MORE_THROTTLE_MS - elapsed);

    if (delay === 0) {
      void loadNextPage();
      return;
    }

    throttleTimeoutRef.current = window.setTimeout(() => {
      throttleTimeoutRef.current = null;
      void loadNextPage();
    }, delay);
  }, [hasMore, loadError, loadNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel ||
      !hasMore ||
      loadError ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scheduleNextPage();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadError, scheduleNextPage]);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();

      if (throttleTimeoutRef.current !== null) {
        window.clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, []);

  const retryLoading = () => {
    setLoadError(null);
    lastLoadAtRef.current = 0;
    void loadNextPage();
  };

  return (
    <>
      <Stack
        component="header"
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2.75rem", md: "3.5rem" },
            lineHeight: 1,
            textWrap: "balance",
          }}
        >
          {title}
        </Typography>
        <GalleryControls density={density} onDensityChange={setDensity} />
      </Stack>
      <Gallery photos={loadedPhotos} density={density} />
      {isLoadingMore ? <LoadMoreSkeleton /> : null}
      {loadError ? (
        <Alert
          className={styles.loadError}
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={retryLoading}>
              Retry
            </Button>
          }
        >
          {loadError}
        </Alert>
      ) : null}
      {hasMore ? (
        <div
          ref={sentinelRef}
          className={styles.sentinel}
          data-testid="infinite-scroll-sentinel"
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
