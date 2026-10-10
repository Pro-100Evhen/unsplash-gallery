"use client";

import GridViewRounded from "@mui/icons-material/GridViewRounded";
import ViewModuleRounded from "@mui/icons-material/ViewModuleRounded";
import { Paper, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
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
    <Paper
      variant="outlined"
      sx={{ display: "inline-flex", borderRadius: 999, p: 0.5 }}
    >
      <ToggleButtonGroup
        value={density}
        exclusive
        onChange={handleChange}
        size="small"
        aria-label="Gallery layout"
        sx={{
          gap: 0.5,
          "& .MuiToggleButton-root": {
            border: 0,
            borderRadius: "999px !important",
            px: 1.25,
          },
        }}
      >
        <Tooltip title="Comfortable view · 3 columns">
          <ToggleButton
            value="comfortable"
            aria-label="Comfortable gallery view"
          >
            <GridViewRounded aria-hidden="true" />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Compact view · 5 columns">
          <ToggleButton value="compact" aria-label="Compact gallery view">
            <ViewModuleRounded aria-hidden="true" />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Paper>
  );
}
