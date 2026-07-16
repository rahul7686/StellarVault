import React from 'react';
import { X, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { Vault } from '../types/vault';

interface EarlyWithdrawModalProps {
  vault: Vault | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (vault: Vault) => void;
}

export const EarlyWithdrawModal: React.FC<EarlyWithdrawModalProps> = ({
  vault,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !vault) return null;

  const penaltyAmount = Number(((vault.balance * 5) / 100).toFixed(2));
  const netAmount = Number((vault.balance - penaltyAmount).toFixed(2));

  return (
    <div className="modal-overlay">
      <div className="modal-content relative border-red-500/30">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-[#a1a9bb] hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">Emergency Early Withdrawal</h3>
            <p className="text-xs text-red-400 font-semibold">Time-Lock and Goal conditions not yet met!</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6 text-xs text-[#a1a9bb] space-y-2">
          <p className="text-white font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            Why is there a penalty?
          </p>
          <p>
            VaultLock is designed to protect you from impulse spending. To discourage breaking your savings commitment early, a <strong>5% penalty (`penalty_bps = 500`)</strong> is deducted and transferred to the community fee pool (`fee_recipient`).
          </p>
        </div>

        {/* Breakdown */}
        <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 mb-6 font-mono text-sm">
          <div className="flex justify-between items-center text-[#a1a9bb]">
            <span>Total Vault Balance:</span>
            <span className="font-bold text-white">{vault.balance.toLocaleString()} {vault.assetSymbol}</span>
          </div>

          <div className="flex justify-between items-center text-red-400">
            <span>Early Penalty (5.00%):</span>
            <span>- {penaltyAmount} {vault.assetSymbol}</span>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-base font-bold text-[#10b981]">
            <span>Net Payout to Your Wallet:</span>
            <span>{netAmount} {vault.assetSymbol}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1 py-3 text-xs font-semibold"
          >
            Keep Saving (Avoid Penalty)
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(vault);
              onClose();
            }}
            className="btn btn-danger flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            Confirm Payout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
