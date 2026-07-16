import React from 'react';
import { ShieldAlert, Wallet, Sparkles, Sliders } from 'lucide-react';
import { SimulationState } from '../types/vault';

interface NavbarProps {
  state: SimulationState;
  onToggleWallet: () => void;
  onToggleJudgeMode: () => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onToggleWallet,
  onToggleJudgeMode,
  onOpenCreateModal,
}) => {
  return (
    <header className="glass-header sticky top-0 z-50 w-full py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] via-[#4facfe] to-[#9b51e0] flex items-center justify-center shadow-lg shadow-[#00f2fe]/20">
            <ShieldAlert className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading tracking-tight text-white flex items-center gap-2">
              VaultLock <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#00f2fe] border border-[#00f2fe]/30">Soroban Rust</span>
            </h1>
            <p className="text-xs text-[#a1a9bb]">Stellar Solo On-Chain Savings Vault</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Judge Sandbox Toggle */}
          <button
            onClick={onToggleJudgeMode}
            className={`btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              state.judgeMode
                ? 'bg-[#9b51e0]/20 border-[#9b51e0] text-[#e0aaff] shadow-lg shadow-[#9b51e0]/20'
                : 'bg-white/5 border-white/10 text-[#a1a9bb] hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Judge Sandbox Mode: {state.judgeMode ? 'Active (Time Travel Enabled)' : 'Off'}
          </button>

          {/* Freighter Connect */}
          <button
            onClick={onToggleWallet}
            className={`btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              state.walletConnected
                ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Wallet className="w-4 h-4" />
            {state.walletConnected
              ? `Freighter: ${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`
              : 'Connect Freighter'}
          </button>

          {/* Create Vault Button */}
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary text-xs py-2 px-4 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Create New Vault
          </button>
        </div>
      </div>
    </header>
  );
};
