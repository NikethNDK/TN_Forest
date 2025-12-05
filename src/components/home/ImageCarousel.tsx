import React, { useState, useEffect, useCallback, useRef } from 'react';

const ImageCarousel: React.FC = () => {
  // All images from public/gallery subfolders
  const images: string[] = [
    // Website - MND - Gallery - Melchengam (6 images)
    '/gallery/Website - MND - Gallery -  Melchengam/Adina cordifolia - Melchengam.jpg',
    '/gallery/Website - MND - Gallery -  Melchengam/Aegle marmalos - Melchengam.jpg',
    '/gallery/Website - MND - Gallery -  Melchengam/Albizzia richardiana - Melchengam.jpg',
    '/gallery/Website - MND - Gallery -  Melchengam/Automatic Weather Station - Melchengam.jpg',
    '/gallery/Website - MND - Gallery -  Melchengam/Boswellia serrata - Melchengam.jpg',
    '/gallery/Website - MND - Gallery -  Melchengam/Terminalia chebula - Melchengam.jpg',
    // Website - MND - Gallery - Edaikkal (3 images)
    '/gallery/Website - MND - Gallery - Edaikkal/Hildegardia populifolia - Critically Endangered - Edaikkal.jpg',
    '/gallery/Website - MND - Gallery - Edaikkal/Syzygium cuminii - Edaikkal.jpg',
    '/gallery/Website - MND - Gallery - Edaikkal/Terminalia chebula - Edaikkal.jpg',
    // Website - MND - Gallery - Jamunamarathur (7 images)
    '/gallery/Website - MND - Gallery - Jamunamarathur/Bambusa tulda - Jamunamarathur.jpg',
    '/gallery/Website - MND - Gallery - Jamunamarathur/Bambusa tulda - Jamunamarathur(1).jpg',
    '/gallery/Website - MND - Gallery - Jamunamarathur/Bambusa vulgaris - Jamunamarathur.jpg',
    '/gallery/Website - MND - Gallery - Jamunamarathur/Melia dubia - Jamunamarathur (1).jpg',
    '/gallery/Website - MND - Gallery - Jamunamarathur/Melia dubia - Jamunamarathur (2).jpg',
    '/gallery/Website - MND - Gallery - Jamunamarathur/Sapindus emarginatus - Jamunamarathur.jpg',
    '/gallery/Website - MND - Gallery - Jamunamarathur/Terminalia chebula - Jamunamarathur.jpg',
    // Website - MND - Gallery - Vermicasting Production (2 images)
    '/gallery/Website - MND - Gallery - Vermicasting Production/Vermicasting Production Shed.jpg',
    '/gallery/Website - MND - Gallery - Vermicasting Production/Vermicasting Production Tubs.jpg'
  ];

  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [gridIndices, setGridIndices] = useState<number[]>(() => {
    // Initialize grid with 9 random images (excluding index 0 which is featured)
    const availableIndices = Array.from({ length: images.length - 1 }, (_, i) => i + 1);
    return availableIndices.sort(() => Math.random() - 0.5).slice(0, 9);
  });
  const featuredIndexRef = useRef<number>(0);

  useEffect(() => {
    featuredIndexRef.current = featuredIndex;
  }, [featuredIndex]);

  const rotateFeatured = useCallback(() => {
    setGridIndices((prevGrid) => {
      // Pick a random image from ALL images (0-17) to be the new featured image
      const allIndices = Array.from({ length: images.length }, (_, i) => i);
      const availableForFeatured = allIndices.filter(idx => idx !== featuredIndexRef.current);
      const newFeaturedIndex = availableForFeatured[Math.floor(Math.random() * availableForFeatured.length)];
      
      // Replace a random grid position with the old featured image
      const randomGridPosition = Math.floor(Math.random() * prevGrid.length);
      const newGrid = [...prevGrid];
      newGrid[randomGridPosition] = featuredIndexRef.current;
      
      setFeaturedIndex(newFeaturedIndex);
      return newGrid;
    });
  }, [images.length]);

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

