'use client';

import React from 'react';
import { 
  Gamepad2, 
  Library, 
  TrendingUp,
  AlertCircle,
  Users,
  ChevronRight,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardService } from '@/services/cardService';

// --- SUB-COMPONENTS ---

const DashboardCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string, icon: React.ElementType, color: string, trend?: string }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
        <div className="flex items-center justify-between mb-6">
            <div className={cn("p-3.5 rounded-2xl shadow-lg", color)}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
                    <ArrowUpRight size={12} /> {trend}
                </span>
            )}
        </div>
        <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{title}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
        </div>
    </div>
);

const StatsGrid = ({ stats }: { stats: { totalCards: number, activeGames: number, marketValue: number, loading: boolean } }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <DashboardCard 
            title="Catalog Size" 
            value={stats.totalCards.toLocaleString()} 
            icon={Library} 
            color="bg-blue-600" 
            trend={stats.loading ? undefined : "+1.2%"} 
        />
        <DashboardCard 
            title="Active Titles" 
            value={stats.activeGames.toString()} 
            icon={Gamepad2} 
            color="bg-emerald-600" 
        />
        <DashboardCard 
            title="Market Value" 
            value={`$${(stats.marketValue / 1000).toFixed(1)}k`} 
            icon={TrendingUp} 
            color="bg-indigo-600" 
            trend={stats.loading ? undefined : "+4.5%"} 
        />
        <DashboardCard title="Alerts" value="0" icon={AlertCircle} color="bg-amber-500" />
    </div>
);

const DatabaseLogView = () => (
    <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Database Operations</h3>
                <p className="text-xs text-slate-400 font-medium">Audit logs for the last 24 hours.</p>
            </div>
            <button className="text-[10px] font-black uppercase text-blue-600 tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">See all logs</button>
        </div>
        
        <div className="space-y-8">
            {[
                { op: "Bulk Importer", details: "Inventory sync via Paste Tool", qty: "+342 Cards", time: "2m ago", user: "Admin (Self)", color: "text-emerald-500" },
                { op: "Price Update", details: "Market data refresh (Pokémon)", qty: "1.2k IDs", time: "14m ago", user: "System", color: "text-blue-500" },
                { op: "Catalog Edit", details: "Updated metadata for LOB-001", qty: "Modified", time: "1h ago", user: "Staff #42", color: "text-amber-500" },
                { op: "New Game Registry", details: "Added Disney Lorcana TCG", qty: "Success", time: "4h ago", user: "Admin", color: "text-indigo-500" },
            ].map((row, i) => (
                <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0 group">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all text-xs">#{i+1}</div>
                        <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">{row.op}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{row.details} · <span className="text-slate-300">{row.user}</span></p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest leading-none", row.color)}>{row.qty}</span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1.5">{row.time}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AccessControlPanel = () => (
    <div className="bg-slate-900 rounded-[32px] p-10 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <Users size={160} />
        </div>
        <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Access Control</h3>
            <p className="text-4xl font-black tracking-tighter mb-8 leading-none">12 Staff Members</p>
            <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">
                    <span>Core Admin</span>
                    <span className="text-white">4</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">
                    <span>Catalog Staff</span>
                    <span className="text-white">8</span>
                </div>
            </div>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black tracking-widest uppercase border border-white/10 flex items-center justify-center gap-2">
                Manage Permissions <ChevronRight size={14} />
            </button>
        </div>
    </div>
);

const SystemHealthPanel = () => (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-2 opacity-50">Storage Health</h3>
        <p className="text-4xl font-black tracking-tighter mb-4 leading-none">94.2%</p>
        <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
            <div className="w-[94.2%] h-full bg-emerald-400 rounded-full"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 opacity-50">784GB / 800GB Used</p>
    </div>
);

// --- MAIN PAGE ---

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({
    totalCards: 0,
    activeGames: 0,
    marketValue: 0,
    loading: true
  });

  React.useEffect(() => {
    cardService.getCards().then(cards => {
        const uniqueGames = new Set(cards.map(c => c.game)).size;
        const totalValue = cards.reduce((acc, c) => acc + (c.marketPrice || 0), 0);
        setStats({
            totalCards: cards.length,
            activeGames: uniqueGames,
            marketValue: totalValue,
            loading: false
        });
    });
  }, []);

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">System Overview</h1>
                <p className="text-slate-500 font-medium text-sm mt-2 flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" />
                    Last database sync: <span className="font-bold text-slate-700">{stats.loading ? 'Syncing...' : '2 minutes ago'}</span>
                </p>
            </div>
            <div className="flex gap-4">
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black tracking-widest uppercase text-[10px] hover:bg-slate-50 transition-all shadow-sm">
                    Export Audit Logs
                </button>
            </div>
        </div>
        
        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <DatabaseLogView />
            <div className="space-y-8">
                <AccessControlPanel />
                <SystemHealthPanel />
            </div>
        </div>
    </div>
  );
}
