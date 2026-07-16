import React from 'react';
import { Lock, Unlock, Clock, AlertTriangle, PlusCircle, ArrowUpRight, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';
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

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'vacation':
        return {
          bg: 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/30',
          gradient: 'from-[#00f2fe] via-[#3b82f6] to-[#a855f7]',
        };
      case 'hardware':
        return {
          bg: 'bg-[#a855f7]/10 text-[#e0aaff] border-[#a855f7]/30',
          gradient: 'from-[#a855f7] via-[#ec4899] to-[#3b82f6]',
        };
      case 'emergency':
        return {
          bg: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30',
          gradient: 'from-[#f59e0b] via-[#ef4444] to-[#ec4899]',
        };
      default:
        return {
          bg: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
          gradient: 'from-[#10b981] via-[#00f2fe] to-[#3b82f6]',
        };
    }
  };

  const theme = getCategoryTheme(vault.category);

  const unlockDateStr = new Date(vault.unlockTimestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`glass-panel p-6 sm:p-7 flex flex-col justify-between relative group transition-all duration-300 ${
      !vault.isActive ? 'opacity-65 border-dashed border-white/15 bg-black/40' : 'hover:scale-[1.01]'
    }`}>
      {/* Top Gradient Laser Edge */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.gradient} opacity-90 group-hover:h-2 transition-all`} />

      <div>
        {/* Header: Category Tag & Status Pill */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.bg}`}>
                {vault.category}
              </span>
              <span className="text-[11px] font-mono text-[#626f8a]">Soroban ID #{vault.id}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white group-hover:text-[#00f2fe] transition-colors">
              {vault.title}
            </h3>
          </div>

          {/* Status Badge */}
          {vault.isActive ? (
            canWithdrawNormal ? (
              <span className="badge badge-unlocked shrink-0">
                <Unlock className="w-3.5 h-3.5" />
                Unlocked
              </span>
            ) : (
              <span className="badge badge-locked shrink-0">
                <Lock className="w-3.5 h-3.5" />
                Time-Locked
              </span>
            )
          ) : (
            <span className="badge bg-white/10 text-[#a8b3cf] border-white/20 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              Completed
            </span>
          )}
        </div>

        {/* Holographic TVL Progress Locker */}
        <div className="my-5 bg-[#070b14]/90 p-5 rounded-2xl border border-white/10 shadow-inner relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none" />
          
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-heading text-white tracking-tight">
                {vault.balance.toLocaleString()}
              </span>
              <span className="text-sm font-mono font-bold text-[#00f2fe] bg-[#00f2fe]/15 px-2 py-0.5 rounded">
                {vault.assetSymbol}
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#a8b3cf]">
              Goal: {vault.goalAmount.toLocaleString()} {vault.assetSymbol}
            </span>
          </div>

          <div className="progress-bar mb-3">
            <div
              className="progress-fill"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#00f2fe] font-bold">{percentComplete}% Saved</span>
            <span className="font-semibold text-white">
              {(vault.goalAmount - vault.balance) > 0
                ? `${(vault.goalAmount - vault.balance).toLocaleString()} ${vault.assetSymbol} remaining`
                : '🎯 Target Reached!'}
            </span>
          </div>
        </div>

        {/* Time Target Panel */}
        <div className="flex items-center justify-between text-xs p-3.5 rounded-xl bg-[#0b101f]/80 border border-white/10 mb-6 font-mono">
          <div className="flex items-center gap-2 text-[#a8b3cf]">
            <Clock className="w-4 h-4 text-[#00f2fe]" />
            <span>Unlock Date: <strong className="text-white">{unlockDateStr}</strong></span>
          </div>
          {vault.isActive && (
            <span className={`font-bold px-2 py-0.5 rounded ${
              isTimeReached ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#00f2fe]/15 text-[#00f2fe]'
            }`}>
              {isTimeReached ? 'Unlocked by Time' : `${daysRemaining} days left`}
            </span>
          )}
        </div>
      </div>

      {/* Action Controls Footer */}
      <div className="space-y-2.5 pt-4 border-t border-white/10">
        {vault.isActive ? (
          <>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => onDeposit(vault)}
                className="btn btn-secondary flex-1 py-3 text-xs font-bold text-white hover:border-[#00f2fe] hover:bg-[#00f2fe]/10 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#00f2fe]" />
                + Deposit {vault.assetSymbol}
              </button>

              {canWithdrawNormal && (
                <button
                  onClick={() => onWithdraw(vault)}
                  className="btn btn-primary flex-1 py-3 text-xs font-bold shadow-xl shadow-[#00f2fe]/30 flex items-center justify-center gap-2 animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  <Unlock className="w-4 h-4" />
                  Unlock & Withdraw
                </button>
              )}
            </div>

            {isLocked && vault.balance > 0 && (
              <button
                onClick={() => onEarlyWithdraw(vault)}
                className="btn w-full py-2.5 text-[11px] font-mono font-bold bg-[#f43f5e]/10 hover:bg-[#f43f5e]/25 text-[#f43f5e] border border-[#f43f5e]/40 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Early Exit (5% Penalty: <strong className="underline">{((vault.balance * 5) / 100).toFixed(1)} {vault.assetSymbol}</strong> to Pool)</span>
              </button>
            )}

            {isLocked && vault.balance === 0 && (
              <div className="text-center text-[11px] font-mono text-[#626f8a] py-1.5 bg-white/5 rounded-lg border border-white/5">
                ⚡ Make a deposit above to activate on-chain time locking!
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold text-[#10b981] bg-[#10b981]/10 rounded-xl border border-[#10b981]/30">
            <CheckCircle2 className="w-4 h-4" />
            Vault completed and withdrawn (`is_active: false`)
          </div>
        )}
      </div>
    </div>
  );
};
