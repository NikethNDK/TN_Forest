import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

// For new uploads (has File object)
export interface ImageWithTitle {
  id: string;
  file: File;
  preview: string;
  title: string;
}

// For editing existing images (has URL instead of File)
export interface ExistingImageForEdit {
  id: string;
  url: string;
  title: string;
}

interface GalleryUploadModalProps {
  isOpen: boolean;
  mode: 'upload' | 'edit';
  images: ImageWithTitle[];
  existingImages?: ExistingImageForEdit[];
  onConfirm: (images: ImageWithTitle[] | ExistingImageForEdit[]) => void;
  onCancel: () => void;
}

const MAX_TITLE_LENGTH = 100;

const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  mode = 'upload',
  images,
  existingImages = [],
  onConfirm,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Determine which image list to use based on mode
  const imageList = mode === 'edit' ? existingImages : images;

  // Initialize titles from images
  useEffect(() => {
    if (isOpen && imageList.length > 0) {
      const initialTitles: Record<string, string> = {};
      imageList.forEach(img => {
        initialTitles[img.id] = img.title || '';
      });
      setTitles(initialTitles);
      setCurrentIndex(0);
      setError(null);
    }
  }, [isOpen, imageList]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || imageList.length === 0) return null;

  const currentImage = imageList[currentIndex];
  const isMultiple = imageList.length > 1;

  // Get image source - preview for uploads, url for existing
  const getImageSrc = (img: ImageWithTitle | ExistingImageForEdit): string => {
    if ('preview' in img) {
      return img.preview;
    }
    return img.url;
  };

  const handleTitleChange = (value: string) => {
    if (value.length <= MAX_TITLE_LENGTH) {
      setTitles(prev => ({
        ...prev,
        [currentImage.id]: value
      }));
      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    }
  };

  // Title is now optional - no validation required

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : imageList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < imageList.length - 1 ? prev + 1 : 0));
  };

  const handleSubmit = () => {
    // Title is optional - prepare images with titles (empty string if not provided)
    if (mode === 'edit') {
      const updatedImages = existingImages.map(img => ({
        ...img,
        title: (titles[img.id] || '').trim()
      }));
      onConfirm(updatedImages);
    } else {
      const imagesWithTitles = images.map(img => ({
        ...img,
        title: (titles[img.id] || '').trim()
      }));
      onConfirm(imagesWithTitles);
    }
  };

  const handleClose = () => {
    onCancel();
  };

  const currentTitle = titles[currentImage.id] || '';

  // Dynamic text based on mode
  const modalTitle = mode === 'edit'
    ? (isMultiple ? 'Edit Image Titles' : 'Edit Image Title')
    : (isMultiple ? 'Add Image Titles' : 'Add Image Title');

  const submitButtonText = mode === 'edit'
    ? (isMultiple ? `Save ${imageList.length} Titles` : 'Save Title')
    : (isMultiple ? `Upload ${imageList.length} Images` : 'Upload Image');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-900">
            {modalTitle}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Image Preview with Carousel */}
          <div className="relative mb-6">
            {/* Image Container */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={getImageSrc(currentImage)}
                alt={`Preview ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows (only if multiple images) */}
              {isMultiple && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Progress Indicator (only if multiple images) */}
            {isMultiple && (
              <div className="text-center mt-3 text-sm text-gray-600">
                Image {currentIndex + 1} of {imageList.length}
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="image-title" className="block text-sm font-medium text-gray-700">
              Image Title <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              id="image-title"
              type="text"
              value={currentTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter a title for this image (optional)"
              maxLength={MAX_TITLE_LENGTH}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-colors"
            />
            <div className="flex justify-end text-xs text-gray-500">
              <span>{currentTitle.length}/{MAX_TITLE_LENGTH}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryUploadModal;
