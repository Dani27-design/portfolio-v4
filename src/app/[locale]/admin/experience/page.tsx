'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createExperience, updateExperience, deleteExperience } from '@/actions/experience';
import type { ExperienceItem } from '@/types';

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchItems = async () => {
    const res = await fetch('/api/admin/experience');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return;
    await deleteExperience(id);
    fetchItems();
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Experience</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {(creating || editing) && (
        <ExperienceForm
          item={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={() => { setEditing(null); setCreating(false); fetchItems(); }}
        />
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-850 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Order</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Title (EN)</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Company</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Period</th>
              <th className="text-right px-4 py-3 text-slate-400 font-mono text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-750">
                <td className="px-4 py-3 text-slate-300">{item.order}</td>
                <td className="px-4 py-3 text-white font-medium">{item.title.en}</td>
                <td className="px-4 py-3 text-slate-400">{item.company}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{item.period.en}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(item)} className="p-1.5 text-slate-400 hover:text-cyan-400"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-400 ml-2"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No experience entries found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExperienceForm({ item, onClose, onSave }: { item: ExperienceItem | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    titleEn: item?.title.en || '',
    titleId: item?.title.id || '',
    company: item?.company || '',
    periodEn: item?.period.en || '',
    periodId: item?.period.id || '',
    pointsEn: item?.points.en.join('\n') || '',
    pointsId: item?.points.id.join('\n') || '',
    isCurrent: item?.isCurrent || false,
    order: item?.order || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      title: { en: form.titleEn, id: form.titleId },
      company: form.company,
      period: { en: form.periodEn, id: form.periodId },
      points: {
        en: form.pointsEn.split('\n').filter(Boolean),
        id: form.pointsId.split('\n').filter(Boolean),
      },
      isCurrent: form.isCurrent,
      order: form.order,
    };
    if (item) {
      await updateExperience(item.id, data);
    } else {
      await createExperience(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">{item ? 'Edit' : 'Create'} Experience</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} placeholder="Title (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.titleId} onChange={e => setForm({...form, titleId: e.target.value})} placeholder="Title (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} placeholder="Order" className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.periodEn} onChange={e => setForm({...form, periodEn: e.target.value})} placeholder="Period (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.periodId} onChange={e => setForm({...form, periodId: e.target.value})} placeholder="Period (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <textarea value={form.pointsEn} onChange={e => setForm({...form, pointsEn: e.target.value})} placeholder="Points EN (one per line)" rows={4} className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <textarea value={form.pointsId} onChange={e => setForm({...form, pointsId: e.target.value})} placeholder="Points ID (one per line)" rows={4} className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={form.isCurrent} onChange={e => setForm({...form, isCurrent: e.target.checked})} className="rounded" />
          Current position
        </label>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
