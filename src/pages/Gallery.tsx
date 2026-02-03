import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { 
  subscribeToGlobalGalleryImages,
  subscribeToDivisionGalleryImages 
} from '../services/firebase/galleryImageService';
import { subscribeToDivision } from '../services/firebase/divisionService';
import type { GalleryImage, Division } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

const Gallery: React.FC = () => {
  const { divisionSlug } = useParams<{ divisionSlug?: string }>();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [division, setDivision] = useState<Division | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Load division data if divisionSlug exists
  useEffect(() => {
    if (!divisionSlug) {
      setDivision(null);
      return;
    }

    const unsubscribe = subscribeToDivision(
      divisionSlug,
      (divisionData) => {
        setDivision(divisionData);
      },
      (error) => {
        console.error('Error loading division:', error);
      }
    );

    return () => unsubscribe();
  }, [divisionSlug]);

  // Subscribe to gallery images based on scope
  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = divisionSlug
      ? subscribeToDivisionGalleryImages(
          divisionSlug,
          (galleryImages) => {
            setImages(galleryImages);
            setIsLoading(false);
          },
          (error) => {
            console.error('Error loading division gallery images:', error);
            setIsLoading(false);
          }
        )
      : subscribeToGlobalGalleryImages(
          (galleryImages) => {
            setImages(galleryImages);
            setIsLoading(false);
          },
          (error) => {
            console.error('Error loading global gallery images:', error);
            setIsLoading(false);
          }
        );

    return () => unsubscribe();
  }, [divisionSlug]);

  // Handle image click to open modal
  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  // Handle keyboard navigation (ESC to close)
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <div className="min-h-screen bg-background-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-content-headingSecondary mb-6">
            {division ? `${division.name} Gallery` : 'Gallery'}
          </h1>
          {division?.description && (
            <p className="text-xl text-content-secondary max-w-3xl mx-auto leading-relaxed">
              {division.description}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-content-tertiary text-lg">Loading gallery images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-content-tertiary text-lg">
              {divisionSlug 
                ? 'No gallery images available for this division yet.' 
                : 'No gallery images available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 bg-background-muted cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={getOptimizedImageUrl(image.url, 400)}
                  alt={image.title || `Gallery Image ${image.order + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  decoding="async"
                />
                {/* Title overlay */}
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 pt-6">
                    <p className="text-white text-sm font-medium truncate">
                      {image.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal/Lightbox */}
      {selectedImageIndex !== null && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-background-paper/10 hover:bg-background-paper/20 text-content-inverse p-2 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Container with Title */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getOptimizedImageUrl(selectedImage.url, 1920)}
              alt={selectedImage.title || `Gallery Image ${selectedImage.order + 1}`}
              className="max-w-full max-h-[calc(90vh-4rem)] object-contain"
              loading="eager"
              fetchPriority="high"
            />
            {/* Full title display */}
            {selectedImage.title && (
              <div className="mt-4 px-4 text-center">
                <p className="text-white text-lg font-medium">
                  {selectedImage.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

