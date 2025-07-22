import React, { useState, useRef } from 'react';
import { UploadIcon } from '../icons';
import Image from 'next/image';


interface ImageUploadProps {
  label?: string;
  maxFiles?: number;
  onImagesChange?: (images: File[]) => void;
  error?: string;
  required?: boolean;
}

export function ImageUpload({ 
  label, 
  maxFiles = 1, 
  onImagesChange, 
  error,
  required = false 
}: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    let newImages: File[];
    if (maxFiles === 1) {
      newImages = validImages.slice(0, 1);
    } else {
      const remainingSlots = maxFiles - selectedImages.length;
      newImages = [...selectedImages, ...validImages.slice(0, remainingSlots)];
    }
    
    setSelectedImages(newImages);
    onImagesChange?.(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    onImagesChange?.(newImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleUploadClick}
          className="flex items-center gap-2.5 h-[45px] w-[154px] px-3 border border-[var(--input-border)] bg-[var(--input-background)] rounded-lg hover:border-[rgba(255,91,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(255,91,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        >
          <UploadIcon />
          <span className="text-[var(--input-text)] font-source-sans-pro text-sm font-medium">
            Upload image{maxFiles > 1 ? 's' : ''}
          </span>
        </button>
        
        {required && <span className="text-[var(--input-required)] text-sm"></span>}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        onChange={handleFileSelect}
        className="hidden"
        aria-label={label}
      />

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Selected ${index + 1}`}
                width={200}
                height={96}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Info */}
      <p className="text-[#7A7A7A] font-source-sans-pro text-sm">
        {maxFiles > 1 
          ? `You can upload up to ${maxFiles} images. ${selectedImages.length}/${maxFiles} selected.`
          : selectedImages.length > 0 
            ? "1 image selected."
            : "No image selected."
        }
      </p>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}