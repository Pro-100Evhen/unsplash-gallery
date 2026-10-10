export const SEARCH_DEBOUNCE_MS = 700;
export const SEARCH_THROTTLE_MS = 1_000;
export const MIN_AUTO_SEARCH_LENGTH = 2;

export function shouldAutoSearch(query: string): boolean {
  return query.length === 0 || query.length >= MIN_AUTO_SEARCH_LENGTH;
}

export function getSearchNavigationDelay(
  lastNavigationAt: number,
  now: number,
): number {
  const throttleDelay = Math.max(
    0,
    SEARCH_THROTTLE_MS - (now - lastNavigationAt),
  );

  return Math.max(SEARCH_DEBOUNCE_MS, throttleDelay);
}

export function createSearchHref(query: string): string {
  if (!query) {
    return "/";
  }

  return `/search?${new URLSearchParams({ query }).toString()}`;
}
