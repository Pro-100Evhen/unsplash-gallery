import type { PhotoSummary } from "@/lib/unsplash/types";
import { PhotoCard } from "./PhotoCard";
import type { GalleryDensity } from "./types";
import styles from "./Gallery.module.scss";

type GalleryProps = Readonly<{
  photos: PhotoSummary[];
  density: GalleryDensity;
}>;

const densityClassNames: Record<GalleryDensity, string> = {
  comfortable: styles.comfortable,
  compact: styles.compact,
};

export function Gallery({ photos, density }: GalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.gallery} ${densityClassNames[density]}`}
      role="list"
      aria-label="Photo gallery"
    >
      {photos.map((photo) => (
        <div className={styles.item} role="listitem" key={photo.id}>
          <PhotoCard photo={photo} density={density} />
        </div>
      ))}
    </div>
  );
}
