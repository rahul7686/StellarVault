import React from 'react';
import { FastForward, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';
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

  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#1a2234] via-[#241c38] to-[#1a2234] border border-[#9b51e0]/40 shadow-2xl relative overflow-hidden animate-fadeIn">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#9b51e0]/15 rounded-full blur-2xl" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-[#9b51e0] text-black font-bold text-xs uppercase tracking-wider">
              Judge Sandbox Active
            </span>
            <span className="text-xs text-[#e0aaff] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Simulating Soroban `env.ledger().timestamp()`
            </span>
          </div>
          <h3 className="text-lg font-bold font-heading text-white">
            Simulated Ledger Clock: <span className="text-[#00f2fe] font-mono">{currentDate}</span>
          </h3>
          <p className="text-xs text-[#a1a9bb] mt-1 max-w-2xl">
            Advance the simulated blockchain timestamp to instantly test time-lock expiration and conditional releases (`withdraw()` vs `early_withdraw()` with 5% penalty).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => onAdvanceTime(7)}
            className="btn bg-[#00f2fe]/15 hover:bg-[#00f2fe]/25 border border-[#00f2fe]/40 text-[#00f2fe] text-xs py-2.5 px-4 font-semibold flex items-center gap-1.5"
          >
            <FastForward className="w-4 h-4" />
            +7 Days
          </button>

          <button
            onClick={() => onAdvanceTime(30)}
            className="btn bg-[#4facfe]/15 hover:bg-[#4facfe]/25 border border-[#4facfe]/40 text-[#4facfe] text-xs py-2.5 px-4 font-semibold flex items-center gap-1.5"
          >
            <FastForward className="w-4 h-4" />
            +30 Days
          </button>

          <button
            onClick={onResetTime}
            className="btn bg-white/5 hover:bg-white/10 border border-white/15 text-[#a1a9bb] text-xs py-2.5 px-3 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Clock
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#a1a9bb] gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#9b51e0] shrink-0" />
          <span>
            <strong>Soroban Rule:</strong> If `balance &lt; goal` AND `current_time &lt; unlock_date`, standard withdrawal panics with `Error::VaultLocked`.
          </span>
        </div>
        <div>
          <span className="text-white font-medium">Early Withdrawal Penalty:</span> 5% fee (`penalty_bps = 500`) sent to community pool.
        </div>
      </div>
    </div>
  );
};
