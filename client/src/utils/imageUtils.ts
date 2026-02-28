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
 * Returns the image URL ready to use in <img src>.
 * - Absolute URLs are returned as-is.
 * - Relative paths (e.g. /produtos/1/image-1-1.webp) are prefixed with the
 *   backend origin so they work even when the frontend is on a different domain.
 *   In dev, VITE_API_URL defaults to http://localhost:3001 (Vite also proxies /produtos).
 *   In production, set VITE_API_URL to the backend domain (e.g. https://arteemponto.pt).
 */
export const getAbsoluteImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';

  // Already absolute
  if (imageUrl.startsWith('http')) return imageUrl;

  // Prefix with backend origin so the path resolves correctly on any deployment
  const backendOrigin = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${backendOrigin}${imageUrl}`;
};
