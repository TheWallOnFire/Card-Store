'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Library, 
  FileUp, 
  Settings, 
  Menu,
  X,
  Package,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this utility exists based on standard Next.js templates

const SidebarItem = ({ href, icon: Icon, label, active, collapsed }: { href: string, icon: any, label: string, active: boolean, collapsed: boolean }) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
      active 
        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "text-slate-400 group-hover:text-white")} />
    {!collapsed && <span className="font-bold text-sm tracking-tight">{label}</span>}
    {!collapsed && active && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </Link>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/games", icon: Gamepad2, label: "Manage Games" },
    { href: "/admin/inventory", icon: Library, label: "Inventory" },
    { href: "/admin/bulk-import", icon: FileUp, label: "Bulk Importer" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-900">
      {/* Admin Sidebar */}
      <aside className={cn(
        "h-screen sticky top-0 bg-slate-900 border-r border-slate-800 transition-all duration-500 flex flex-col pt-8 px-4 shrink-0 shadow-2xl z-50",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex items-center justify-between mb-12 px-2">
          {!isCollapsed && (
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Package className="text-white" size={18} />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-widest uppercase">Admin</h2>
              </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2.5">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href}
              {...item}
              active={pathname === item.href}
              collapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="mt-auto py-8">
          <div className="flex items-center gap-3 px-2 bg-slate-800/40 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">A</div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xs font-black text-white tracking-tight shrink-0">ADMIN PORTAL</span>
                <span className="text-[9px] text-blue-400 uppercase font-black tracking-widest mt-0.5 whitespace-nowrap">Systems Architect</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {children}
      </main>
    </div>
  );
}
