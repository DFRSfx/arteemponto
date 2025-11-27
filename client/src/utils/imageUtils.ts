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
 * Converts relative image URL from backend to absolute URL
 * @param imageUrl - Relative URL from backend (e.g., "/products/image/1?v=123")
 * @returns Absolute URL with API base
 */
export const getAbsoluteImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';

  // If already absolute, return as is
  if (imageUrl.startsWith('http')) return imageUrl;

  // Add API base URL (VITE_API_URL should NOT have /api at the end)
  const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;
  return `${API_BASE}${imageUrl}`;
};
