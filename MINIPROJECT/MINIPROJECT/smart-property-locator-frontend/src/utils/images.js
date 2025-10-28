// src/utils/images.js

// Default fallback image if no image is available
export const DEFAULT_FALLBACK_IMAGE = '/images/no_image_available.png';

/**
 * Returns the URL of the first image from a property object
 * Handles cases where images can be:
 * - an array of strings
 * - an array of objects with `.image` property
 * - missing entirely
 */
export const getFirstPropertyImage = (property) => {
  if (!property) return DEFAULT_FALLBACK_IMAGE;

  const images = property.images;
  if (!images || images.length === 0) return DEFAULT_FALLBACK_IMAGE;

  const first = images[0];

  if (typeof first === 'string') return first; // direct string URL
  if (typeof first === 'object' && first.image) return first.image; // object with .image
  return DEFAULT_FALLBACK_IMAGE; // fallback
};

/**
 * Returns the URL from a single image item (object or string)
 */
export const getImageUrlFromItem = (item) => {
  if (!item) return DEFAULT_FALLBACK_IMAGE;
  if (typeof item === 'string') return item;
  if (typeof item === 'object' && item.image) return item.image;
  return DEFAULT_FALLBACK_IMAGE;
};
