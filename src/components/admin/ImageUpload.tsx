'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/upload';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

interface ImageUploadProps {
  currentUrl?: string;
  storagePath: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label: string;
}

export function ImageUpload({ currentUrl, storagePath, onUpload, onRemove, label }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || currentUrl;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError('');

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Only PNG, JPEG, and WebP images are allowed.');
      return;
    }

    if (selected.size > MAX_SIZE) {
      setError('Image must be smaller than 2MB.');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, storagePath);
      onUpload(url);
      setFile(null);
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    onRemove();
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">{label}</label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-900 border border-slate-600 rounded flex items-center justify-center overflow-hidden shrink-0">
          {displayUrl ? (
            <img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-600" />
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600 file:cursor-pointer file:transition-colors"
          />

          <div className="flex gap-2">
            {file && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-xs font-bold rounded transition-colors"
              >
                <Upload className="w-3 h-3" />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
            {(currentUrl || preview) && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-slate-300 text-xs font-bold rounded transition-colors"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            )}
          </div>

          {error && (
            <div className="text-xs text-red-400">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
