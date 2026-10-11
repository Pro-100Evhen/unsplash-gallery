const ATTRIBUTION_PARAMS = {
  utm_source: "arounda_photo_gallery",
  utm_medium: "referral",
} as const;

const UNSPLASH_URL = "https://unsplash.com/";

function isUnsplashHostname(hostname: string): boolean {
  return hostname === "unsplash.com" || hostname.endsWith(".unsplash.com");
}

export function getUnsplashAttributionUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    url = new URL(UNSPLASH_URL);
  }

  if (url.protocol !== "https:" || !isUnsplashHostname(url.hostname)) {
    url = new URL(UNSPLASH_URL);
  }

  Object.entries(ATTRIBUTION_PARAMS).forEach(([name, paramValue]) => {
    url.searchParams.set(name, paramValue);
  });

  return url.toString();
}
