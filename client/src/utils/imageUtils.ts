/**
 * Normalizes URL protocol, fixing common typos like "https//domain" -> "https://domain"
 */
function normalizeProtocol(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  // Fix https// or http// without colon
  cleaned = cleaned.replace(/^https?\/\//i, match => match.toLowerCase().startsWith('https') ? 'https://' : 'http://');
  // Fix https:/ or http:/ with single slash
  cleaned = cleaned.replace(/^https?:\/(?!\/)/i, match => match.toLowerCase().startsWith('https') ? 'https://' : 'http://');
  return cleaned;
}

/**
 * Adds cache busting parameter to image URLs to force browser to reload
 * @param imageUrl - The image URL (can be relative or absolute)
 * @param forceBust - If true, adds timestamp. If false, returns original URL
 * @returns URL with cache busting parameter
 */
export const addCacheBusting = (imageUrl: string, forceBust: boolean = false): string => {
  if (!imageUrl) return '';

  // If forceBust is false, return original URL (useful for initial loads)
  if (!forceBust) return imageUrl;

  // Check if URL already has query parameters
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}t=${Date.now()}`;
};

/**
 * Creates a cache busting key that changes when needed
 * Use this for component keys to force re-render when images update
 */
export const getImageCacheKey = (): number => {
  return Date.now();
};

/**
 * Returns the URL for a specific size variant of a product image.
 * - 'lg': original path (max 1200 px) — product detail page
 * - 'md': medium (max 600 px)         — shop grid / modals
 * - 'sm': small (max 280 px)          — thumbnails, cart, admin previews
 *
 * Falls back gracefully to the original path for images that pre-date the
 * multi-variant system (the browser will just load the full-size file).
 */
export const imgVariant = (imagePath: string, variant: 'sm' | 'md' | 'lg'): string => {
  if (!imagePath || variant === 'lg') return imagePath;
  return imagePath.replace(/\.webp(\?.*)?$/, (_match, query) => `-${variant}.webp${query || ''}`);
};

/**
 * Returns the image URL ready to use in <img src>.
 * - Absolute URLs (Cloudflare R2 CDN) are returned as-is (with protocol normalized).
 * - Relative paths (/produtos/... or /hero-slides/...) resolve to the CDN or backend.
 */
export const getAbsoluteImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';

  const normalizedUrl = normalizeProtocol(imageUrl);

  // Already absolute (e.g. https://cdn-arteemponto.dariosoares.dev/...)
  if (/^https?:\/\//i.test(normalizedUrl)) {
    return normalizedUrl;
  }

  // Relative CDN media paths
  if (normalizedUrl.startsWith('/produtos') || normalizedUrl.startsWith('/hero-slides')) {
    let cdnOrigin = normalizeProtocol(
      import.meta.env.VITE_CDN_URL || 'https://cdn-arteemponto.dariosoares.dev'
    );
    if (!/^https?:\/\//i.test(cdnOrigin)) {
      cdnOrigin = `https://${cdnOrigin.replace(/^\/+/, '')}`;
    }
    cdnOrigin = cdnOrigin.replace(/\/$/, '');
    const cleanPath = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
    return `${cdnOrigin}${cleanPath}`;
  }

  // Fallback to backend origin
  let backendOrigin = normalizeProtocol(import.meta.env.VITE_API_URL || '');
  if (!backendOrigin) {
    return normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
  }
  if (!/^https?:\/\//i.test(backendOrigin)) {
    backendOrigin = `https://${backendOrigin.replace(/^\/+/, '')}`;
  }
  backendOrigin = backendOrigin.replace(/\/$/, '');
  const cleanPath = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
  return `${backendOrigin}${cleanPath}`;
};
