/**
 * Cloudinary Image Configuration
 *
 * Setup:
 * 1. Create a free account at https://cloudinary.com
 * 2. Create an upload preset (e.g., "emmanueliren") or use the Media Library
 * 3. Upload your images maintaining this folder structure:
 *    - emmanueliren/hero-emmanuel.jpg
 *    - emmanueliren/about-emmanuel.webp
 *    - emmanueliren/books/love-code.jpg
 *    - emmanueliren/books/leading-seeks-you.jpg
 *    - emmanueliren/books/pray-book.jpg
 *    - emmanueliren/books/am-i-being-fooled.jpg
 *    - emmanueliren/books/saving-grace.jpg
 *    - emmanueliren/books/purposefully.jpg
 *    - emmanueliren/media/spiritual-album.jpg
 *    - emmanueliren/media/apostolos-album.jpg
 * 4. Replace emmanueliren below with your actual Cloudinary cloud name
 * 5. Remove local images from public/images/ after confirming Cloudinary works
 */

const CLOUDINARY_CLOUD_NAME = 'emmanueliren';
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_FOLDER = 'emmanueliren';

/**
 * Generate a Cloudinary image URL with automatic optimization
 * @param {string} path - Image path within the emmanueliren folder (e.g., 'books/love-code.jpg')
 * @param {number|null} width - Desired width, or null for original size
 * @returns {string} Optimized Cloudinary URL
 */
function cdnUrl(path, width = null) {
  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  return `${CLOUDINARY_BASE}/${transforms.join(',')}/${CLOUDINARY_FOLDER}/${path}`;
}

/**
 * Generate a srcset string with multiple widths for responsive images
 * @param {string} path - Image path within the emmanueliren folder
 * @param {number[]} widths - Array of widths to generate
 * @returns {string} srcset attribute value
 */
function cdnSrcset(path, widths) {
  return widths.map(w => `${cdnUrl(path, w)} ${w}w`).join(', ');
}

// Export for module environments (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cdnUrl, cdnSrcset, CLOUDINARY_CLOUD_NAME };
}
