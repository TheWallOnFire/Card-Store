import React from 'react';
import { Metadata } from 'next';
import { 
  BarChart3, 
  Package, 
  Settings, 
  Wallet, 
  TrendingUp, 
  History, 
  Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QuickAddForm } from '@/features/inventory/QuickAddForm';

export const metadata: Metadata = {
  title: 'Seller Dashboard | TCG Marketplace',
  description: 'Manage your card inventory, sales, and analytics.',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 italic uppercase">
              Command Center
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Market Synchronization Active
            </p>
          </div>
          <div className="flex gap-4">
             <Button className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold italic uppercase transition-all shadow-xl shadow-slate-200">
                <Settings className="w-4 h-4 mr-2" />
                Settings
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <DashboardStat 
             icon={Wallet} 
             label="Net Revenue" 
             value="$1,240.50" 
             trend="+12.5%" 
             color="blue" 
           />
           <DashboardStat 
             icon={Package} 
             label="Active Listings" 
             value="42" 
             trend="Stable" 
             color="slate" 
           />
           <DashboardStat 
             icon={TrendingUp} 
             label="Inventory Value" 
             value="$3,850.00" 
             trend="+4.2%" 
             color="green" 
           />
           <DashboardStat 
             icon={BarChart3} 
             label="Total Views" 
             value="850" 
             trend="+240 today" 
             color="purple" 
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
           {/* Left: Inventory Management */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <Plus className="w-48 h-48 rotate-12" />
                </div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Quick Inventory Addition</h2>
                        <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                           Direct-to-Market
                        </Badge>
                    </div>
                    <QuickAddForm />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
                        <History className="w-6 h-6 text-blue-600" />
                        Logistics & History
                    </h2>
                    <Button variant="ghost" className="text-xs font-black uppercase tracking-widest hover:text-blue-600">View Full Ledger <ChevronRight className="w-3 h-3 ml-1" /></Button>
                 </div>
                 <div className="space-y-4">
                    <ActivityItem label="Sold: Black Lotus (Mint)" price="+$145.00" date="2h ago" type="sale" />
                    <ActivityItem label="Listed: Charizard (Base Set)" price="Pending" date="5h ago" type="list" />
                    <ActivityItem label="Price Drop: Mox Diamond" price="-$12.00" date="1d ago" type="update" />
                 </div>
              </div>
           </div>

           {/* Right: Insights */}
           <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-200 overflow-hidden relative">
                 <div className="absolute bottom-0 right-0 p-4 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                 </div>
                 <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4 text-blue-400">Market Opportunity</h3>
                 <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6">
                    Mox Diamond is currently trending up by 15%. Consider listing your copies for a competitive advantage.
                 </p>
                 <Button className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest py-6 text-xs transition-all shadow-lg shadow-blue-900/40">
                    Optimize My Inventory
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({ icon: Icon, label, value, trend, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm group hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-slate-200/50">
      <div className={`p-3 rounded-2xl inline-block mb-4 ${colorMap[color]}`}>
         <Icon className="w-6 h-6" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end gap-3">
         <p className="text-3xl font-black tracking-tighter text-slate-900 leading-none">{value}</p>
         <span className="text-[10px] font-black text-green-500 mb-0.5 uppercase tracking-tighter">{trend}</span>
      </div>
    </div>
  );
}

function ActivityItem({ label, price, date, type }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white transition-all hover:shadow-md cursor-pointer border border-transparent hover:border-slate-100 group">
       <div className="flex items-center gap-4">
          <div className={`w-2 h-12 rounded-full ${type === 'sale' ? 'bg-green-500' : 'bg-blue-500'} opacity-20`} />
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{label}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{date}</p>
          </div>
       </div>
       <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">{price}</p>
    </div>
  );
}
