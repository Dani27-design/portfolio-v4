'use client';

import { useEffect, useState } from 'react';
import { FolderKanban, FileText, Briefcase, Cpu } from 'lucide-react';
import Link from 'next/link';

interface Counts {
  projects: number;
  blogs: number;
  experience: number;
  skills: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ projects: 0, blogs: 0, experience: 0, skills: 0 });

  useEffect(() => {
    fetch('/api/admin/counts')
      .then(res => res.ok ? res.json() : { projects: 0, blogs: 0, experience: 0, skills: 0 })
      .then(setCounts)
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Projects', count: counts.projects, icon: FolderKanban, href: '/en/admin/projects', color: 'text-cyan-400' },
    { label: 'Blogs', count: counts.blogs, icon: FileText, href: '/en/admin/blogs', color: 'text-indigo-400' },
    { label: 'Experience', count: counts.experience, icon: Briefcase, href: '/en/admin/experience', color: 'text-emerald-400' },
    { label: 'Skills', count: counts.skills, icon: Cpu, href: '/en/admin/skills', color: 'text-amber-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

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
