import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import all images from assets
import AlwarmalaiImage from '../../assets/Alwarmalai.jpeg';
import EdaikkalImage from '../../assets/Edaikkal.jpeg';
import HarurMNCImage from '../../assets/Harur MNC.jpeg';
import JamunamarathurImage from '../../assets/Jamunamarathur.jpeg';
import KalamavoorImage from '../../assets/Kalamavoor.jpeg';
import KathiripuramImage from '../../assets/Kathiripuram.jpeg';
import MaragattaImage from '../../assets/Maragatta.jpeg';
import MelchengamImage from '../../assets/Melchengam.jpeg';
import ThoppurImage from '../../assets/Thoppur.jpeg';
import ValkaraduImage from '../../assets/Valkaradu.jpeg';

const RotatingImageStrip: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const images: string[] = [
    AlwarmalaiImage,
    EdaikkalImage,
    HarurMNCImage,
    JamunamarathurImage,
    KalamavoorImage,
    KathiripuramImage,
    MaragattaImage,
    MelchengamImage,
    ThoppurImage,
    ValkaraduImage
  ];

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <section className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-r from-green-900 to-green-700 overflow-hidden">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={images[currentIndex]}
            alt={`Nursery Image Background ${currentIndex + 1}`}
            className="w-full h-full object-cover scale-110 blur-md transition-opacity duration-500 ease-in-out"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img
            src={images[currentIndex]}
            alt={`Nursery Image ${currentIndex + 1}`}
            className="w-[70%] h-auto max-h-full object-contain transition-opacity duration-500 ease-in-out"
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

