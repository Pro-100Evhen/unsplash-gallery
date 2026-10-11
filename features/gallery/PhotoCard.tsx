"use client";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Link as MuiLink,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GalleryPhoto } from "@/domain/photo/types";
import { SavePhotoButton } from "@/features/collection/SavePhotoButton";
import { getUnsplashAttributionUrl } from "@/lib/unsplash/attribution";
import type { GalleryDensity } from "./types";
import styles from "./PhotoCard.module.scss";

type PhotoCardProps = Readonly<{
  photo: GalleryPhoto;
  density: GalleryDensity;
  eager?: boolean;
}>;

const imageSizes: Record<GalleryDensity, string> = {
  comfortable: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  compact: "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw",
};

export function PhotoCard({ photo, density, eager = false }: PhotoCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const detailsUrl = `/photos/${encodeURIComponent(photo.id)}`;

  return (
    <Card component="article" elevation={0} className={styles.card}>
      <Box className={styles.saveControl}>
        <SavePhotoButton photo={photo} />
      </Box>
      <CardActionArea
        component={Link}
        className={styles.imageLink}
        href={detailsUrl}
        aria-label={`View ${photo.altDescription}`}
        aria-busy={!isImageLoaded}
      >
        {!isImageLoaded ? (
          <Skeleton
            className={styles.imageSkeleton}
            variant="rectangular"
            animation="wave"
            data-testid="photo-loading-skeleton"
            aria-hidden="true"
          />
        ) : null}
        <Image
          className={`${styles.image} ${isImageLoaded ? styles.imageLoaded : ""}`}
          src={photo.urls.regular}
          alt={photo.altDescription}
          width={photo.width}
          height={photo.height}
          loading={eager ? "eager" : "lazy"}
          sizes={imageSizes[density]}
          style={{ backgroundColor: photo.color ?? undefined }}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
        />
      </CardActionArea>

      <Box className={styles.attribution}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", gap: 1, minWidth: 0 }}
        >
          <Avatar
            className={styles.avatar}
            src={photo.author.profileImageUrl}
            alt=""
            aria-hidden="true"
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" component="div" noWrap>
              <MuiLink
                className={styles.attributionLink}
                href={getUnsplashAttributionUrl(photo.author.profileUrl)}
                target="_blank"
                rel="noreferrer"
                underline="hover"
              >
                {photo.author.name}
              </MuiLink>
            </Typography>
            <Typography variant="caption" component="div">
              on{" "}
              <MuiLink
                className={styles.attributionLink}
                href={getUnsplashAttributionUrl(photo.unsplashUrl)}
                target="_blank"
                rel="noreferrer"
                underline="hover"
              >
                Unsplash
              </MuiLink>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}
