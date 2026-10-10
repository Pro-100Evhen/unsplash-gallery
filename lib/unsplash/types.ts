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
