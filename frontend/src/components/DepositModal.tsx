import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Vault } from '../types/vault';

interface DepositModalProps {
  vault: Vault | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vault: Vault, amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ vault, isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState<number | ''>(50);

  if (!isOpen || !vault) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    onSubmit(vault, Number(amount));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-2 text-[#a8b3cf] hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div>
          <h3 className="text-xl font-semibold text-white">Deposit</h3>
          <p className="mt-1 text-sm text-[#a8b3cf]">{vault.title}</p>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#d7deee]">
          <div className="flex justify-between">
            <span>Current balance</span>
            <span>{vault.balance.toLocaleString()} {vault.assetSymbol}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Goal</span>
            <span>{vault.goalAmount.toLocaleString()} {vault.assetSymbol}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[#a8b3cf]">Amount</label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-field"
            />
          </div>

          <div className="flex gap-2">
            {[10, 50, 100, 250].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#d7deee]"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-3 text-xs">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1 py-3 text-xs">
              Save deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
