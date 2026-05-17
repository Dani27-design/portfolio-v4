'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createSkillGroup, updateSkillGroup, deleteSkillGroup } from '@/actions/skills';
import type { SkillGroup } from '@/types';

export default function AdminSkillsPage() {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editing, setEditing] = useState<SkillGroup | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchGroups = async () => {
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/skills');
      if (!res.ok) throw new Error('Failed to load skills');
      setGroups(await res.json());
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill group?')) return;
    await deleteSkillGroup(id);
    fetchGroups();
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Group
        </button>
      </div>

      {fetchError && (
        <div className="flex items-center justify-between p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <span>{fetchError}</span>
          <button onClick={fetchGroups} className="text-xs font-bold uppercase tracking-wider hover:text-red-300">Retry</button>
        </div>
      )}

      {(creating || editing) && (
        <SkillForm
          group={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={() => { setEditing(null); setCreating(false); fetchGroups(); }}
        />
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-850 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Order</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Title (EN)</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Skills</th>
              <th className="text-right px-4 py-3 text-slate-400 font-mono text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {groups.map((g) => (
              <tr key={g.id} className="hover:bg-slate-750">
                <td className="px-4 py-3 text-slate-300">{g.order}</td>
                <td className="px-4 py-3 text-white font-medium">{g.title.en}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{g.skills.map(s => s.name).join(', ')}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(g)} className="p-1.5 text-slate-400 hover:text-cyan-400" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(g.id)} className="p-1.5 text-slate-400 hover:text-red-400 ml-2" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No skill groups found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkillForm({ group, onClose, onSave }: { group: SkillGroup | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    titleEn: group?.title.en || '',
    titleId: group?.title.id || '',
    contextEn: group?.context.en || '',
    contextId: group?.context.id || '',
    skills: group?.skills.map(s => `${s.name}:${s.tag}`).join('\n') || '',
    order: group?.order || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const skills = form.skills.split('\n').filter(Boolean).map(line => {
        const [name, tag] = line.split(':').map(s => s.trim());
        return { name: name || '', tag: tag || '' };
      });
      const data = {
        title: { en: form.titleEn, id: form.titleId },
        context: { en: form.contextEn, id: form.contextId },
        skills,
        order: form.order,
      };
      if (group) {
        await updateSkillGroup(group.id, data);
      } else {
        await createSkillGroup(data);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">{group ? 'Edit' : 'Create'} Skill Group</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {error && <div className="md:col-span-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>}
        <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} placeholder="Title (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.titleId} onChange={e => setForm({...form, titleId: e.target.value})} placeholder="Title (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <textarea value={form.contextEn} onChange={e => setForm({...form, contextEn: e.target.value})} placeholder="Context (EN)" rows={2} className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <textarea value={form.contextId} onChange={e => setForm({...form, contextId: e.target.value})} placeholder="Context (ID)" rows={2} className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Skills (one per line, format: Name:TAG)</label>
          <textarea value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="TypeScript:STRICT&#10;Node.js:RUNTIME" rows={5} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500" />
        </div>
        <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} placeholder="Order" className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
