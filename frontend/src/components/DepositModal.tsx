import React, { useState } from 'react';
import { X, PlusCircle, TrendingUp } from 'lucide-react';
import { Vault } from '../types/vault';

interface DepositModalProps {
  vault: Vault | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vault: Vault, amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  vault,
  isOpen,
  onClose,
  onSubmit,
}) => {
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
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-[#a1a9bb] hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] text-black">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">Deposit to Vault</h3>
            <p className="text-xs text-[#a1a9bb]">Invokes Soroban `deposit(depositor, vault_id, amount)`</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/5 mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#a1a9bb]">Target Goal:</span>
            <span className="text-sm font-bold text-white">{vault.goalAmount.toLocaleString()} {vault.assetSymbol}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#a1a9bb]">Current Balance:</span>
            <span className="text-sm font-bold text-[#00f2fe]">{vault.balance.toLocaleString()} {vault.assetSymbol}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a1a9bb] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#00f2fe]" /> Deposit Amount ({vault.assetSymbol})
            </label>
            <input
              type="number"
              required
              min={1}
              placeholder="50"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-field text-lg font-bold text-[#00f2fe]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-[#a1a9bb]">Quick Add:</span>
            {[10, 50, 100, 250, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  amount === preset
                    ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] font-bold shadow-md'
                    : 'bg-white/5 border-white/10 text-[#a1a9bb] hover:text-white'
                }`}
              >
                +{preset} {vault.assetSymbol}
              </button>
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1 py-3 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 py-3 text-xs font-bold"
            >
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
