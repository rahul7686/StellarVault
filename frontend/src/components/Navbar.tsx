import React from 'react';
import { ShieldAlert, Wallet, Sparkles, Sliders, BarChart3, MessageSquare, Activity } from 'lucide-react';
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
    <header className="sticky top-4 z-50 px-4 md:px-8 mx-auto max-w-7xl">
      <div className="glass-panel py-3 px-5 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#00f2fe]/30 shadow-2xl shadow-[#00f2fe]/10 rounded-2xl bg-[#080d1a]/85 backdrop-blur-2xl">
        {/* Brand & Network Radar */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#00f2fe] via-[#a855f7] to-[#ec4899] opacity-75 blur-sm animate-pulse"></div>
              <div className="relative w-11 h-11 rounded-xl bg-[#0b101f] border border-[#00f2fe]/50 flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-6 h-6 text-[#00f2fe]" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-heading tracking-tight text-white flex items-center gap-2">
                  Vault<span className="gradient-text font-black">Lock</span>
                </h1>
                <span className="cyber-badge py-0.5 px-2.5 text-[10px]">
                  Soroban Core
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                </span>
                <span className="text-[11px] font-mono text-[#10b981] tracking-wide">Testnet Active • Sub-Sec Finality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Verification Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
          {/* Level 4 Analytics & Proofs */}
          <button
            onClick={onOpenAnalytics}
            className="btn px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-[#00f2fe]/15 via-[#a855f7]/15 to-[#ec4899]/15 border border-[#00f2fe]/40 text-white hover:border-[#00f2fe] transition-all shadow-md shadow-[#00f2fe]/10"
          >
            <Activity className="w-4 h-4 text-[#00f2fe] animate-pulse" />
            <span>Proofs & Telemetry</span>
          </button>

          {/* User Feedback Widget */}
          <button
            onClick={onOpenFeedback}
            className="btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white/5 border border-white/15 text-[#ec4899] hover:bg-white/10 hover:border-[#ec4899]/50 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#ec4899]" />
            <span>Review & Rate</span>
          </button>

          {/* Judge Sandbox Mode Toggle */}
          <button
            onClick={onToggleJudgeMode}
            className={`btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              state.judgeMode
                ? 'bg-[#a855f7]/25 border-[#a855f7] text-[#e0aaff] shadow-lg shadow-[#a855f7]/25'
                : 'bg-white/5 border-white/10 text-[#a8b3cf] hover:bg-white/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Judge Sandbox:</span> {state.judgeMode ? 'ON ⚡' : 'OFF'}
          </button>

          {/* Freighter Connect */}
          <button
            onClick={onToggleWallet}
            className={`btn px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
              state.walletConnected
                ? 'bg-[#10b981]/15 border-[#10b981]/50 text-[#10b981] shadow-md shadow-[#10b981]/15'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {state.walletConnected
                ? `${state.walletAddress.slice(0, 4)}...${state.walletAddress.slice(-4)}`
                : 'Connect Freighter'}
            </span>
          </button>

          {/* + New Vault Action */}
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary px-4 py-2 rounded-xl text-xs font-heading tracking-wide flex items-center gap-1.5 shadow-lg shadow-[#00f2fe]/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Vault</span>
          </button>
        </div>
      </div>
    </header>
  );
};
