import React, { useState } from 'react';
import { X, Sparkles, Calendar, Target, Tag, Coins } from 'lucide-react';
import { CreateVaultInput } from '../types/vault';

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateVaultInput) => void;
}

export const CreateVaultModal: React.FC<CreateVaultModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState<number | ''>(1000);
  const [unlockDays, setUnlockDays] = useState<number | ''>(30);
  const [assetSymbol, setAssetSymbol] = useState<'XLM' | 'USDC'>('XLM');
  const [category, setCategory] = useState<'vacation' | 'hardware' | 'emergency' | 'general'>('general');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !goalAmount || !unlockDays) return;

    onSubmit({
      title,
      goalAmount: Number(goalAmount),
      unlockDays: Number(unlockDays),
      assetSymbol,
      category,
    });
    setTitle('');
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
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">Initialize New Vault</h3>
            <p className="text-xs text-[#a1a9bb]">Invokes Soroban `create_vault(owner, title, goal, unlock, asset)`</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#a1a9bb] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#00f2fe]" /> Vault Goal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MacBook Pro M4 Fund or Europe Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Goal Amount & Asset */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a9bb] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#4facfe]" /> Goal Amount
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="1000"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a9bb] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#9b51e0]" /> Token Asset
              </label>
              <select
                value={assetSymbol}
                onChange={(e) => setAssetSymbol(e.target.value as 'XLM' | 'USDC')}
                className="input-field bg-[#141a28]"
              >
                <option value="XLM">XLM (Native)</option>
                <option value="USDC">USDC (SEP-41)</option>
              </select>
            </div>
          </div>

          {/* Time Lock Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a9bb] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#10b981]" /> Lock Duration (Days)
              </label>
              <input
                type="number"
                required
                min={1}
                max={3650}
                value={unlockDays}
                onChange={(e) => setUnlockDays(e.target.value === '' ? '' : Number(e.target.value))}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a9bb] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="input-field bg-[#141a28]"
              >
                <option value="general">General Savings</option>
                <option value="vacation">✈️ Vacation & Travel</option>
                <option value="hardware">💻 Tech & Hardware</option>
                <option value="emergency">🛡️ Emergency Buffer</option>
              </select>
            </div>
          </div>

          {/* Quick presets for days */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-[#a1a9bb]">Quick Lock:</span>
            {[7, 30, 90, 180, 365].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setUnlockDays(d)}
                className={`px-2.5 py-1 rounded text-xs transition-all border ${
                  unlockDays === d
                    ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe] font-bold'
                    : 'bg-white/5 border-white/10 text-[#a1a9bb] hover:text-white'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>

          {/* Submit */}
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
              Confirm & Lock On-Chain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
