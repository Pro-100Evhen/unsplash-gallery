import type { PhotoSummary } from "@/lib/unsplash/types";
import { PhotoCard } from "./PhotoCard";
import styles from "./Gallery.module.scss";

type GalleryProps = Readonly<{
  photos: PhotoSummary[];
}>;

export function Gallery({ photos }: GalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery} role="list" aria-label="Photo gallery">
      {photos.map((photo) => (
        <div className={styles.item} role="listitem" key={photo.id}>
          <PhotoCard photo={photo} />
        </div>
      ))}
    </div>
  );
}
