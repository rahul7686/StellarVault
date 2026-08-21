import React from 'react';
import { Award, CheckCircle2, Sparkles } from 'lucide-react';

interface VaultProgressProps {
  saved: number;
  goal: number;
  showMilestones?: boolean;
}

export const VaultProgress: React.FC<VaultProgressProps> = ({
  saved,
  goal,
  showMilestones = true,
}) => {
  const percentage = Math.min(100, Math.round((saved / goal) * 100));
  const isCompleted = percentage >= 100;

  const milestones = [25, 50, 75, 100];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{percentage}% Funded</span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              <Sparkles className="w-3 h-3" /> Goal Achieved!
            </span>
          )}
        </div>
        <span className="text-slate-400 text-xs">
          {saved.toLocaleString()} / {goal.toLocaleString()} XLM
        </span>
      </div>

      {/* Main Progress Bar Container */}
      <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isCompleted
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 shadow-lg shadow-emerald-500/30'
              : percentage > 50
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Milestone Indicators */}
      {showMilestones && (
        <div className="flex justify-between text-[11px] text-slate-500 px-1 pt-1">
          {milestones.map((m) => {
            const reached = percentage >= m;
            return (
              <div key={m} className="flex items-center gap-1">
                {reached ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
                <span className={reached ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {m}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
