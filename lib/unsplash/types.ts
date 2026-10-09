export interface UnsplashApiPhotoUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface UnsplashApiUser {
  id: string;
  username: string;
  name: string;
  profile_image: {
    small: string;
    medium: string;
    large: string;
  };
  links: {
    html: string;
  };
}

export interface UnsplashApiTag {
  title: string;
}

export interface UnsplashApiLocation {
  name: string | null;
  city: string | null;
  country: string | null;
  position: {
    latitude: number | null;
    longitude: number | null;
  };
}

export interface UnsplashApiPhoto {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string | null;
  blur_hash: string | null;
  description: string | null;
  alt_description: string | null;
  likes: number;
  urls: UnsplashApiPhotoUrls;
  links: {
    html: string;
  };
  user: UnsplashApiUser;
  tags?: UnsplashApiTag[];
  location?: UnsplashApiLocation | null;
}

export interface UnsplashApiPhotoDetails extends UnsplashApiPhoto {
  tags: UnsplashApiTag[];
  location: UnsplashApiLocation | null;
}

export interface UnsplashApiSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashApiPhoto[];
}

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
  items: PhotoSummary[];
  page: number;
  perPage: number;
  total: number | null;
  totalPages: number | null;
}
