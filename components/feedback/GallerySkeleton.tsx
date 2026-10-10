import { Skeleton } from "@mui/material";
import styles from "./GallerySkeleton.module.scss";

const SKELETON_HEIGHTS = [320, 220, 380, 280, 360, 240];

export function GallerySkeleton() {
  return (
    <div
      className={styles.gallery}
      role="status"
      aria-label="Loading photos"
      aria-busy="true"
    >
      {SKELETON_HEIGHTS.map((height, index) => (
        <div className={styles.item} key={`${height}-${index}`}>
          <Skeleton
            variant="rounded"
            animation="wave"
            height={height}
            sx={{ transform: "none" }}
          />
        </div>
      ))}
    </div>
  );
}
