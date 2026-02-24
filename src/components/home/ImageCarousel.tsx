import React, { useState, useEffect } from 'react';
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

  // Subscribe to gallery images from Firebase
  useEffect(() => {
    if (scope === 'division' && !divisionSlug) {
      console.error('divisionSlug is required when scope is "division"');
      return;
    }

    const unsubscribe = scope === 'global'
      ? subscribeToGlobalGalleryImages(
          (galleryImages) => {
            setImages(galleryImages);
            // Reset featured index when images load
            if (galleryImages.length > 0) {
              setFeaturedIndex(0);
            }
          },
          (error) => console.error('Error loading global gallery images:', error)
        )
      : subscribeToDivisionGalleryImages(
          divisionSlug!,
          (galleryImages) => {
            setImages(galleryImages);
            if (galleryImages.length > 0) {
              setFeaturedIndex(0);
            }
          },
          (error) => console.error('Error loading division gallery images:', error)
        );

    return () => unsubscribe();
  }, [scope, divisionSlug]);

  // Auto-advance featured image every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Get featured image
  const featuredImage = images[featuredIndex];

  // Get up to 9 thumbnail indices (excluding the featured one)
  const thumbnailIndices = images
    .map((_, i) => i)
    .filter((i) => i !== featuredIndex)
    .slice(0, 9);

  // Always show 9 tiles (fill empty slots if needed)
  const TILE_COUNT = 9;

  const galleryHref = scope === 'division' && divisionSlug 
    ? `/divisions/${divisionSlug}/gallery` 
    : '/gallery';

  // Empty state
  if (images.length === 0) {
    return (
      <section id="gallery" className="py-16 px-4" style={scope === 'global' ? { backgroundColor: '#d8d3ca' } : undefined}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-6 w-6 text-forest-olive" />
            <span className="text-forest-olive font-semibold text-sm uppercase tracking-wide">
              Photo Gallery
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-main text-center mb-4">
            Glimpses of Our Research Centres
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
    <section id="gallery" className="py-16 px-4" style={scope === 'global' ? { backgroundColor: '#d8d3ca' } : undefined}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-6 w-6 text-forest-olive" />
            <span className="text-forest-olive font-semibold text-sm uppercase tracking-wide">
              Photo Gallery
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-main mb-4">
            Glimpses of Our Research Centres
          </h2>
          <p className="text-content-secondary max-w-2xl mx-auto">
            Explore the stunning biodiversity and natural beauty of Tamil Nadu&apos;s forests through our curated collection.
          </p>
        </div>

        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 shadow-soft overflow-hidden bg-background-muted rounded-xl">
            <div className="flex h-full flex-col md:flex-row">
              {/* Featured Image - Full width on mobile, 40% on desktop */}
              <div className="w-full md:w-[40%] h-full flex items-center justify-center bg-background-paper relative p-2 sm:p-4">
                {featuredImage?.url ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={getOptimizedImageUrl(featuredImage.url, 600)}
                      alt={featuredImage.title ?? `Featured image ${featuredIndex + 1}`}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      loading="eager"
                    />
                    {featuredImage.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 z-10">
                        <p className="text-white text-sm sm:text-base font-serif font-semibold text-center line-clamp-2 drop-shadow-lg">
                          {featuredImage.title}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-content-tertiary text-sm">Loading...</div>
                )}
              </div>

              {/* Thumbnail Grid - Hidden on mobile, 60% on desktop */}
              <div className="hidden md:flex w-[60%] h-full p-2 sm:p-4 bg-background-page">
                <div className="grid grid-cols-3 grid-rows-3 gap-1 sm:gap-2 w-full h-full">
                  {Array.from({ length: TILE_COUNT }, (_, slotIndex) => {
                    const imageIndex = thumbnailIndices[slotIndex];
                    const thumbnailImage = imageIndex !== undefined ? images[imageIndex] : null;

                    return (
                      <button
                        key={thumbnailImage?.id ?? `empty-tile-${slotIndex}`}
                        type="button"
                        onClick={() => {
                          if (imageIndex !== undefined) {
                            setFeaturedIndex(imageIndex);
                          }
                        }}
                        disabled={!thumbnailImage}
                        className="relative w-full h-full overflow-hidden rounded-lg bg-background-paper shadow-soft hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-1 disabled:opacity-50 disabled:cursor-default"
                        aria-label={thumbnailImage ? (thumbnailImage.title ?? `Select image ${imageIndex! + 1}`) : `Empty tile ${slotIndex + 1}`}
                      >
                        {thumbnailImage?.url ? (
                          <img
                            src={getOptimizedImageUrl(thumbnailImage.url, 300)}
                            alt={thumbnailImage.title ?? `Thumbnail ${imageIndex! + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
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
