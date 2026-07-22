import React from 'react';
import { X } from 'lucide-react';
import { Vault } from '../types/vault';

interface EarlyWithdrawModalProps {
  vault: Vault | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (vault: Vault) => void;
}

export const EarlyWithdrawModal: React.FC<EarlyWithdrawModalProps> = ({ vault, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !vault) return null;

  const penaltyAmount = Number(((vault.balance * 5) / 100).toFixed(2));
  const netAmount = Number((vault.balance - penaltyAmount).toFixed(2));

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-2 text-[#a8b3cf] hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div>
          <h3 className="text-xl font-semibold text-white">Early withdrawal</h3>
          <p className="mt-1 text-sm text-[#a8b3cf]">A 5% penalty applies if you withdraw before the lock ends.</p>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#d7deee]">
          <div className="flex justify-between">
            <span>Balance</span>
            <span>{vault.balance.toLocaleString()} {vault.assetSymbol}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Penalty</span>
            <span>-{penaltyAmount} {vault.assetSymbol}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-medium text-white">
            <span>You receive</span>
            <span>{netAmount} {vault.assetSymbol}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-3 text-xs">
            Keep saving
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(vault);
              onClose();
            }}
            className="btn btn-danger flex-1 py-3 text-xs"
          >
            Withdraw now
          </button>
        </div>
      </div>
    </div>
  );
};
