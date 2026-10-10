import type { GalleryPhoto } from "@/domain/photo/types";
import { PhotoCard } from "./PhotoCard";
import type { GalleryDensity } from "./types";
import styles from "./Gallery.module.scss";

type GalleryProps = Readonly<{
  photos: GalleryPhoto[];
  density: GalleryDensity;
}>;

const densityClassNames: Record<GalleryDensity, string> = {
  comfortable: styles.comfortable,
  compact: styles.compact,
};

const EAGER_IMAGE_COUNT = 5;

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
      {photos.map((photo, index) => (
        <div className={styles.item} role="listitem" key={photo.id}>
          <PhotoCard
            photo={photo}
            density={density}
            eager={index < EAGER_IMAGE_COUNT}
          />
        </div>
      ))}
    </div>
  );
}
