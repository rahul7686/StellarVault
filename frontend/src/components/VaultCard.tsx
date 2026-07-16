import React from 'react';
import { Lock, Unlock, Clock, AlertTriangle, PlusCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Vault } from '../types/vault';

interface VaultCardProps {
  vault: Vault;
  currentTimestamp: number;
  onDeposit: (vault: Vault) => void;
  onWithdraw: (vault: Vault) => void;
  onEarlyWithdraw: (vault: Vault) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  currentTimestamp,
  onDeposit,
  onWithdraw,
  onEarlyWithdraw,
}) => {
  const percentComplete = Math.min(100, Math.round((vault.balance / vault.goalAmount) * 100));
  const isTimeReached = currentTimestamp >= vault.unlockTimestamp;
  const isGoalReached = vault.balance >= vault.goalAmount;
  const canWithdrawNormal = vault.isActive && (isTimeReached || isGoalReached);
  const isLocked = vault.isActive && !canWithdrawNormal;

  const secondsRemaining = Math.max(0, vault.unlockTimestamp - currentTimestamp);
  const daysRemaining = Math.ceil(secondsRemaining / (60 * 60 * 24));

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'vacation':
        return 'from-[#00f2fe] to-[#4facfe] text-[#00f2fe]';
      case 'hardware':
        return 'from-[#9b51e0] to-[#4facfe] text-[#e0aaff]';
      case 'emergency':
        return 'from-[#f59e0b] to-[#ef4444] text-[#f59e0b]';
      default:
        return 'from-[#10b981] to-[#00f2fe] text-[#10b981]';
    }
  };

  const unlockDateStr = new Date(vault.unlockTimestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`glass-panel p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
      !vault.isActive ? 'opacity-75 border-dashed border-white/20' : ''
    }`}>
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#9b51e0]" />

      <div>
        {/* Header: Title & Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 ${getCategoryColor(vault.category).split(' ')[2]}`}>
                {vault.category}
              </span>
              <span className="text-[11px] font-mono text-[#a1a9bb]">ID #{vault.id}</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-white">{vault.title}</h3>
          </div>

          {/* Status Badge */}
          {vault.isActive ? (
            canWithdrawNormal ? (
              <span className="badge badge-unlocked">
                <Unlock className="w-3.5 h-3.5" />
                Unlocked
              </span>
            ) : (
              <span className="badge badge-locked">
                <Lock className="w-3.5 h-3.5" />
                Time-Locked
              </span>
            )
          ) : (
            <span className="badge bg-white/10 text-[#a1a9bb] border-white/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              Archived
            </span>
          )}
        </div>

        {/* Progress Display */}
        <div className="my-5 bg-black/40 p-4 rounded-xl border border-white/5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold font-heading text-white">
              {vault.balance.toLocaleString()} <span className="text-sm font-normal text-[#00f2fe]">{vault.assetSymbol}</span>
            </span>
            <span className="text-xs font-semibold text-[#a1a9bb]">
              Goal: {vault.goalAmount.toLocaleString()} {vault.assetSymbol}
            </span>
          </div>

          <div className="progress-container mb-2">
            <div
              className="progress-fill"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#a1a9bb]">
            <span>{percentComplete}% saved</span>
            <span className="font-medium text-white">
              {(vault.goalAmount - vault.balance) > 0
                ? `${(vault.goalAmount - vault.balance).toLocaleString()} ${vault.assetSymbol} left`
                : '🎯 Goal Reached!'}
            </span>
          </div>
        </div>

        {/* Time Info */}
        <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white/5 border border-white/5 mb-6">
          <div className="flex items-center gap-2 text-[#a1a9bb]">
            <Clock className="w-4 h-4 text-[#4facfe]" />
            <span>Target Unlock: <strong className="text-white">{unlockDateStr}</strong></span>
          </div>
          {vault.isActive && (
            <span className="font-semibold text-[#00f2fe]">
              {isTimeReached ? 'Unlocked by Time' : `${daysRemaining} days left`}
            </span>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        {vault.isActive ? (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => onDeposit(vault)}
                className="btn btn-secondary flex-1 py-2 text-xs font-semibold text-white hover:border-[#00f2fe]/40"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#00f2fe]" />
                Deposit Funds
              </button>

              {canWithdrawNormal && (
                <button
                  onClick={() => onWithdraw(vault)}
                  className="btn btn-primary flex-1 py-2 text-xs font-bold shadow-lg shadow-[#00f2fe]/20"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Withdraw & Close
                </button>
              )}
            </div>

            {isLocked && vault.balance > 0 && (
              <button
                onClick={() => onEarlyWithdraw(vault)}
                className="btn w-full py-2 text-[11px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Early Withdraw (5% Penalty: {((vault.balance * 5) / 100).toFixed(1)} {vault.assetSymbol})
              </button>
            )}

            {isLocked && vault.balance === 0 && (
              <div className="text-center text-[11px] text-[#a1a9bb] py-1 font-medium">
                Deposit funds above to start saving toward your goal!
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-[#a1a9bb] bg-white/5 rounded-lg border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            Vault completed and withdrawn (`is_active: false`)
          </div>
        )}
      </div>
    </div>
  );
};
