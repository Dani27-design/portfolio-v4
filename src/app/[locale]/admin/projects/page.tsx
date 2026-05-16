'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createProject, updateProject, deleteProject } from '@/actions/projects';
import type { Project } from '@/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch('/api/admin/projects');
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    fetchProjects();
  };

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {(creating || editing) && (
        <ProjectForm
          project={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={() => { setEditing(null); setCreating(false); fetchProjects(); }}
        />
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-850 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Order</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Name (EN)</th>
              <th className="text-left px-4 py-3 text-slate-400 font-mono text-xs uppercase">Status</th>
              <th className="text-right px-4 py-3 text-slate-400 font-mono text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-750">
                <td className="px-4 py-3 text-slate-300">{p.order}</td>
                <td className="px-4 py-3 text-white font-medium">{p.name.en}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.status}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="p-1.5 text-slate-400 hover:text-cyan-400"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-400 ml-2"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No projects found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectForm({ project, onClose, onSave }: { project: Project | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    nameEn: project?.name.en || '',
    nameId: project?.name.id || '',
    descEn: project?.desc.en || '',
    descId: project?.desc.id || '',
    tech: project?.tech.join(', ') || '',
    version: project?.version || '',
    status: project?.status || 'PRODUCTION',
    order: project?.order || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      name: { en: form.nameEn, id: form.nameId },
      desc: { en: form.descEn, id: form.descId },
      tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
      version: form.version,
      status: form.status,
      order: form.order,
    };
    if (project) {
      await updateProject(project.id, data);
    } else {
      await createProject(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white mb-4">{project ? 'Edit' : 'Create'} Project</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} placeholder="Name (EN)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.nameId} onChange={e => setForm({...form, nameId: e.target.value})} placeholder="Name (ID)" required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <textarea value={form.descEn} onChange={e => setForm({...form, descEn: e.target.value})} placeholder="Description (EN)" rows={3} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <textarea value={form.descId} onChange={e => setForm({...form, descId: e.target.value})} placeholder="Description (ID)" rows={3} required className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.tech} onChange={e => setForm({...form, tech: e.target.value})} placeholder="Tech (comma-separated)" className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.version} onChange={e => setForm({...form, version: e.target.value})} placeholder="Version" className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input value={form.status} onChange={e => setForm({...form, status: e.target.value})} placeholder="Status" className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} placeholder="Order" className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-sm font-bold rounded">{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
