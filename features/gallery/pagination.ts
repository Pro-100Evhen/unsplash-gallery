export const GALLERY_PER_PAGE = 20;
export const MAX_GALLERY_PAGE = 500;

export type RawPageParam = string | readonly string[] | undefined;

export function parsePageParam(value: RawPageParam): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) ? Math.min(page, MAX_GALLERY_PAGE) : 1;
}

export function shouldRedirectPageParam(value: RawPageParam): boolean {
  return value !== undefined && value !== String(parsePageParam(value));
}
