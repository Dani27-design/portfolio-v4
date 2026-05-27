'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PanelTop, FolderKanban, FileText, Briefcase, Cpu, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const locale = pathname.split('/')[1] || 'en';

  const basePath = `/${locale}/admin`;
  const navItems = [
    { href: basePath, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${basePath}/site-content`, label: 'Site Content', icon: PanelTop },
    { href: `${basePath}/projects`, label: 'Projects', icon: FolderKanban },
    { href: `${basePath}/blogs`, label: 'Blogs', icon: FileText },
    { href: `${basePath}/experience`, label: 'Experience', icon: Briefcase },
    { href: `${basePath}/skills`, label: 'Skills', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Admin Panel</h1>
        <p className="text-[10px] font-mono text-slate-400 mt-1">Content Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== basePath && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
