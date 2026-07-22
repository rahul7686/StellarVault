import React from 'react';
import { Lock, Unlock, Clock, AlertTriangle, PlusCircle, CheckCircle2 } from 'lucide-react';
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

  const daysRemaining = Math.ceil(Math.max(0, vault.unlockTimestamp - currentTimestamp) / 86400);
  const unlockDateStr = new Date(vault.unlockTimestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-panel flex flex-col justify-between p-5 sm:p-6">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#a8b3cf]">Vault #{vault.id}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{vault.title}</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[#d7deee]">
            {vault.isActive ? (canWithdrawNormal ? 'Ready' : 'Locked') : 'Completed'}
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold text-white">{vault.balance.toLocaleString()}</div>
            <div className="text-xs text-[#a8b3cf]">
              Goal {vault.goalAmount.toLocaleString()} {vault.assetSymbol}
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#00f2fe]" style={{ width: `${percentComplete}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#a8b3cf]">
            <span>{percentComplete}% saved</span>
            <span>{vault.assetSymbol}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#a8b3cf]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{unlockDateStr}</span>
          </div>
          {vault.isActive && <span>{isTimeReached ? 'Time met' : `${daysRemaining} days left`}</span>}
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        {vault.isActive ? (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => onDeposit(vault)}
                className="btn btn-secondary flex-1 justify-center py-3 text-xs"
              >
                <PlusCircle className="h-4 w-4" />
                Deposit
              </button>
              {canWithdrawNormal && (
                <button
                  onClick={() => onWithdraw(vault)}
                  className="btn btn-primary flex-1 justify-center py-3 text-xs"
                >
                  <Unlock className="h-4 w-4" />
                  Withdraw
                </button>
              )}
            </div>

            {isLocked && vault.balance > 0 && (
              <button
                onClick={() => onEarlyWithdraw(vault)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-[#a8b3cf]"
              >
                <AlertTriangle className="h-4 w-4" />
                Early withdrawal available with penalty
              </button>
            )}

            {isLocked && vault.balance === 0 && (
              <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-xs text-[#a8b3cf]">
                Deposit to activate the lock.
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-[#d7deee]">
            <CheckCircle2 className="h-4 w-4" />
            Vault completed
          </div>
        )}
      </div>
    </div>
  );
};
