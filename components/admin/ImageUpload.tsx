'use client';

import { useState } from 'react';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    // Free ImgBB API key - you should get your own at https://api.imgbb.com/
    const apiKey = '18852b1168d5a15d4436d901d6119d82'; // Replace with your own key

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error('Upload failed');
    }

    return data.data.url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (max 32MB)
        if (file.size > 32 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 32MB)`);
          continue;
        }

        toast.loading(`Uploading ${file.name}...`, { id: file.name });

        try {
          const url = await uploadToImgBB(file);
          uploadedUrls.push(url);
          toast.success(`${file.name} uploaded!`, { id: file.name });
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`, { id: file.name });
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } finally {
      setUploading(false);
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    onChange([...images, '']);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove from old position
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(index, 0, draggedImage);

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <label htmlFor="image-upload">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors cursor-pointer">
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-neutral-600">
                <Loader2 size={24} className="animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div>
                <Upload size={32} className="mx-auto text-neutral-400 mb-2" />
                <p className="text-neutral-700 font-medium mb-1">
                  Click to upload images
                </p>
                <p className="text-sm text-neutral-500">
                  PNG, JPG, GIF up to 32MB each
                </p>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Image Previews & URL Inputs */}
      <div className="space-y-3">
        {images.map((image, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex gap-2 items-start group transition-all ${
              draggedIndex === index ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {/* Drag Handle */}
            <div className="flex items-center justify-center w-8 h-20 cursor-move text-neutral-400 hover:text-neutral-600 transition-colors">
              <GripVertical size={20} />
            </div>

            {/* Preview */}
            {image && (
              <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {/* Order Badge */}
                <div className="absolute top-1 left-1 bg-neutral-900 text-white text-xs font-semibold px-2 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            )}

            {/* URL Input */}
            <input
              type="url"
              value={image}
              onChange={(e) => updateImage(index, e.target.value)}
              placeholder="Or paste image URL here"
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />

            {/* Remove Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-3 text-neutral-600 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <p className="text-xs text-neutral-500 italic">
          Drag and drop images to reorder them. The first image will be the main product image.
        </p>
      )}

      {/* Add URL Button */}
      <button
        type="button"
        onClick={addImageUrl}
        className="text-sm text-neutral-600 hover:text-neutral-900 underline"
      >
        + Add image URL manually
      </button>
    </div>
  );
}
