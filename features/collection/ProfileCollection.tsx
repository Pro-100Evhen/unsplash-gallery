"use client";

import { Button, Typography } from "@mui/material";
import { EmptyState } from "@/components/feedback/EmptyState";
import { GalleryView } from "@/features/gallery/GalleryView";
import { useAppSelector } from "@/store/hooks";
import { ProfileIdentity } from "@/features/auth/ProfileIdentity";
import { selectSavedPhotos } from "./collectionSlice";

export function ProfileCollection() {
  const photos = useAppSelector(selectSavedPhotos);

  if (photos.length === 0) {
    return (
      <>
        <Typography component="h1" variant="h2" sx={{ mb: { xs: 3, md: 4 } }}>
          My collection
        </Typography>
        <ProfileIdentity />
        <EmptyState
          title="Your collection is empty"
          description="Save photos from the gallery to find them here."
          action={
            <Button href="/" variant="contained">
              Explore photos
            </Button>
          }
        />
      </>
    );
  }

  return (
    <GalleryView photos={photos} title="My collection">
      <ProfileIdentity />
    </GalleryView>
  );
}
