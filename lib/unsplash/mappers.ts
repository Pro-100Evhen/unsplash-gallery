import type {
  PhotoDetails,
  PhotoLocation,
  PhotoSummary,
  PhotoTag,
  UnsplashApiPhoto,
  UnsplashApiUser,
} from "./types";

function normalizeText(value: string | null | undefined): string | null {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

function mapAuthor(user: UnsplashApiUser): PhotoSummary["author"] {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    profileImageUrl: user.profile_image.medium,
    profileUrl: user.links.html,
  };
}

function mapTags(photo: UnsplashApiPhoto): PhotoTag[] {
  return (photo.tags ?? []).flatMap((tag) => {
    const title = normalizeText(tag.title);

    return title ? [{ title }] : [];
  });
}

function mapLocation(photo: UnsplashApiPhoto): PhotoLocation | null {
  if (!photo.location) {
    return null;
  }

  return {
    name: normalizeText(photo.location.name),
    city: normalizeText(photo.location.city),
    country: normalizeText(photo.location.country),
  };
}

export function mapPhotoSummary(photo: UnsplashApiPhoto): PhotoSummary {
  const description = normalizeText(photo.description);
  const altDescription =
    normalizeText(photo.alt_description) ??
    description ??
    `Photo by ${photo.user.name}`;

  return {
    id: photo.id,
    createdAt: photo.created_at,
    width: photo.width,
    height: photo.height,
    color: photo.color,
    blurHash: photo.blur_hash,
    altDescription,
    urls: {
      raw: photo.urls.raw,
      full: photo.urls.full,
      regular: photo.urls.regular,
      small: photo.urls.small,
      thumb: photo.urls.thumb,
    },
    unsplashUrl: photo.links.html,
    author: mapAuthor(photo.user),
  };
}

export function mapPhotoDetails(photo: UnsplashApiPhoto): PhotoDetails {
  return {
    ...mapPhotoSummary(photo),
    description:
      normalizeText(photo.description) ?? normalizeText(photo.alt_description),
    likes: photo.likes,
    tags: mapTags(photo),
    location: mapLocation(photo),
  };
}
