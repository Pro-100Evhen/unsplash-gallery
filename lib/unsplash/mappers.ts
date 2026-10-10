import type {
  GalleryPhoto,
  PhotoDetails,
  PhotoLocation,
  PhotoSummary,
  PhotoTag,
} from "@/domain/photo/types";
import type { UnsplashApiPhoto, UnsplashApiUser } from "./types";

function normalizeText(value: string | null | undefined): string | null {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

function getAltDescription(photo: UnsplashApiPhoto): string {
  return (
    normalizeText(photo.alt_description) ??
    normalizeText(photo.description) ??
    `Photo by ${photo.user.name}`
  );
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
  return {
    id: photo.id,
    createdAt: photo.created_at,
    width: photo.width,
    height: photo.height,
    color: photo.color,
    blurHash: photo.blur_hash,
    altDescription: getAltDescription(photo),
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

export function mapGalleryPhoto(photo: UnsplashApiPhoto): GalleryPhoto {
  return {
    id: photo.id,
    width: photo.width,
    height: photo.height,
    color: photo.color,
    altDescription: getAltDescription(photo),
    urls: { regular: photo.urls.regular },
    unsplashUrl: photo.links.html,
    author: {
      name: photo.user.name,
      profileImageUrl: photo.user.profile_image.medium,
      profileUrl: photo.user.links.html,
    },
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
