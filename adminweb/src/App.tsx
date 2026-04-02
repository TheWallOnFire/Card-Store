import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Library, 
  FileUp, 
  Settings, 
  Menu,
  X,
  TrendingUp,
  Users,
  Package,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Feature Pages
import { GamesPage } from '@/features/games/GamesPage';
import { InventoryPage } from '@/features/inventory/InventoryPage';
import { BulkImportPage } from '@/features/import/BulkImportPage';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DashboardCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl", color)}>
                <Icon size={20} className="text-white" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Updates</span>
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
);

const Dashboard = () => (
    <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time metrics for your TCG marketplace.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard title="Total Inventory" value="12,402" icon={Package} color="bg-blue-600" />
            <DashboardCard title="Active Games" value="4" icon={Gamepad2} color="bg-emerald-600" />
            <DashboardCard title="Market Value" value="$84.2k" icon={TrendingUp} color="bg-indigo-600" />
            <DashboardCard title="System Alerts" value="2" icon={AlertCircle} color="bg-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Recent Marketplace Activity</h3>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">#{i}</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Bulk Import via CSV</p>
                                    <p className="text-xs text-slate-400">Inventory update · 2m ago</p>
                                </div>
                            </div>
                            <span className="text-xs font-black text-emerald-600 uppercase">+240 Cards</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                    <Users size={120} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Team Statistics</h3>
                <p className="text-4xl font-black mb-6">12 Admins</p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-sm font-bold border border-white/10">Manage Roles</button>
            </div>
        </div>
    </div>
);

const SettingsPage = () => (
    <div className="max-w-6xl mx-auto py-8 px-6 text-center">
        <div className="py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
            <Settings className="mx-auto text-slate-200 mb-6" size={64} />
            <h1 className="text-2xl font-black text-slate-900">Admin Settings</h1>
            <p className="text-slate-500 max-w-sm mx-auto mt-2 italic font-medium">Configuring global system parameters. Under construction.</p>
        </div>
    </div>
);

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
      active 
        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "text-slate-400 group-hover:text-white")} />
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/games", icon: Gamepad2, label: "Games" },
    { to: "/inventory", icon: Library, label: "Inventory" },
    { to: "/import", icon: FileUp, label: "Bulk Import" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className={cn(
      "h-screen bg-slate-900 border-r border-slate-800 transition-all duration-500 flex flex-col pt-8 px-4 shrink-0 shadow-2xl z-40 relative",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between mb-12 px-2">
        {isOpen && (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Package className="text-white" size={18} />
                </div>
                <h2 className="text-xl font-black text-white tracking-widest uppercase">Admin</h2>
            </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <nav className="flex-1 space-y-2.5">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.to}
            {...item}
            active={location.pathname === item.to}
          />
        ))}
      </nav>

      <div className="mt-auto py-8">
        <div className="flex items-center gap-3 px-2 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">A</div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-xs font-black text-white tracking-tight">ADMIN PORTAL</span>
              <span className="text-[9px] text-blue-400 uppercase font-black tracking-widest mt-0.5">Systems Architect</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/import" element={<BulkImportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
