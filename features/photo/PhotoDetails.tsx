import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import {
  Avatar,
  Box,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { PhotoDetails as PhotoDetailsDto } from "@/domain/photo/types";
import styles from "./PhotoDetails.module.scss";

const ATTRIBUTION_PARAMS = {
  utm_source: "arounda_photo_gallery",
  utm_medium: "referral",
};

const photoDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function getAttributionUrl(url: string): string {
  const attributionUrl = new URL(url);

  Object.entries(ATTRIBUTION_PARAMS).forEach(([name, value]) => {
    attributionUrl.searchParams.set(name, value);
  });

  return attributionUrl.toString();
}

function getLocationLabel(photo: PhotoDetailsDto): string | null {
  if (!photo.location) {
    return null;
  }

  const parts = [
    photo.location.name,
    photo.location.city,
    photo.location.country,
  ].filter((part): part is string => Boolean(part));

  return [...new Set(parts)].join(", ") || null;
}

type PhotoDetailsProps = Readonly<{
  photo: PhotoDetailsDto;
}>;

export function PhotoDetails({ photo }: PhotoDetailsProps) {
  const locationLabel = getLocationLabel(photo);
  const formattedDate = photoDateFormatter.format(new Date(photo.createdAt));

  return (
    <article className={styles.details}>
      <Box className={styles.imageFrame}>
        <Image
          className={styles.image}
          src={photo.urls.regular}
          alt={photo.altDescription}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 767px) 100vw, (max-width: 1439px) calc(100vw - 64px), 1376px"
          priority
          style={{ backgroundColor: photo.color ?? undefined }}
        />
      </Box>

      <div className={styles.content}>
        <Stack
          className={styles.author}
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center" }}
        >
          <Avatar
            src={photo.author.profileImageUrl}
            alt=""
            aria-hidden="true"
          />
          <div>
            <Typography component="h1" variant="h5">
              Photo by {photo.author.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <MuiLink
                href={getAttributionUrl(photo.author.profileUrl)}
                target="_blank"
                rel="noreferrer"
                underline="hover"
              >
                {photo.author.name}
              </MuiLink>{" "}
              on{" "}
              <MuiLink
                href={getAttributionUrl(photo.unsplashUrl)}
                target="_blank"
                rel="noreferrer"
                underline="hover"
              >
                Unsplash
              </MuiLink>
            </Typography>
          </div>
        </Stack>

        {photo.description ? (
          <Typography className={styles.description} variant="body1">
            {photo.description}
          </Typography>
        ) : null}

        <Stack
          component="dl"
          className={styles.metadata}
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
        >
          <Box component="div" className={styles.metadataItem}>
            <FavoriteBorderOutlinedIcon aria-hidden="true" fontSize="small" />
            <Typography component="dt" className={styles.visuallyHidden}>
              Likes
            </Typography>
            <Typography component="dd" variant="body2">
              {photo.likes.toLocaleString("en-US")} likes
            </Typography>
          </Box>
          <Box component="div" className={styles.metadataItem}>
            <CalendarMonthOutlinedIcon aria-hidden="true" fontSize="small" />
            <Typography component="dt" className={styles.visuallyHidden}>
              Published
            </Typography>
            <Typography component="dd" variant="body2">
              <time dateTime={photo.createdAt}>{formattedDate}</time>
            </Typography>
          </Box>
          {locationLabel ? (
            <Box
              component="div"
              className={styles.metadataItem}
              data-testid="photo-location"
            >
              <PlaceOutlinedIcon aria-hidden="true" fontSize="small" />
              <Typography component="dt" className={styles.visuallyHidden}>
                Location
              </Typography>
              <Typography component="dd" variant="body2">
                {locationLabel}
              </Typography>
            </Box>
          ) : null}
        </Stack>

        {photo.tags.length > 0 ? (
          <section className={styles.tags} aria-labelledby="photo-tags-title">
            <Typography id="photo-tags-title" component="h2" variant="h6">
              Tags
            </Typography>
            <div className={styles.tagList}>
              {photo.tags.map((tag) => (
                <Link
                  className={styles.tagLink}
                  href={`/tags/${encodeURIComponent(tag.title)}`}
                  key={tag.title}
                >
                  <Chip component="span" label={tag.title} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
