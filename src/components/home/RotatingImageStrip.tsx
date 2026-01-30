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
      <section className="relative w-full h-44 sm:h-52 md:h-60 lg:h-72 xl:h-[400px] bg-gradient-to-r from-green-900 to-green-700 overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">No slider images available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-44 sm:h-52 md:h-60 lg:h-72 xl:h-[400px] bg-gradient-to-r from-green-900 to-green-700 overflow-hidden rounded-lg shadow-lg">
      <div className="relative w-full h-full">
        {/* COMMENTED OUT: Blurred background - uncomment to restore original carousel style */}
        {/* <div className="absolute inset-0 w-full h-full">
          <img
            src={getOptimizedImageUrl(images[currentIndex], 1920)}
            alt={`Nursery Image Background ${currentIndex + 1}`}
            className="w-full h-full object-cover scale-110 blur-md transition-opacity duration-500 ease-in-out"
            decoding="async"
          />
        </div> */}

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img
            src={getOptimizedImageUrl(images[currentIndex], 1200)}
            alt={`Nursery Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            decoding="async"
          />
        </div>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-20"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-green-800" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-20"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-green-800" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/75'
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

