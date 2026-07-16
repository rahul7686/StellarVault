import React from 'react';
import { Lock, Unlock, TrendingUp, ShieldCheck, Zap, Award } from 'lucide-react';
import { Vault } from '../types/vault';

interface DashboardStatsProps {
  vaults: Vault[];
  totalSaved: number;
  penaltiesCollected: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  vaults,
  totalSaved,
  penaltiesCollected,
}) => {
  const activeVaults = vaults.filter((v) => v.isActive);
  const completedVaults = vaults.filter((v) => !v.isActive);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {/* Total Saved TVL Card */}
      <div className="glass-panel p-6 relative overflow-hidden group border border-[#00f2fe]/30 hover:border-[#00f2fe] transition-all">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#00f2fe]/15 rounded-full blur-2xl group-hover:bg-[#00f2fe]/30 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a8b3cf]">
            Total Locked TVL
          </span>
          <div className="p-2.5 rounded-2xl bg-[#00f2fe]/15 border border-[#00f2fe]/40 text-[#00f2fe] shadow-lg shadow-[#00f2fe]/20 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white flex items-baseline gap-2">
          <span className="animated-shimmer-text">{totalSaved.toLocaleString()}</span>
          <span className="text-xs font-mono font-semibold text-[#00f2fe] bg-[#00f2fe]/10 px-2 py-0.5 rounded-md border border-[#00f2fe]/30">
            XLM
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-[#10b981] font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            100% On-Chain Wasm
          </span>
          <span className="text-[10px] text-[#626f8a]">Self-Custodial</span>
        </div>
      </div>

      {/* Active Vaults Card */}
      <div className="glass-panel p-6 relative overflow-hidden group border border-[#3b82f6]/30 hover:border-[#3b82f6] transition-all">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#3b82f6]/15 rounded-full blur-2xl group-hover:bg-[#3b82f6]/30 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a8b3cf]">
            Active Time-Locks
          </span>
          <div className="p-2.5 rounded-2xl bg-[#3b82f6]/15 border border-[#3b82f6]/40 text-[#3b82f6] shadow-lg shadow-[#3b82f6]/20 group-hover:scale-110 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white flex items-baseline gap-2">
          <span>{activeVaults.length}</span>
          <span className="text-sm font-normal text-[#a8b3cf]">Vaults</span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[#3b82f6] font-mono font-medium">
            Enforcing Discipline
          </span>
          <span className="text-[10px] bg-[#3b82f6]/15 text-[#3b82f6] px-2 py-0.5 rounded font-mono">
            0% Impulse Rate
          </span>
        </div>
      </div>

      {/* Unlocked Goals Card */}
      <div className="glass-panel p-6 relative overflow-hidden group border border-[#10b981]/30 hover:border-[#10b981] transition-all">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#10b981]/15 rounded-full blur-2xl group-hover:bg-[#10b981]/30 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a8b3cf]">
            Milestones Reached
          </span>
          <div className="p-2.5 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] shadow-lg shadow-[#10b981]/20 group-hover:scale-110 transition-transform">
            <Unlock className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white flex items-baseline gap-2">
          <span>{completedVaults.length}</span>
          <span className="text-sm font-normal text-[#a8b3cf]">Completed</span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[#10b981] font-mono font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            0% Fee Unlock Ready
          </span>
          <span className="text-[10px] text-[#626f8a]">Goal Met</span>
        </div>
      </div>

      {/* Level 5 Community Treasury & Gas Savings */}
      <div className="glass-panel p-6 relative overflow-hidden group border border-[#ec4899]/30 hover:border-[#ec4899] transition-all">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#ec4899]/15 rounded-full blur-2xl group-hover:bg-[#ec4899]/30 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a8b3cf]">
            Level 5 Community Pool
          </span>
          <div className="p-2.5 rounded-2xl bg-[#ec4899]/15 border border-[#ec4899]/40 text-[#ec4899] shadow-lg shadow-[#ec4899]/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white flex items-baseline gap-2">
          <span>+{penaltiesCollected.toFixed(1)}</span>
          <span className="text-xs font-mono font-semibold text-[#ec4899] bg-[#ec4899]/10 px-2 py-0.5 rounded-md border border-[#ec4899]/30">
            XLM Fees
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[#ec4899] font-mono text-[11px] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            99.98% Gas Saved vs ETH
          </span>
          <span className="text-[10px] text-[#626f8a]">5% Split</span>
        </div>
      </div>
    </div>
  );
};
