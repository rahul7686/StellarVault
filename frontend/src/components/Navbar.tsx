import React from 'react';
import { ShieldAlert, Wallet, Sparkles, Sliders, BarChart3, MessageSquare } from 'lucide-react';
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
    <header className="glass-header sticky top-0 z-50 w-full py-3.5 px-4 md:px-10 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] via-[#4facfe] to-[#9b51e0] flex items-center justify-center shadow-lg shadow-[#00f2fe]/20 shrink-0">
              <ShieldAlert className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-heading tracking-tight text-white flex items-center gap-2">
                VaultLock <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-[#00f2fe] border border-[#00f2fe]/30 font-mono">Soroban Testnet</span>
              </h1>
              <p className="text-xs text-[#a1a9bb] hidden sm:block">Stellar Solo On-Chain Savings Vault</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
          {/* Level 4 Analytics & Validation */}
          <button
            onClick={onOpenAnalytics}
            className="btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-[#9b51e0]/20 to-[#4facfe]/20 border border-[#4facfe]/40 text-white hover:border-[#00f2fe] transition-all shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>Validation & Proofs</span>
          </button>

          {/* User Feedback Button */}
          <button
            onClick={onOpenFeedback}
            className="btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white/5 border border-white/15 text-[#e0aaff] hover:bg-white/10 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#e0aaff]" />
            <span>Give Feedback</span>
          </button>

          {/* Judge Sandbox Toggle */}
          <button
            onClick={onToggleJudgeMode}
            className={`btn px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              state.judgeMode
                ? 'bg-[#9b51e0]/25 border-[#9b51e0] text-[#e0aaff] shadow-md shadow-[#9b51e0]/20'
                : 'bg-white/5 border-white/10 text-[#a1a9bb] hover:bg-white/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sandbox Mode:</span> {state.judgeMode ? 'Active' : 'Off'}
          </button>

          {/* Freighter Connect */}
          <button
            onClick={onToggleWallet}
            className={`btn px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              state.walletConnected
                ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            {state.walletConnected
              ? `${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`
              : 'Connect Wallet'}
          </button>

          {/* Create Vault Button */}
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary text-xs py-1.5 px-3.5 shadow-md flex items-center gap-1.5 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Vault</span>
          </button>
        </div>
      </div>
    </header>
  );
};
