"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { GalleryDensity } from "./types";

type GalleryControlsProps = Readonly<{
  density: GalleryDensity;
  onDensityChange: (density: GalleryDensity) => void;
}>;

export function GalleryControls({
  density,
  onDensityChange,
}: GalleryControlsProps) {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextDensity: GalleryDensity | null,
  ) => {
    if (nextDensity !== null) {
      onDensityChange(nextDensity);
    }
  };

  return (
    <ToggleButtonGroup
      value={density}
      exclusive
      onChange={handleChange}
      size="small"
      aria-label="Gallery layout"
    >
      <ToggleButton value="comfortable" aria-label="Comfortable gallery view">
        3 columns
      </ToggleButton>
      <ToggleButton value="compact" aria-label="Compact gallery view">
        5 columns
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
