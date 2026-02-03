import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  subscribeToGlobalGalleryImages,
  subscribeToDivisionGalleryImages
} from '../../services/firebase/galleryImageService';
import { getOptimizedImageUrl } from '../../utils/imageOptimization';
import type { GalleryImage } from '../../types';

interface ImageCarouselProps {
  scope: 'global' | 'division';
  divisionSlug?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ scope, divisionSlug }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const preloadedImagesRef = useRef<Set<number>>(new Set());

  // Subscribe to gallery images from Firebase based on scope
  useEffect(() => {
    if (scope === 'division' && !divisionSlug) {
      console.error('divisionSlug is required when scope is "division"');
      return;
    }

    const unsubscribe = scope === 'global'
      ? subscribeToGlobalGalleryImages(
          (galleryImages) => setImages(galleryImages),
          (error) => console.error('Error loading global gallery images:', error)
        )
      : subscribeToDivisionGalleryImages(
          divisionSlug!,
          (galleryImages) => setImages(galleryImages),
          (error) => console.error('Error loading division gallery images:', error)
        );

    return () => unsubscribe();
  }, [scope, divisionSlug]);

  // Clamp featured index when images change so it is always in bounds
  useEffect(() => {
    if (images.length === 0) return;
    setFeaturedIndex((prev) => Math.min(prev, Math.max(0, images.length - 1)));
  }, [images.length]);

  // Reset loaded state when featured index changes
  useEffect(() => {
    setIsImageLoaded(false);
  }, [featuredIndex]);

  const preloadImage = useCallback((index: number) => {
    if (images.length === 0 || index < 0 || index >= images.length) return;
    if (preloadedImagesRef.current.has(index)) return;
    const img = new Image();
    img.src = getOptimizedImageUrl(images[index].url, 600);
    preloadedImagesRef.current.add(index);
  }, [images]);

  // Preload current and next image to reduce flicker
  useEffect(() => {
    if (images.length === 0) return;
    preloadImage(featuredIndex);
    if (images.length > 1) {
      preloadImage((featuredIndex + 1) % images.length);
    }
  }, [featuredIndex, images, preloadImage]);

  // Auto-advance only when we have more than one image
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const featured = images[featuredIndex];
  // Grid: all indices except featured, in order, up to 9 (no separate state)
  const gridIndices = images
    .map((_, i) => i)
    .filter((i) => i !== featuredIndex)
    .slice(0, 9);

  // Empty state
  if (images.length === 0) {
    return (
      <section className="sm:py-12 bg-background-paper">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-content-heading mb-6 sm:mb-8">
            Gallery Highlights
          </h2>
          <div className="text-center py-12 text-content-tertiary">
            <p>No gallery images available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sm:py-12 bg-background-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-content-heading mb-6 sm:mb-8">
          Gallery Highlights
        </h2>

        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 shadow-2xl overflow-hidden bg-background-muted">
            <div className="flex h-64 sm:h-80 md:h-96">
              {/* 40% main featured image */}
              <div className="w-[40%] flex items-center justify-center bg-background-paper relative">
                {featured?.url ? (
                  <>
                    <img
                      key={featuredIndex}
                      src={getOptimizedImageUrl(featured.url, 600)}
                      alt={featured.title ?? `Featured image ${featuredIndex + 1}`}
                      className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-500 ${
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      onLoad={() => setIsImageLoaded(true)}
                      onError={() => setIsImageLoaded(true)}
                    />
                    {featured.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                        <p className="text-white text-sm sm:text-base font-medium text-center line-clamp-2">
                          {featured.title}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-content-tertiary text-sm">No image</div>
                )}
              </div>

              {/* 60% 3×3 grid of thumbnails (all except featured, up to 9) */}
              <div className="w-[60%] p-2 sm:p-4 bg-background-page">
                <div className="grid grid-cols-3 gap-1 sm:gap-2 h-full">
                  {gridIndices.map((imageIndex) => {
                    const image = images[imageIndex];
                    if (!image) return null;
                    return (
                      <button
                        key={image.id ?? imageIndex}
                        type="button"
                        onClick={() => setFeaturedIndex(imageIndex)}
                        className="relative aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity duration-200 cursor-pointer bg-background-paper shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-1"
                        aria-label={image.title ?? `Select image ${imageIndex + 1}`}
                      >
                        <img
                          src={getOptimizedImageUrl(image.url, 300)}
                          alt={image.title ?? `Image ${imageIndex + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a
            href={scope === 'division' && divisionSlug ? `/divisions/${divisionSlug}/gallery` : '/gallery'}
            className="inline-block bg-interactive-primaryDefault hover:bg-interactive-primaryHover text-interactive-primaryText font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md transition-colors text-sm sm:text-base"
          >
            See More Photos
          </a>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ImageCarousel);
