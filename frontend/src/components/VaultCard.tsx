import React from 'react';
import { CalendarDays, LockKeyhole } from 'lucide-react';

export type VaultStatus = 'locked' | 'ready' | 'completed';

export interface Vault {
  id: number;
  name: string;
  asset: 'XLM';
  saved: number;
  goal: number;
  unlockAt: string;
  status: VaultStatus;
  source?: 'onchain' | 'demo';
}

interface VaultCardProps {
  vault: Vault;
  onDeposit: (vault: Vault) => void;
  onWithdraw: (vault: Vault) => void;
}

const statusLabel: Record<VaultStatus, string> = {
  locked: 'Locked',
  ready: 'Ready',
  completed: 'Completed',
};

const statusTone: Record<VaultStatus, string> = {
  locked: 'border-white/10 bg-white/5 text-[#d7deee]',
  ready: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  completed: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
};

export const VaultCard: React.FC<VaultCardProps> = ({ vault, onDeposit, onWithdraw }) => {
  const progressPct = Math.min(100, Math.round((vault.saved / vault.goal) * 100));

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between gap-6 hover:border-white/20 transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{vault.name}</h3>
              {vault.source === 'onchain' && (
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  On-chain
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              Unlocks: {vault.unlockAt}
            </p>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusTone[vault.status]}`}>
            {statusLabel[vault.status]}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-slate-400">Progress ({progressPct}%)</span>
            <span className="text-sm font-medium text-white">
              {vault.saved} / {vault.goal} XLM
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                vault.status === 'completed'
                  ? 'bg-sky-400'
                  : vault.status === 'ready'
                  ? 'bg-emerald-400'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {vault.status !== 'completed' && (
          <button
            onClick={() => onDeposit(vault)}
            className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
          >
            Deposit
          </button>
        )}
        {(vault.status === 'ready' || vault.status === 'locked') && (
          <button
            onClick={() => onWithdraw(vault)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
              vault.status === 'ready'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20'
            }`}
          >
            {vault.status === 'ready' ? 'Withdraw' : 'Early Withdraw'}
          </button>
        )}
      </div>
    </div>
  );
};
