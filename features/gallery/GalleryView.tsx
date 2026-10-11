"use client";

import { Stack, Typography } from "@mui/material";
import type { GalleryPhoto } from "@/domain/photo/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Gallery } from "./Gallery";
import { GalleryControls } from "./GalleryControls";
import { GalleryPagination } from "./GalleryPagination";
import { selectDensity, setDensity } from "./preferencesSlice";

type GalleryViewProps = Readonly<{
  photos: GalleryPhoto[];
  title?: string;
  page?: number;
  totalPages?: number | null;
}>;

export function GalleryView({
  photos,
  title = "Discover Photos",
  page = 1,
  totalPages = null,
}: GalleryViewProps) {
  const dispatch = useAppDispatch();
  const density = useAppSelector(selectDensity);

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
        <GalleryControls
          density={density}
          onDensityChange={(nextDensity) => dispatch(setDensity(nextDensity))}
        />
      </Stack>
      <Gallery photos={photos} density={density} />
      {totalPages !== null && totalPages > 1 ? (
        <GalleryPagination page={page} totalPages={totalPages} />
      ) : null}
    </>
  );
}
