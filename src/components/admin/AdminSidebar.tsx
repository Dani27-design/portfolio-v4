'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PanelTop, FolderKanban, FileText, Briefcase, Cpu, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const locale = pathname.split('/')[1] || 'en';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const basePath = `/${locale}/admin`;
  const navItems = [
    { href: basePath, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${basePath}/site-content`, label: 'Site Content', icon: PanelTop },
    { href: `${basePath}/projects`, label: 'Projects', icon: FolderKanban },
    { href: `${basePath}/blogs`, label: 'Blogs', icon: FileText },
    { href: `${basePath}/experience`, label: 'Experience', icon: Briefcase },
    { href: `${basePath}/skills`, label: 'Skills', icon: Cpu },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== basePath && pathname.startsWith(href));

  return (
    <>
      {/* Desktop Sidebar — unchanged from original */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-700 min-h-screen">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Admin Panel</h1>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Content Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
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

      {/* Mobile Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 z-40 lg:hidden">
        <h1 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Admin</h1>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Slide-over Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Admin Panel</h2>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Content Management</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-3 border-t border-slate-700">
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3.5 rounded text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
