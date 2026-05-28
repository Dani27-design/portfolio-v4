'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createBlog, updateBlog, deleteBlog } from '@/actions/blogs';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import type { Blog } from '@/types';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchBlogs = async () => {
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/blogs');
      if (!res.ok) throw new Error('Failed to load blogs');
      setBlogs(await res.json());
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    await deleteBlog(id);
    fetchBlogs();
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-white">Blogs</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-3 py-2 text-xs lg:px-4 lg:py-2 lg:text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Blog
        </button>
      </div>

      {fetchError && (
        <div className="flex items-center justify-between p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <span>{fetchError}</span>
          <button onClick={fetchBlogs} className="text-xs font-bold uppercase tracking-wider hover:text-red-300">Retry</button>
        </div>
      )}

      {(creating || editing) && (
        <BlogForm
          blog={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={() => { setEditing(null); setCreating(false); fetchBlogs(); }}
        />
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-850 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Order</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Title (EN)</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Slug</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Date</th>
              <th className="text-right px-4 py-3 text-slate-400 font-mono text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {blogs.map((b) => (
              <tr key={b.id} className="hover:bg-slate-750">
                <td className="px-4 py-3 text-slate-300">{b.order}</td>
                <td className="px-4 py-3 text-white font-medium">{b.title.en}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{b.slug}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{b.date}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(b)} className="p-1.5 text-slate-400 hover:text-cyan-400" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 text-slate-400 hover:text-red-400 ml-2" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No blogs found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="lg:hidden space-y-3">
        {blogs.map((b) => (
          <div key={b.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-white font-medium text-sm truncate">{b.title.en}</div>
                <div className="text-slate-400 text-xs mt-1 flex items-center gap-2">
                  <span className="font-mono truncate">{b.slug}</span>
                  <span className="text-slate-600">|</span>
                  <span>{b.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setEditing(b)} className="p-2 text-slate-400 hover:text-cyan-400" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(b.id)} className="p-2 text-slate-400 hover:text-red-400" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="text-center text-slate-500 py-8">No blogs found</div>
        )}
      </div>
    </div>
  );
}

function BlogForm({ blog, onClose, onSave }: { blog: Blog | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    slug: blog?.slug || '',
    titleEn: blog?.title.en || '',
    titleId: blog?.title.id || '',
    excerptEn: blog?.excerpt.en || '',
    excerptId: blog?.excerpt.id || '',
    content: blog?.content || '',
    date: blog?.date || new Date().toISOString().split('T')[0],
    order: blog?.order || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = {
        slug: form.slug,
        title: { en: form.titleEn, id: form.titleId },
        excerpt: { en: form.excerptEn, id: form.excerptId },
        content: form.content,
        date: form.date,
        order: form.order,
      };
      if (blog) {
        await updateBlog(blog.id, data);
      } else {
        await createBlog(data);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "bg-slate-900 border border-slate-600 rounded px-3 py-2.5 lg:py-2 text-sm text-white outline-none focus:border-cyan-500";

  return (
    <div className="mb-6 lg:mb-8 bg-slate-800 border border-slate-700 rounded-lg p-4 lg:p-6">
      <h2 className="text-lg font-bold text-white mb-4">{blog ? 'Edit' : 'Create'} Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 lg:hidden">Slug</label>
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="Slug (url-safe)" required className={inputClass + " w-full"} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 lg:hidden">Date</label>
            <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} type="date" className={inputClass + " w-full"} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 lg:hidden">Title (EN)</label>
            <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} placeholder="Title (EN)" required className={inputClass + " w-full"} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 lg:hidden">Title (ID)</label>
            <input value={form.titleId} onChange={e => setForm({...form, titleId: e.target.value})} placeholder="Title (ID)" required className={inputClass + " w-full"} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 lg:hidden">Excerpt (EN)</label>
            <textarea value={form.excerptEn} onChange={e => setForm({...form, excerptEn: e.target.value})} placeholder="Excerpt (EN)" rows={2} required className={inputClass + " w-full"} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 lg:hidden">Excerpt (ID)</label>
            <textarea value={form.excerptId} onChange={e => setForm({...form, excerptId: e.target.value})} placeholder="Excerpt (ID)" rows={2} required className={inputClass + " w-full"} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 lg:hidden">Order</label>
            <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} placeholder="Order" className={inputClass + " w-full"} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Content (Markdown)</label>
          <MarkdownEditor value={form.content} onChange={(v) => setForm({...form, content: v})} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
