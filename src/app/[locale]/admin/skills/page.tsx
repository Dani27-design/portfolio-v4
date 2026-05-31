'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminToast, type Toast } from '@/components/admin/AdminToast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createSkillGroup, updateSkillGroup, deleteSkillGroup } from '@/actions/skills';
import type { SkillGroup } from '@/types';

export default function AdminSkillsPage() {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editing, setEditing] = useState<SkillGroup | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

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
      <AdminToast toast={toast} onDismiss={dismissToast} />
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-white">Skills</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-3 py-2 text-xs lg:px-4 lg:py-2 lg:text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors"
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
          onSave={(msg) => { setEditing(null); setCreating(false); setToast({ type: 'success', message: msg }); fetchGroups(); }}
          onError={(msg) => setToast({ type: 'error', message: msg })}
        />
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
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

      {/* Mobile Card List */}
      <div className="lg:hidden space-y-3">
        {groups.map((g) => (
          <div key={g.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-white font-medium text-sm truncate">{g.title.en}</div>
                <div className="text-slate-400 text-xs mt-1 line-clamp-1">{g.skills.map(s => s.name).join(', ')}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setEditing(g)} className="p-2 text-slate-400 hover:text-cyan-400" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(g.id)} className="p-2 text-slate-400 hover:text-red-400" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-center text-slate-500 py-8">No skill groups found</div>
        )}
      </div>
    </div>
  );
}

function SkillForm({ group, onClose, onSave, onError }: { group: SkillGroup | null; onClose: () => void; onSave: (msg: string) => void; onError: (msg: string) => void }) {
  const [form, setForm] = useState({
    titleEn: group?.title.en || '',
    titleId: group?.title.id || '',
    contextEn: group?.context.en || '',
    contextId: group?.context.id || '',
    skills: group?.skills.map(s => `${s.name}:${s.tag}`).join('\n') || '',
    order: group?.order || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      onSave(group ? 'Skill group updated successfully' : 'Skill group created successfully');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "bg-slate-900 border border-slate-600 rounded px-3 py-2.5 lg:py-2 text-sm text-white outline-none focus:border-cyan-500";

  return (
    <div className="mb-6 lg:mb-8 bg-slate-800 border border-slate-700 rounded-lg p-4 lg:p-6">
      <h2 className="text-lg font-bold text-white mb-4">{group ? 'Edit' : 'Create'} Skill Group</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1 lg:hidden">Title (EN)</label>
          <input value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} placeholder="Title (EN)" required className={inputClass + " w-full"} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 lg:hidden">Title (ID)</label>
          <input value={form.titleId} onChange={e => setForm({...form, titleId: e.target.value})} placeholder="Title (ID)" required className={inputClass + " w-full"} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 lg:hidden">Context (EN)</label>
          <textarea value={form.contextEn} onChange={e => setForm({...form, contextEn: e.target.value})} placeholder="Context (EN)" rows={2} className={inputClass + " w-full"} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 lg:hidden">Context (ID)</label>
          <textarea value={form.contextId} onChange={e => setForm({...form, contextId: e.target.value})} placeholder="Context (ID)" rows={2} className={inputClass + " w-full"} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Skills (one per line, format: Name:TAG)</label>
          <textarea value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder={"TypeScript:STRICT\nNode.js:RUNTIME"} rows={5} className={inputClass + " w-full font-mono"} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 lg:hidden">Order</label>
          <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} placeholder="Order" className={inputClass + " w-full"} />
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
          <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 lg:py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
