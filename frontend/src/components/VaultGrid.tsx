import React, { useState } from 'react';
import { VaultCard } from './VaultCard';
import { Vault } from '../types/vault';
import { Sparkles, Filter } from 'lucide-react';

interface VaultGridProps {
  vaults: Vault[];
  currentTimestamp: number;
  onDeposit: (vault: Vault) => void;
  onWithdraw: (vault: Vault) => void;
  onEarlyWithdraw: (vault: Vault) => void;
}

export const VaultGrid: React.FC<VaultGridProps> = ({
  vaults,
  currentTimestamp,
  onDeposit,
  onWithdraw,
  onEarlyWithdraw,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');

  const filteredVaults = vaults.filter((v) => {
    if (filter === 'active') return v.isActive;
    if (filter === 'archived') return !v.isActive;
    return true;
  });

  return (
    <div className="mb-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            Your Time-Locked Vaults
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-[#00f2fe] border border-white/10">
              {vaults.length} Total
            </span>
          </h2>
          <p className="text-xs text-[#a1a9bb] mt-0.5">
            Self-custodial Soroban contracts verifying unlock timestamps (`unlock_timestamp`) and balance targets (`goal_amount`).
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-[#00f2fe] text-black shadow-md font-bold' : 'text-[#a1a9bb] hover:text-white'
            }`}
          >
            All Vaults ({vaults.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'active' ? 'bg-[#00f2fe] text-black shadow-md font-bold' : 'text-[#a1a9bb] hover:text-white'
            }`}
          >
            Active ({vaults.filter((v) => v.isActive).length})
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'archived' ? 'bg-[#00f2fe] text-black shadow-md font-bold' : 'text-[#a1a9bb] hover:text-white'
            }`}
          >
            Archived ({vaults.filter((v) => !v.isActive).length})
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredVaults.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#a1a9bb] mb-4">
            <Sparkles className="w-8 h-8 text-[#00f2fe]" />
          </div>
          <h3 className="text-lg font-bold font-heading text-white">No vaults found in this view</h3>
          <p className="text-xs text-[#a1a9bb] mt-1 max-w-md">
            You don't have any vaults matching this filter. Create a new personal savings goal using the top right button!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault) => (
            <VaultCard
              key={vault.id}
              vault={vault}
              currentTimestamp={currentTimestamp}
              onDeposit={onDeposit}
              onWithdraw={onWithdraw}
              onEarlyWithdraw={onEarlyWithdraw}
            />
          ))}
        </div>
      )}
    </div>
  );
};
