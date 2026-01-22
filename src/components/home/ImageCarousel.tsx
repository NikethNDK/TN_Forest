import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  subscribeToGlobalGalleryImages,
  subscribeToDivisionGalleryImages 
} from '../../services/firebase/galleryImageService';
import { getOptimizedImageUrl } from '../../utils/imageOptimization';

interface ImageCarouselProps {
  scope: 'global' | 'division';
  divisionSlug?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ scope, divisionSlug }) => {
  const [images, setImages] = useState<string[]>([]);

  // Subscribe to gallery images from Firebase based on scope
  useEffect(() => {
    if (scope === 'division' && !divisionSlug) {
      console.error('divisionSlug is required when scope is "division"');
      return;
    }

    const unsubscribe = scope === 'global'
      ? subscribeToGlobalGalleryImages(
          (galleryImages) => {
            // Extract URLs - images are already sorted by order from the query
            const imageUrls = galleryImages.map(img => img.url);
            setImages(imageUrls);
          },
          (error) => {
            console.error('Error loading global gallery images:', error);
          }
        )
      : subscribeToDivisionGalleryImages(
          divisionSlug!,
          (galleryImages) => {
            // Extract URLs - images are already sorted by order from the query
            const imageUrls = galleryImages.map(img => img.url);
            setImages(imageUrls);
          },
          (error) => {
            console.error('Error loading division gallery images:', error);
          }
        );

    return () => unsubscribe();
  }, [scope, divisionSlug]);

  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [gridIndices, setGridIndices] = useState<number[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const featuredIndexRef = useRef<number>(0);
  const preloadedImagesRef = useRef<Set<number>>(new Set());

  // Preload image function - uses optimized Cloudinary URL
  // Defined early so it can be used in other hooks
  const preloadImage = useCallback((index: number) => {
    if (images.length === 0 || index < 0 || index >= images.length) return;
    if (preloadedImagesRef.current.has(index)) return; // Already preloaded

    const optimizedUrl = getOptimizedImageUrl(images[index], 600);
    const img = new Image();
    img.src = optimizedUrl;
    preloadedImagesRef.current.add(index);
  }, [images]);

  // Initialize grid indices when images are loaded
  // Only recalculate when images.length changes, not on every render
  useEffect(() => {
    if (images.length > 0) {
      // Initialize grid with 9 random images (excluding index 0 which is featured)
      const availableIndices = Array.from({ length: images.length - 1 }, (_, i) => i + 1);
      setGridIndices(availableIndices.sort(() => Math.random() - 0.5).slice(0, 9));
      // Preload the initial featured image
      preloadImage(0);
    }
  }, [images.length, preloadImage]);

  useEffect(() => {
    featuredIndexRef.current = featuredIndex;
    // Reset loaded state when featured index changes
    setIsImageLoaded(false);
  }, [featuredIndex]);

  // Preload next featured image before switching
  useEffect(() => {
    if (images.length === 0) return;

    // Preload the current featured image
    preloadImage(featuredIndex);

    // Preload potential next images (for automatic rotation)
    const allIndices = Array.from({ length: images.length }, (_, i) => i);
    const availableForFeatured = allIndices.filter(idx => idx !== featuredIndex);
    // Preload a few potential next images
    const nextCandidates = availableForFeatured.slice(0, 3);
    nextCandidates.forEach(index => preloadImage(index));
  }, [featuredIndex, images, preloadImage]);

  const rotateFeatured = useCallback(() => {
    setGridIndices((prevGrid) => {
      // Pick a random image from ALL images (0-17) to be the new featured image
      const allIndices = Array.from({ length: images.length }, (_, i) => i);
      const availableForFeatured = allIndices.filter(idx => idx !== featuredIndexRef.current);
      const newFeaturedIndex = availableForFeatured[Math.floor(Math.random() * availableForFeatured.length)];
      
      // Preload the new featured image before switching
      preloadImage(newFeaturedIndex);
      
      // Replace a random grid position with the old featured image
      const randomGridPosition = Math.floor(Math.random() * prevGrid.length);
      const newGrid = [...prevGrid];
      newGrid[randomGridPosition] = featuredIndexRef.current;
      
      setFeaturedIndex(newFeaturedIndex);
      return newGrid;
    });
  }, [images.length, preloadImage]);

  const handleGridImageClick = (gridImageIndex: number, gridPosition: number): void => {
    // Preload the clicked image before switching
    preloadImage(gridImageIndex);
    
    setGridIndices((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[gridPosition] = featuredIndex;
      setFeaturedIndex(gridImageIndex);
      return newGrid;
    });
  };

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(rotateFeatured, 5000);
    return () => clearInterval(interval);
  }, [rotateFeatured, images.length]);

  // Show placeholder if no images
  if (images.length === 0) {
    return (
      <section className="sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
            Gallery Highlights
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p>No gallery images available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
          Gallery Highlights
        </h2>
        
        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 shadow-2xl overflow-hidden bg-gray-100">
            <div className="flex h-64 sm:h-80 md:h-96">
              <div className="w-[40%] flex items-center justify-center bg-white relative">
                {/* Featured image with smooth fade transition */}
                <img
                  key={featuredIndex} // Force remount on index change for smooth transition
                  src={getOptimizedImageUrl(images[featuredIndex], 600)}
                  alt={`Featured Nursery Image ${featuredIndex + 1}`}
                  className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-500 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => setIsImageLoaded(true)} // Show even if error to prevent stuck state
                />
              </div>

              <div className="w-[60%] p-2 sm:p-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-1 sm:gap-2 h-full">
                  {gridIndices.map((imageIndex, gridPosition) => (
                    <button
                      key={`${imageIndex}-${gridPosition}`}
                      onClick={() => handleGridImageClick(imageIndex, gridPosition)}
                      className="relative aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md"
                      aria-label={`Select image ${imageIndex + 1}`}
                    >
                      <img
                        src={getOptimizedImageUrl(images[imageIndex], 300)}
                        alt={`Nursery Image ${imageIndex + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a
            href={scope === 'division' && divisionSlug ? `/divisions/${divisionSlug}/gallery` : '/gallery'}
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md transition-colors text-sm sm:text-base"
          >
            See More Photos
          </a>
        </div>
      </div>
    </section>
  );
};

// Memoize component to prevent unnecessary re-renders when parent updates
export default React.memo(ImageCarousel);

