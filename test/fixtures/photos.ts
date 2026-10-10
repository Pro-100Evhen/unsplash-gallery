import type { GalleryPhoto, PhotoDetails } from "@/domain/photo/types";

export const galleryPhotoFixture: GalleryPhoto = {
  id: "photo-one",
  width: 2400,
  height: 1600,
  color: "#aabbcc",
  altDescription: "A lake surrounded by mountains",
  urls: { regular: "https://images.unsplash.com/regular" },
  unsplashUrl: "https://unsplash.com/photos/photo-one",
  author: {
    name: "Ada Example",
    profileImageUrl: "https://images.unsplash.com/profile",
    profileUrl: "https://unsplash.com/@ada",
  },
};

export const photoDetailsFixture: PhotoDetails = {
  ...galleryPhotoFixture,
  createdAt: "2026-01-10T12:00:00Z",
  blurHash: null,
  description: "Mountain lake",
  likes: 42,
  urls: {
    raw: "https://images.unsplash.com/raw",
    full: "https://images.unsplash.com/full",
    regular: galleryPhotoFixture.urls.regular,
    small: "https://images.unsplash.com/small",
    thumb: "https://images.unsplash.com/thumb",
  },
  author: {
    id: "user-one",
    username: "ada",
    ...galleryPhotoFixture.author,
  },
  tags: [{ title: "mountain" }, { title: "lake" }],
  location: { name: "Lake Louise", city: null, country: "Canada" },
};
