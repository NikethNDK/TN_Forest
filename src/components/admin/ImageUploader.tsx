import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImageFile, createImagePreview, validateImageFile } from '../../services/admin/fileUploadService';
import GalleryUploadModal, { ImageWithTitle, ExistingImageForEdit } from './GalleryUploadModal';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imagePath: string, publicId?: string, title?: string) => void;
  /** Called when upload starts (true) or ends (false). Use to disable parent form submit while uploading. */
  onUploadingChange?: (uploading: boolean) => void;
  directory?: string;
  label?: string;
  accept?: string;
  requireTitle?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  onUploadingChange,
  directory = 'images',
  label = 'Upload Image',
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  requireTitle = false
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<ImageWithTitle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear file input immediately
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setError(null);
    setUploadProgress(0);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Create preview
      const previewUrl = await createImagePreview(file);

      if (requireTitle) {
        // Open modal for title input
        setPendingImage({
          id: `${Date.now()}`,
          file,
          preview: previewUrl,
          title: ''
        });
        setIsModalOpen(true);
      } else {
        // Upload directly without title (legacy behavior)
        await uploadFile(file, previewUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  const uploadFile = async (file: File, previewUrl: string, title?: string) => {
    setUploading(true);
    onUploadingChange?.(true);
    setPreview(previewUrl);

    try {
      // Upload file to Cloudinary with progress tracking
      const result = await uploadImageFile(
        file,
        directory,
        (progress) => {
          setUploadProgress(progress);
        }
      );
      
      if (result.success && result.path) {
        // Ensure progress reaches 100% on success
        setUploadProgress(100);
        // Call the parent callback with title
        onImageChange(result.path, result.publicId, title);
        // Clear preview and file input after successful upload
        setTimeout(() => {
          setPreview(null);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 500);
      } else {
        setError(result.error || 'Upload failed');
        setPreview(null);
        setUploadProgress(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setPreview(null);
      setUploadProgress(0);
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const handleModalConfirm = async (images: ImageWithTitle[] | ExistingImageForEdit[]) => {
    setIsModalOpen(false);
    
    // Type guard: in upload mode, we always receive ImageWithTitle[]
    const uploadImages = images as ImageWithTitle[];
    if (uploadImages.length > 0) {
      const image = uploadImages[0];
      await uploadFile(image.file, image.preview, image.title);
    }
    
    setPendingImage(null);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingImage(null);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
            />
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading || isModalOpen}
            className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors overflow-hidden"
            style={{ minWidth: '140px' }}
          >
            {uploading && (
              <div
                className="absolute inset-0 bg-green-400 transition-all duration-300 ease-out"
                style={{
                  width: `${uploadProgress}%`,
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? `Uploading... ${uploadProgress}%` : preview ? 'Change Image' : 'Upload Image'}
            </span>
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* Gallery Upload Modal */}
      <GalleryUploadModal
        isOpen={isModalOpen}
        mode="upload"
        images={pendingImage ? [pendingImage] : []}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default ImageUploader;
