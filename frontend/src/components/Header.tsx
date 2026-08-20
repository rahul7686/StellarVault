import React from 'react';
import { LockKeyhole, Plus, Wallet } from 'lucide-react';

interface HeaderProps {
  account: string;
  isConnecting: boolean;
  onConnect: () => void;
  onNewVault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  account,
  isConnecting,
  onConnect,
  onNewVault,
}) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">StellarVault</h1>
          <p className="text-sm text-slate-400">Self-custodial savings & time-locked vaults on Stellar</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewVault}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/20 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Vault</span>
        </button>

        <button
          onClick={onConnect}
          disabled={isConnecting}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium border transition-all duration-200 ${
            account
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>
            {account
              ? `${account.slice(0, 4)}...${account.slice(-4)}`
              : isConnecting
              ? 'Connecting...'
              : 'Connect Wallet'}
          </span>
        </button>
      </div>
    </header>
  );
};
