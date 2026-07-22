import React from 'react';
import { Shield, Wallet, PlusCircle, Sliders, BarChart3, MessageSquare } from 'lucide-react';
import { SimulationState } from '../types/vault';

interface NavbarProps {
  state: SimulationState;
  onToggleWallet: () => void;
  onToggleJudgeMode: () => void;
  onOpenCreateModal: () => void;
  onOpenAnalytics: () => void;
  onOpenFeedback: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onToggleWallet,
  onToggleJudgeMode,
  onOpenCreateModal,
  onOpenAnalytics,
  onOpenFeedback,
}) => {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4 md:px-8">
      <div className="glass-panel flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b1020]/90 px-5 py-4 shadow-lg backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#00f2fe]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">VaultLock</h1>
            <p className="text-xs text-[#a8b3cf]">Simple Stellar savings vaults</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onOpenAnalytics} className="btn btn-secondary px-3 py-2 text-xs">
            <BarChart3 className="h-4 w-4" />
            Proofs
          </button>
          <button onClick={onOpenFeedback} className="btn btn-secondary px-3 py-2 text-xs">
            <MessageSquare className="h-4 w-4" />
            Feedback
          </button>
          <button
            onClick={onToggleJudgeMode}
            className={`btn px-3 py-2 text-xs border transition-all ${
              state.judgeMode
                ? 'bg-white/10 border-white/15 text-white'
                : 'bg-transparent border-white/10 text-[#a8b3cf] hover:bg-white/5'
            }`}
          >
            <Sliders className="h-4 w-4" />
            {state.judgeMode ? 'Sandbox on' : 'Sandbox off'}
          </button>
          <button
            onClick={onToggleWallet}
            className={`btn px-3 py-2 text-xs border transition-all ${
              state.walletConnected
                ? 'bg-white/10 border-white/15 text-white'
                : 'bg-transparent border-white/10 text-[#a8b3cf] hover:bg-white/5'
            }`}
          >
            <Wallet className="h-4 w-4" />
            {state.walletConnected ? 'Connected' : 'Connect wallet'}
          </button>
          <button onClick={onOpenCreateModal} className="btn btn-primary px-3 py-2 text-xs">
            <PlusCircle className="h-4 w-4" />
            New vault
          </button>
        </div>
      </div>
    </header>
  );
};
