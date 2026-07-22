import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateVaultInput } from '../types/vault';

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateVaultInput) => void;
}

export const CreateVaultModal: React.FC<CreateVaultModalProps> = ({ isOpen, onClose, onSubmit }) => {
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
        <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-2 text-[#a8b3cf] hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div>
          <h3 className="text-xl font-semibold text-white">Create vault</h3>
          <p className="mt-1 text-sm text-[#a8b3cf]">Set the goal, lock date, and asset.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-[#a8b3cf]">Vault name</label>
            <input
              type="text"
              required
              placeholder="Emergency fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-[#a8b3cf]">Goal amount</label>
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
              <label className="mb-1 block text-xs text-[#a8b3cf]">Asset</label>
              <select value={assetSymbol} onChange={(e) => setAssetSymbol(e.target.value as 'XLM' | 'USDC')} className="input-field">
                <option value="XLM">XLM</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-[#a8b3cf]">Unlock in days</label>
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
              <label className="mb-1 block text-xs text-[#a8b3cf]">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="input-field">
                <option value="general">General</option>
                <option value="vacation">Vacation</option>
                <option value="hardware">Hardware</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-3 text-xs">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1 py-3 text-xs">
              Create vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
