'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Film, GripVertical } from 'lucide-react';
import { uploadMedia, validateMediaFile, getMediaType, deleteImage } from '@/lib/upload';
import type { MediaItem } from '@/types';

interface MediaUploadProps {
  items: MediaItem[];
  storagePath: string;
  onChange: (items: MediaItem[]) => void;
  label: string;
}

export function MediaUpload({ items, storagePath, onChange, label }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');

    // Validate all files first
    for (const file of Array.from(files)) {
      const validationError = validateMediaFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploading(true);
    try {
      const newItems: MediaItem[] = [];
      const startOrder = items.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url, storagePath: path } = await uploadMedia(file, storagePath);
        newItems.push({
          url,
          type: getMediaType(file),
          storagePath: path,
          order: startOrder + i,
        });
      }

      onChange([...items, ...newItems]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const item = items[index];
    if (item.storagePath) {
      await deleteImage(item.storagePath);
    }
    const updated = items
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order: i }));
    onChange(updated);
  };

  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const dragIndex = dragItemIndex.current;
    if (dragIndex === null || dragIndex === dropIndex) return;

    const updated = [...items];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, dragged);
    onChange(updated.map((item, i) => ({ ...item, order: i })));
    dragItemIndex.current = null;
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
    dragItemIndex.current = null;
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">{label}</label>

      {/* Media grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group bg-slate-900 border rounded-lg overflow-hidden aspect-video ${
                dragOverIndex === index ? 'border-cyan-500 ring-1 ring-cyan-500/30' : 'border-slate-600'
              }`}
            >
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                  aria-label={`Media ${index + 1}`}
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Type badge */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {item.type === 'video' ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                {item.type === 'video' ? 'VID' : 'IMG'}
              </div>

              {/* Drag handle */}
              <div className="absolute top-1.5 right-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-black/60 text-white p-1 rounded">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={uploading}
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 text-white p-1 rounded"
                aria-label={`Remove media ${index + 1}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload input */}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600 file:cursor-pointer file:transition-colors disabled:opacity-50"
        />
        {uploading && (
          <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold shrink-0">
            <Upload className="w-3.5 h-3.5 animate-pulse" />
            Uploading...
          </span>
        )}
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}

      {items.length === 0 && !uploading && (
        <div className="text-xs text-slate-500">No media uploaded yet. Select images or videos to upload.</div>
      )}
    </div>
  );
}
