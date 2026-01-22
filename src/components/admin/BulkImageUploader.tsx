import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadImageFile, validateImageFile } from '../../services/admin/fileUploadService';

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
  publicId?: string;
}

interface BulkImageUploaderProps {
  onImageUploaded: (url: string, publicId: string) => Promise<void>;
  directory?: string;
  label?: string;
  accept?: string;
}

const BulkImageUploader: React.FC<BulkImageUploaderProps> = ({
  onImageUploaded,
  directory = 'images',
  label = 'Bulk Upload Images',
  accept = 'image/jpeg,image/jpg,image/png,image/webp'
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create upload items with previews
    const newFiles: UploadingFile[] = await Promise.all(
      files.map(async (file, index) => {
        const preview = await createPreview(file);
        return {
          id: `${Date.now()}-${index}`,
          file,
          preview,
          progress: 0,
          status: 'pending' as const
        };
      })
    );

    // Validate files
    const validFiles = newFiles.filter(item => {
      const validation = validateImageFile(item.file);
      if (!validation.valid) {
        item.status = 'error';
        item.error = validation.error;
        return false;
      }
      return true;
    });

    setUploadingFiles(prev => [...prev, ...newFiles]);

    // Start uploading valid files
    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const uploadFiles = async (files: UploadingFile[]) => {
    setIsUploading(true);

    for (const item of files) {
      // Update status to uploading
      setUploadingFiles(prev =>
        prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f)
      );

      try {
        const result = await uploadImageFile(
          item.file,
          directory,
          (progress) => {
            setUploadingFiles(prev =>
              prev.map(f => f.id === item.id ? { ...f, progress } : f)
            );
          }
        );

        if (result.success && result.path && result.publicId) {
          // Update status to success
          setUploadingFiles(prev =>
            prev.map(f => f.id === item.id ? {
              ...f,
              status: 'success',
              progress: 100,
              url: result.path,
              publicId: result.publicId
            } : f)
          );

          // Notify parent of successful upload
          await onImageUploaded(result.path, result.publicId);
        } else {
          setUploadingFiles(prev =>
            prev.map(f => f.id === item.id ? {
              ...f,
              status: 'error',
              error: result.error || 'Upload failed'
            } : f)
          );
        }
      } catch (error) {
        setUploadingFiles(prev =>
          prev.map(f => f.id === item.id ? {
            ...f,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          } : f)
        );
      }
    }

    setIsUploading(false);
  };

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const successCount = uploadingFiles.filter(f => f.status === 'success').length;
  const errorCount = uploadingFiles.filter(f => f.status === 'error').length;
  const pendingCount = uploadingFiles.filter(f => f.status === 'pending' || f.status === 'uploading').length;

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Select Multiple Images'}
        </button>

        {successCount > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear completed ({successCount})
          </button>
        )}
      </div>

      {/* Status summary */}
      {uploadingFiles.length > 0 && (
        <div className="flex gap-4 text-sm">
          {pendingCount > 0 && (
            <span className="text-blue-600">
              <Loader2 className="h-4 w-4 inline animate-spin mr-1" />
              {pendingCount} uploading
            </span>
          )}
          {successCount > 0 && (
            <span className="text-green-600">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              {successCount} completed
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-red-600">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              {errorCount} failed
            </span>
          )}
        </div>
      )}

      {/* Upload queue */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {uploadingFiles.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-lg border-2 overflow-hidden ${
                item.status === 'success' ? 'border-green-400' :
                item.status === 'error' ? 'border-red-400' :
                item.status === 'uploading' ? 'border-blue-400' :
                'border-gray-300'
              }`}
            >
              <img
                src={item.preview}
                alt="Preview"
                className="w-full h-24 object-cover"
              />

              {/* Progress overlay */}
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-1" />
                    <span className="text-xs">{item.progress}%</span>
                  </div>
                </div>
              )}

              {/* Success overlay */}
              {item.status === 'success' && (
                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              )}

              {/* Error overlay */}
              {item.status === 'error' && (
                <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                  <div className="text-center p-1">
                    <AlertCircle className="h-6 w-6 text-red-600 mx-auto" />
                    <span className="text-xs text-red-800 block truncate">
                      {item.error}
                    </span>
                  </div>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFile(item.id)}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1"
              >
                <X className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulkImageUploader;
