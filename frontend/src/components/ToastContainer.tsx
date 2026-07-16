import React from 'react';
import { CheckCircle2, AlertTriangle, Loader2, Info, X } from 'lucide-react';
import { ToastNotification } from '../types/vault';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-start justify-between gap-3 transition-all animate-slideUp ${
            t.type === 'success'
              ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
              : t.type === 'error'
              ? 'bg-red-500/15 border-red-500/40 text-red-400'
              : t.type === 'loading'
              ? 'bg-[#00f2fe]/15 border-[#00f2fe]/40 text-[#00f2fe]'
              : 'bg-[#1a2234]/90 border-white/10 text-white'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="pt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#10b981]" />}
              {t.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
              {t.type === 'loading' && <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[#4facfe]" />}
            </div>
            <div>
              <p className="text-sm font-bold font-heading text-white">{t.message}</p>
              {t.detail && (
                <p className="text-xs font-mono text-[#a1a9bb] mt-1 break-all">{t.detail}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 rounded-lg text-[#a1a9bb] hover:text-white hover:bg-white/10 transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
