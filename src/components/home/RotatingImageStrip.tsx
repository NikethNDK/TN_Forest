import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { subscribeToSliderImages } from '../../services/firebase/sliderImageService';
import { getOptimizedImageUrl } from '../../utils/imageOptimization';

const HEIGHT_DEFAULT =
  'h-44 sm:h-52 md:h-60 lg:h-72 xl:h-[400px]';
const HEIGHT_FILL = 'h-full min-h-0';

interface RotatingImageStripProps {
  fillHeight?: boolean;
}

const RotatingImageStrip: React.FC<RotatingImageStripProps> = ({
  fillHeight = false,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const heightClass = fillHeight ? HEIGHT_FILL : HEIGHT_DEFAULT;
  const n = images.length;

  // Fetch images
  useEffect(() => {
    const unsub = subscribeToSliderImages(
      (list) => {
        const urls = list
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((i) => i.url);

        setImages(urls);
        setCurrentIndex((prev) =>
          urls.length && prev >= urls.length ? 0 : prev
        );
      },
      (err) => console.error('Slider images:', err)
    );

    return unsub;
  }, []);

  // Navigation
  const goNext = useCallback(() => {
    if (n <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % n);
  }, [n]);

  const goPrev = useCallback(() => {
    if (n <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + n) % n);
  }, [n]);

  const goToIndex = useCallback(
    (index: number) => {
      if (n === 0 || index === currentIndex) return;
      setCurrentIndex(index);
    },
    [n, currentIndex]
  );

  // Auto slide
  useEffect(() => {
    if (n <= 1) return;
  
    const timer = setTimeout(() => {
      goNext();
    }, 5000);
  
    return () => clearTimeout(timer);
  }, [currentIndex, n, goNext]);

  // Preload next image (hybrid optimization)
  useEffect(() => {
    if (n <= 1) return;

    const nextIndex = (currentIndex + 1) % n;
    const img = new Image();
    img.src = getOptimizedImageUrl(images[nextIndex], 1200);
  }, [currentIndex, images, n]);

  if (images.length === 0) {
    return (
      <section
        className={`relative w-full ${heightClass} bg-gradient-cream overflow-hidden rounded-lg shadow-elevated flex items-center justify-center`}
      >
        <Loader2
          className="h-10 w-10 animate-spin text-home-heading"
          aria-hidden="true"
        />
        <span className="sr-only">Loading slider images</span>
      </section>
    );
  }

  const currentImageUrl = getOptimizedImageUrl(
    images[currentIndex],
    1200
  );

  return (
    <section
      className={`relative w-full ${heightClass} bg-gradient-cream overflow-hidden rounded-lg shadow-elevated`}
    >
      <div className="relative w-full h-full">

        {/* Image */}
        <img
          key={currentIndex}
          src={currentImageUrl}
          alt={`Nursery Image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={currentIndex === 0 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Prev button */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all z-20"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all z-20"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-forest-gold w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RotatingImageStrip;