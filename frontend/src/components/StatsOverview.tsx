import React from 'react';
import { CircleDollarSign, LockKeyhole, ShieldCheck } from 'lucide-react';

interface StatsOverviewProps {
  totalSaved: number;
  activeVaultsCount: number;
  completedVaultsCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalSaved,
  activeVaultsCount,
  completedVaultsCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
          <CircleDollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Saved</p>
          <p className="text-2xl font-bold text-white mt-0.5">{totalSaved.toLocaleString()} XLM</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Vaults</p>
          <p className="text-2xl font-bold text-white mt-0.5">{activeVaultsCount}</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center gap-4">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Goals</p>
          <p className="text-2xl font-bold text-white mt-0.5">{completedVaultsCount}</p>
        </div>
      </div>
    </div>
  );
};
