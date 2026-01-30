/**
 * Image Compression Service
 * 
 * Handles client-side image compression using browser-image-compression library.
 * Compresses images before upload to reduce file size and improve upload speed.
 */

import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;           // Maximum file size in MB (default: 2)
  maxWidthOrHeight?: number;    // Maximum width or height in pixels (default: 2048)
  quality?: number;             // Image quality 0-1 (default: 0.8)
  useWebWorker?: boolean;       // Use web worker for non-blocking compression (default: true)
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;     // Percentage reduction (e.g., 75 means 75% smaller)
}

// Default compression options - optimized for web viewing
const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 2,
  maxWidthOrHeight: 2048,
  quality: 0.8,
  useWebWorker: true,
};

// Threshold: Only compress files larger than this (in bytes)
const COMPRESSION_THRESHOLD = 9 * 1024 * 1024; // 9MB

/**
 * Check if a file should be compressed based on size
 */
export const shouldCompress = (file: File): boolean => {
  return file.size > COMPRESSION_THRESHOLD;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Compress an image file
 * 
 * @param file - The image file to compress
 * @param options - Compression options (optional)
 * @param onProgress - Progress callback (0-100)
 * @returns CompressionResult with compressed file and size info
 */
export const compressImage = async (
  file: File,
  options?: CompressionOptions,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> => {
  const originalSize = file.size;
  
  // Merge with default options
  const compressionOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // If file is already small enough, skip compression
  if (!shouldCompress(file) && file.size <= (compressionOptions.maxSizeMB || 2) * 1024 * 1024) {
    return {
      compressedFile: file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
    };
  }

  try {
    const compressedBlob = await imageCompression(file, {
      maxSizeMB: compressionOptions.maxSizeMB,
      maxWidthOrHeight: compressionOptions.maxWidthOrHeight,
      useWebWorker: compressionOptions.useWebWorker,
      onProgress: onProgress,
      // Preserve file type when possible
      fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp' | undefined,
    });

    // Convert Blob back to File to preserve filename
    const compressedFile = new File(
      [compressedBlob],
      file.name,
      { type: compressedBlob.type }
    );

    const compressedSize = compressedFile.size;
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    return {
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio: Math.max(0, compressionRatio), // Ensure non-negative
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return {
      compressedFile: file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
    };
  }
};

/**
 * Compress multiple images in sequence
 * 
 * @param files - Array of image files to compress
 * @param options - Compression options (optional)
 * @param onFileProgress - Callback for each file's progress (fileIndex, progress)
 * @returns Array of CompressionResults
 */
export const compressImages = async (
  files: File[],
  options?: CompressionOptions,
  onFileProgress?: (fileIndex: number, progress: number) => void
): Promise<CompressionResult[]> => {
  const results: CompressionResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await compressImage(
      files[i],
      options,
      (progress) => onFileProgress?.(i, progress)
    );
    results.push(result);
  }

  return results;
};
