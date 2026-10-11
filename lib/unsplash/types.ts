import { z } from "zod";

const unsplashApiPhotoUrlsSchema = z.object({
  raw: z.string().url(),
  full: z.string().url(),
  regular: z.string().url(),
  small: z.string().url(),
  thumb: z.string().url(),
});

const unsplashApiUserSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  name: z.string().min(1),
  profile_image: z.object({
    small: z.string().url(),
    medium: z.string().url(),
    large: z.string().url(),
  }),
  links: z.object({ html: z.string().url() }),
});

const unsplashApiTagSchema = z.object({ title: z.string() });

const unsplashApiLocationSchema = z.object({
  name: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  position: z.object({
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }),
});

export const unsplashApiPhotoSchema = z.object({
  id: z.string().min(1),
  created_at: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  color: z.string().nullable(),
  blur_hash: z.string().nullable(),
  description: z.string().nullable(),
  alt_description: z.string().nullable(),
  likes: z.number().int().nonnegative(),
  urls: unsplashApiPhotoUrlsSchema,
  links: z.object({ html: z.string().url() }),
  user: unsplashApiUserSchema,
  tags: z.array(unsplashApiTagSchema).optional(),
  location: unsplashApiLocationSchema.nullable().optional(),
});

export const unsplashApiPhotoDetailsSchema = unsplashApiPhotoSchema.extend({
  tags: z.array(unsplashApiTagSchema),
  location: unsplashApiLocationSchema.nullable(),
});

export const unsplashApiSearchResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
  results: z.array(unsplashApiPhotoSchema),
});

export type UnsplashApiPhoto = z.infer<typeof unsplashApiPhotoSchema>;
export type UnsplashApiPhotoDetails = z.infer<
  typeof unsplashApiPhotoDetailsSchema
>;
export type UnsplashApiSearchResponse = z.infer<
  typeof unsplashApiSearchResponseSchema
>;
export type UnsplashApiUser = z.infer<typeof unsplashApiUserSchema>;
