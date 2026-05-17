'use client';

import { useEffect, useState, useCallback } from 'react';
import { FolderKanban, FileText, Briefcase, Cpu, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Counts {
  projects: number;
  blogs: number;
  experience: number;
  skills: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ projects: 0, blogs: 0, experience: 0, skills: 0 });
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const basePath = `/${locale}/admin`;

  const fetchCounts = useCallback(() => {
    setError(null);
    fetch('/api/admin/counts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load counts');
        return res.json();
      })
      .then(setCounts)
      .catch((err) => setError(err.message || 'Failed to load counts'));
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const cards = [
    { label: 'Projects', count: counts.projects, icon: FolderKanban, href: `${basePath}/projects`, color: 'text-cyan-400' },
    { label: 'Blogs', count: counts.blogs, icon: FileText, href: `${basePath}/blogs`, color: 'text-indigo-400' },
    { label: 'Experience', count: counts.experience, icon: Briefcase, href: `${basePath}/experience`, color: 'text-emerald-400' },
    { label: 'Skills', count: counts.skills, icon: Cpu, href: `${basePath}/skills`, color: 'text-amber-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {error && (
        <div className="flex items-center justify-between p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
          <button onClick={fetchCounts} className="text-xs font-bold uppercase tracking-wider hover:text-red-300 transition-colors">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-3xl font-bold text-white">{card.count}</span>
            </div>
            <p className="text-sm text-slate-400 font-medium group-hover:text-slate-300">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
