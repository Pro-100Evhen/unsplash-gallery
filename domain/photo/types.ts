export interface PhotoUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface PhotoAuthor {
  id: string;
  username: string;
  name: string;
  profileImageUrl: string;
  profileUrl: string;
}

export interface GalleryPhoto {
  id: string;
  width: number;
  height: number;
  color: string | null;
  altDescription: string;
  urls: Pick<PhotoUrls, "regular">;
  unsplashUrl: string;
  author: Pick<PhotoAuthor, "name" | "profileImageUrl" | "profileUrl">;
}

export interface PhotoTag {
  title: string;
}

export interface PhotoLocation {
  name: string | null;
  city: string | null;
  country: string | null;
}

export interface PhotoSummary {
  id: string;
  createdAt: string;
  width: number;
  height: number;
  color: string | null;
  blurHash: string | null;
  altDescription: string;
  urls: PhotoUrls;
  unsplashUrl: string;
  author: PhotoAuthor;
}

export interface PhotoDetails extends PhotoSummary {
  description: string | null;
  likes: number;
  tags: PhotoTag[];
  location: PhotoLocation | null;
}

export interface PaginatedPhotos {
  items: GalleryPhoto[];
  page: number;
  perPage: number;
  total: number | null;
  totalPages: number | null;
}
