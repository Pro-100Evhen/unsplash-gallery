import Image from "next/image";
import Link from "next/link";
import type { PhotoSummary } from "@/lib/unsplash/types";
import type { GalleryDensity } from "./types";
import styles from "./PhotoCard.module.scss";

const ATTRIBUTION_PARAMS = {
  utm_source: "arounda_photo_gallery",
  utm_medium: "referral",
};

function getAttributionUrl(url: string): string {
  const attributionUrl = new URL(url);

  Object.entries(ATTRIBUTION_PARAMS).forEach(([name, value]) => {
    attributionUrl.searchParams.set(name, value);
  });

  return attributionUrl.toString();
}

type PhotoCardProps = Readonly<{
  photo: PhotoSummary;
  density: GalleryDensity;
}>;

const imageSizes: Record<GalleryDensity, string> = {
  comfortable: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  compact: "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw",
};

export function PhotoCard({ photo, density }: PhotoCardProps) {
  const detailsUrl = `/photos/${encodeURIComponent(photo.id)}`;

  return (
    <article className={styles.card}>
      <Link
        className={styles.imageLink}
        href={detailsUrl}
        aria-label={`View ${photo.altDescription}`}
      >
        <Image
          className={styles.image}
          src={photo.urls.regular}
          alt={photo.altDescription}
          width={photo.width}
          height={photo.height}
          sizes={imageSizes[density]}
          style={{ backgroundColor: photo.color ?? undefined }}
        />
      </Link>

      <p className={styles.attribution}>
        Photo by{" "}
        <a
          href={getAttributionUrl(photo.author.profileUrl)}
          target="_blank"
          rel="noreferrer"
        >
          {photo.author.name}
        </a>{" "}
        on{" "}
        <a
          href={getAttributionUrl(photo.unsplashUrl)}
          target="_blank"
          rel="noreferrer"
        >
          Unsplash
        </a>
      </p>
    </article>
  );
}
