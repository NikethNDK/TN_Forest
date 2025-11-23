import React, { useState, useEffect, useCallback, useRef } from 'react';

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

const ImageCarousel: React.FC = () => {
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

  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [gridIndices, setGridIndices] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const featuredIndexRef = useRef<number>(0);

  useEffect(() => {
    featuredIndexRef.current = featuredIndex;
  }, [featuredIndex]);

  const rotateFeatured = useCallback(() => {
    setGridIndices((prevGrid) => {
      const randomIndex = Math.floor(Math.random() * prevGrid.length);
      const selectedGridIndex = prevGrid[randomIndex];
      
      const newGrid = [...prevGrid];
      newGrid[randomIndex] = featuredIndexRef.current;
      
      setFeaturedIndex(selectedGridIndex);
      return newGrid;
    });
  }, []);

  const handleGridImageClick = (gridImageIndex: number, gridPosition: number): void => {
    setGridIndices((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[gridPosition] = featuredIndex;
      setFeaturedIndex(gridImageIndex);
      return newGrid;
    });
  };

  useEffect(() => {
    const interval = setInterval(rotateFeatured, 5000);
    return () => clearInterval(interval);
  }, [rotateFeatured]);

  return (
    <section className="sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
          Gallery Highlights
        </h2>
        
        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 shadow-2xl overflow-hidden bg-gray-100">
            <div className="flex h-64 sm:h-80 md:h-96">
              <div className="w-[40%] flex items-center justify-center bg-white">
                <img
                  src={images[featuredIndex]}
                  alt={`Featured Nursery Image ${featuredIndex + 1}`}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
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
                        src={images[imageIndex]}
                        alt={`Nursery Image ${imageIndex + 1}`}
                        className="w-full h-full object-cover"
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
            href="/gallery"
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md transition-colors text-sm sm:text-base"
          >
            See More Photos
          </a>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;

