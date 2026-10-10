"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import type { PhotoSummary } from "@/lib/unsplash/types";
import { Gallery } from "./Gallery";
import { GalleryControls } from "./GalleryControls";
import type { GalleryDensity } from "./types";

type GalleryViewProps = Readonly<{
  photos: PhotoSummary[];
}>;

export function GalleryView({ photos }: GalleryViewProps) {
  const [density, setDensity] = useState<GalleryDensity>("comfortable");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <GalleryControls density={density} onDensityChange={setDensity} />
      </Box>
      <Gallery photos={photos} density={density} />
    </>
  );
}
