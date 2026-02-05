import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToSliderImages } from '../../services/firebase/sliderImageService';
import { getOptimizedImageUrl } from '../../utils/imageOptimization';

const RotatingImageStrip: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

  // Subscribe to slider images from Firebase
  // Fixed: Removed currentIndex from dependencies to prevent re-subscription on every image change
  useEffect(() => {
    const unsubscribe = subscribeToSliderImages(
      (sliderImages) => {
        // Extract URLs and sort by order
        const imageUrls = sliderImages
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(img => img.url);
        setImages(imageUrls);
        
        // Reset to first image if current index is out of bounds
        setCurrentIndex((prev) => {
          if (imageUrls.length > 0 && prev >= imageUrls.length) {
            return 0;
          }
          return prev;
        });
      },
      (error) => {
        console.error('Error loading slider images:', error);
      }
    );

    return () => unsubscribe();
  }, []); // Empty deps - only subscribe once on mount

  const nextImage = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  }, [images.length]);

  const prevImage = (): void => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    if (images.length === 0) return;
    
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage, images.length]);

  // Show placeholder if no images
  if (images.length === 0) {
    return (
      <section className="relative w-full h-44 sm:h-52 md:h-60 lg:h-72 xl:h-[400px] bg-gradient-cream overflow-hidden rounded-lg shadow-elevated flex items-center justify-center">
        <div className="text-content-heading text-center">
          <p className="text-lg">No slider images available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-44 sm:h-52 md:h-60 lg:h-72 xl:h-[400px] bg-gradient-cream overflow-hidden rounded-lg shadow-elevated">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img
            src={getOptimizedImageUrl(images[currentIndex], 1200)}
            alt={`Nursery Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        </div>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all z-20"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all z-20"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-forest-gold w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RotatingImageStrip;

