/**
 * Cloudinary Image Optimization Utility
 * 
 * Applies Cloudinary transformations to optimize image loading:
 * - f_auto: Automatic format selection (WebP/AVIF when supported)
 * - q_auto: Automatic quality optimization
 * - w_*: Width constraint for responsive images
 */

/**
 * Optimizes a Cloudinary image URL with transformations
 * @param url - Original Cloudinary URL
 * @param width - Target width in pixels
 * @param quality - Quality (default: 'auto' for Cloudinary optimization)
 * @returns Optimized Cloudinary URL
 */
export const getOptimizedImageUrl = (
  url: string,
  width: number,
  quality: string | number = 'auto'
): string => {
  // If not a Cloudinary URL, return as-is
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Find the '/upload/' segment in the URL
  const uploadSegment = '/upload/';
  const uploadIndex = url.indexOf(uploadSegment);
  
  if (uploadIndex === -1) {
    // If no '/upload/' found, return original URL
    return url;
  }

  // Split URL: everything up to and including '/upload/', and everything after
  const baseUrl = url.substring(0, uploadIndex + uploadSegment.length); // Includes '/upload/'
  const pathAfterUpload = url.substring(uploadIndex + uploadSegment.length); // Everything after '/upload/'
  
  // Check if transformations already exist (path starts with transformation pattern like 'w_', 'c_', etc.)
  // Cloudinary transformations typically start with letters followed by underscore
  let imagePath = pathAfterUpload;
  const hasExistingTransformations = /^[a-z]+_[^/]+,/.test(pathAfterUpload);
  
  if (hasExistingTransformations) {
    // Remove existing transformations (everything up to the first '/' after transformations)
    const pathMatch = pathAfterUpload.match(/^[^/]+\/(.+)$/);
    if (pathMatch) {
      imagePath = pathMatch[1];
    }
  }

  // Build transformation string
  const transformations = `w_${width},q_${quality},f_auto`;
  
  // Construct URL: baseUrl + transformations + '/' + imagePath
  // Result: https://.../upload/w_1920,q_auto,f_auto/path/to/image.jpg
  return `${baseUrl}${transformations}/${imagePath}`;
};

