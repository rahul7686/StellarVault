import React from 'react';
import { Lock, Unlock, TrendingUp, ShieldCheck } from 'lucide-react';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Saved */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#00f2fe]/10 rounded-full blur-xl group-hover:bg-[#00f2fe]/20 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a9bb]">Total Saved Balance</span>
          <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 text-[#00f2fe]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold font-heading text-white">
          {totalSaved.toLocaleString()} <span className="text-sm font-normal text-[#00f2fe]">XLM</span>
        </div>
        <p className="text-xs text-[#a1a9bb] mt-2 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10b981]" />
          Secured by Soroban Rust time-lock
        </p>
      </div>

      {/* Active Vaults */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#4facfe]/10 rounded-full blur-xl group-hover:bg-[#4facfe]/20 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a9bb]">Active Locked Vaults</span>
          <div className="p-2.5 rounded-xl bg-[#4facfe]/10 text-[#4facfe]">
            <Lock className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold font-heading text-white">
          {activeVaults.length} <span className="text-sm font-normal text-[#a1a9bb]">Vaults</span>
        </div>
        <p className="text-xs text-[#a1a9bb] mt-2">
          Protecting against impulse withdrawals
        </p>
      </div>

      {/* Unlocked Goals */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#10b981]/10 rounded-full blur-xl group-hover:bg-[#10b981]/20 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a9bb]">Goals Achieved</span>
          <div className="p-2.5 rounded-xl bg-[#10b981]/10 text-[#10b981]">
            <Unlock className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold font-heading text-white">
          {completedVaults.length} <span className="text-sm font-normal text-[#a1a9bb]">Goals Met</span>
        </div>
        <p className="text-xs text-[#10b981] mt-2 font-medium">
          Ready for zero-penalty withdrawal
        </p>
      </div>

      {/* Penalties Deterred / Fee Pool */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#9b51e0]/10 rounded-full blur-xl group-hover:bg-[#9b51e0]/20 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a9bb]">Impulse Penalties Pool</span>
          <div className="p-2.5 rounded-xl bg-[#9b51e0]/10 text-[#e0aaff]">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold font-heading text-white">
          {penaltiesCollected.toLocaleString()} <span className="text-sm font-normal text-[#e0aaff]">XLM</span>
        </div>
        <p className="text-xs text-[#a1a9bb] mt-2">
          5% fee collected from early withdrawals
        </p>
      </div>
    </div>
  );
};
