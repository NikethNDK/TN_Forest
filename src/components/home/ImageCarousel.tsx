import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';
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

  const galleryHref = scope === 'division' && divisionSlug ? `/divisions/${divisionSlug}/gallery` : '/gallery';

  // Empty state — bg-background matches reference GallerySection
  if (images.length === 0) {
    return (
      <section id="gallery" className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-6 w-6 text-forest-olive" />
            <span className="text-forest-olive font-semibold text-sm uppercase tracking-wide">
              Photo Gallery
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-main text-center mb-4">
            Glimpses of Our Forests
          </h2>
          <p className="text-content-secondary text-center max-w-2xl mx-auto mb-8">
            Explore the stunning biodiversity and natural beauty of Tamil Nadu&apos;s forests through our curated collection.
          </p>
          <div className="text-center py-12 text-content-tertiary">
            <p>No gallery images available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-6 w-6 text-forest-olive" />
            <span className="text-forest-olive font-semibold text-sm uppercase tracking-wide">
              Photo Gallery
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-main mb-4">
            Glimpses of Our Forests
          </h2>
          <p className="text-content-secondary max-w-2xl mx-auto">
            Explore the stunning biodiversity and natural beauty of Tamil Nadu&apos;s forests through our curated collection.
          </p>
        </div>

        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 shadow-soft overflow-hidden bg-background-muted rounded-xl">
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
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 sm:p-4">
                        <p className="text-white text-sm sm:text-base font-serif font-semibold text-center line-clamp-2">
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
                        className="relative aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity duration-200 cursor-pointer bg-background-paper shadow-soft hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-1"
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

        <div className="text-center mt-8">
          <Link
            to={galleryHref}
            className="inline-flex items-center border-2 border-primary-main text-primary-main hover:bg-primary-main hover:text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base group"
          >
            View More
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ImageCarousel);
