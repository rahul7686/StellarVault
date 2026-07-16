import React from 'react';
import { FastForward, RotateCcw, Sparkles, Cpu, Clock, Terminal } from 'lucide-react';
import { SimulationState } from '../types/vault';

interface SimulationPanelProps {
  state: SimulationState;
  onAdvanceTime: (days: number) => void;
  onResetTime: () => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  state,
  onAdvanceTime,
  onResetTime,
}) => {
  if (!state.judgeMode) return null;

  const currentDate = new Date(state.currentTimestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const simulatedBlock = Math.floor(state.currentTimestamp / 5);

  return (
    <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1222] via-[#16122d] to-[#0d1222] border-2 border-[#a855f7]/60 shadow-2xl relative overflow-hidden animate-slideUp">
      {/* Cybernetic background mesh */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#a855f7]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#00f2fe]/20 rounded-full blur-3xl" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#a855f7]/30">
              <Cpu className="w-3.5 h-3.5 fill-black" />
              Soroban Time-Travel Console
            </span>
            <span className="text-xs font-mono text-[#00f2fe] bg-[#00f2fe]/10 px-2.5 py-0.5 rounded-md border border-[#00f2fe]/30 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Block #{simulatedBlock.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#0b101f] border border-[#a855f7]/50 shadow-inner flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#a855f7] animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#a8b3cf]">
                Simulated Ledger Clock `env.ledger().timestamp()`
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white flex items-center gap-2">
                <span className="text-[#00f2fe] font-mono bg-[#060a14] px-3 py-1 rounded-xl border border-[#00f2fe]/40 shadow-sm">
                  {currentDate}
                </span>
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#a8b3cf] leading-relaxed">
            Fast-forward the simulated blockchain clock to immediately satisfy Soroban time-lock assertions (<code>{'timestamp >= unlock_timestamp'}</code>) and unlock vaults fee-free, or test the Level 5 early withdrawal 5% deterrent fee split!
          </p>
        </div>

        {/* Time-Travel Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto p-3 rounded-2xl bg-[#080c18]/80 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => onAdvanceTime(7)}
            className="btn flex-1 sm:flex-none bg-gradient-to-r from-[#00f2fe]/20 to-[#3b82f6]/20 hover:from-[#00f2fe]/30 hover:to-[#3b82f6]/30 border border-[#00f2fe]/50 text-[#00f2fe] text-xs py-3 px-5 font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#00f2fe]/15 hover:scale-105 transition-all"
          >
            <FastForward className="w-4 h-4 fill-current" />
            +7 Days ⏩
          </button>

          <button
            onClick={() => onAdvanceTime(30)}
            className="btn flex-1 sm:flex-none bg-gradient-to-r from-[#a855f7]/20 to-[#ec4899]/20 hover:from-[#a855f7]/30 hover:to-[#ec4899]/30 border border-[#a855f7]/50 text-[#e0aaff] text-xs py-3 px-5 font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#a855f7]/15 hover:scale-105 transition-all"
          >
            <FastForward className="w-4 h-4 fill-current" />
            +30 Days ⏭️
          </button>

          <button
            onClick={onResetTime}
            className="btn w-full sm:w-auto bg-white/5 hover:bg-white/15 border border-white/15 text-[#a8b3cf] hover:text-white text-xs py-3 px-4 font-mono flex items-center justify-center gap-2 transition-all"
            title="Reset simulated clock to real-time"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Clock
          </button>
        </div>
      </div>
    </div>
  );
};
