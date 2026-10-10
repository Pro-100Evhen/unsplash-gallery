import { Typography } from "@mui/material";
import { GallerySkeleton } from "./GallerySkeleton";

type GalleryLoadingStateProps = Readonly<{
  title: string;
}>;

export function GalleryLoadingState({ title }: GalleryLoadingStateProps) {
  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        sx={{ mb: 4, fontSize: { xs: "2rem", md: "3.5rem" } }}
      >
        {title}
      </Typography>
      <GallerySkeleton />
    </>
  );
}
