'use client';

import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import { Bold, Italic, Heading1, Heading2, Code, List, Link2, ImagePlus, Eye, Edit3, Upload } from 'lucide-react';
import { uploadMedia, validateMediaFile } from '@/lib/upload';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  imageStoragePath?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, imageStoragePath }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) setMode('split');
  }, []);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector<HTMLTextAreaElement>('[data-md-editor]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${before}${selected || 'text'}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = document.querySelector<HTMLTextAreaElement>('[data-md-editor]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + text + value.substring(start);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + text.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !imageStoragePath) return;

    const error = validateMediaFile(file);
    if (error) {
      alert(error);
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadMedia(file, imageStoragePath);
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      insertAtCursor(`\n![${alt}](${url})\n`);
    } catch {
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
    { icon: Heading1, action: () => insertMarkdown('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertMarkdown('## '), title: 'Heading 2' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Inline Code' },
    { icon: List, action: () => insertMarkdown('- '), title: 'List' },
    { icon: Link2, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
  ];

  return (
    <div className="border border-slate-600 rounded bg-slate-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-600 bg-slate-850 flex-wrap gap-1">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.title}
              type="button"
              onClick={btn.action}
              title={btn.title}
              className="p-2 lg:p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <btn.icon className="w-4 h-4" />
            </button>
          ))}
          {imageStoragePath && (
            <>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload image"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
                title="Upload Image"
                className="p-2 lg:p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {uploading ? <Upload className="w-4 h-4 animate-pulse" /> : <ImagePlus className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`p-2 lg:p-1.5 rounded text-xs font-mono ${mode === 'edit' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`hidden lg:inline-flex p-1.5 rounded text-xs font-mono ${mode === 'split' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`p-2 lg:p-1.5 rounded text-xs font-mono ${mode === 'preview' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className={`${mode === 'split' ? 'grid grid-cols-2 divide-x divide-slate-600' : ''}`}>
        {(mode === 'edit' || mode === 'split') && (
          <textarea
            data-md-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Write markdown content...'}
            className="w-full min-h-[400px] p-4 bg-transparent text-slate-200 text-sm font-mono resize-y outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 placeholder:text-slate-600"
          />
        )}
        {(mode === 'preview' || mode === 'split') && (
          <div className="min-h-[400px] p-4 overflow-auto">
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 prose-headings:text-white prose-strong:text-cyan-400 prose-code:text-indigo-400 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
              {value ? <Markdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeSanitize]}>{value}</Markdown> : <p className="text-slate-600 italic">Preview will appear here...</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
