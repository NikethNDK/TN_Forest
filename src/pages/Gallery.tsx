import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  subscribeToGlobalGalleryImages,
  subscribeToDivisionGalleryImages 
} from '../services/firebase/galleryImageService';
import { subscribeToDivision } from '../services/firebase/divisionService';
import type { GalleryImage, Division } from '../types';

const Gallery: React.FC = () => {
  const { divisionSlug } = useParams<{ divisionSlug?: string }>();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [division, setDivision] = useState<Division | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            {division ? `${division.name} Gallery` : 'Gallery'}
          </h1>
          {division?.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {division.description}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading gallery images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {divisionSlug 
                ? 'No gallery images available for this division yet.' 
                : 'No gallery images available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 bg-gray-100"
              >
                <img
                  src={image.url}
                  alt={`Gallery Image ${image.order + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

