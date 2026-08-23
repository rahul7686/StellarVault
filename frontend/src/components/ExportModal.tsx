import React from 'react';
import { Download, FileJson, FileSpreadsheet, X } from 'lucide-react';
import { Vault } from './VaultCard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaults: Vault[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, vaults }) => {
  if (!isOpen) return null;

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(vaults, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stellar_vault_export_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportAsCSV = () => {
    const headers = ['ID', 'Vault Name', 'Asset', 'Saved Amount', 'Goal Amount', 'Unlock Date', 'Status', 'Source'];
    const rows = vaults.map((v) => [
      v.id,
      `"${v.name.replace(/"/g, '""')}"`,
      v.asset,
      v.saved,
      v.goal,
      v.unlockAt,
      v.status,
      v.source ?? 'demo',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stellar_vault_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Export Vault Data</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-400">
          Export your savings vault summary and current progress to standard file formats for personal financial tracking.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={exportAsCSV}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
          >
            <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportAsJSON}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
          >
            <FileJson className="w-8 h-8 text-indigo-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
