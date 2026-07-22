import React from 'react';
import { Lock, Unlock, TrendingUp, ShieldCheck } from 'lucide-react';
import { Vault } from '../types/vault';

interface DashboardStatsProps {
  vaults: Vault[];
  totalSaved: number;
  penaltiesCollected: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  vaults,
  totalSaved,
  penaltiesCollected,
}) => {
  const activeVaults = vaults.filter((vault) => vault.isActive);
  const completedVaults = vaults.filter((vault) => !vault.isActive);

  const cards = [
    { label: 'Total saved', value: totalSaved.toLocaleString(), icon: TrendingUp },
    { label: 'Active vaults', value: activeVaults.length.toString(), icon: Lock },
    { label: 'Completed', value: completedVaults.length.toString(), icon: Unlock },
    { label: 'Penalty pool', value: penaltiesCollected.toFixed(1), icon: ShieldCheck },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="glass-panel p-5">
            <div className="flex items-center justify-between text-xs text-[#a8b3cf]">
              <span>{card.label}</span>
              <Icon className="h-4 w-4 text-[#00f2fe]" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
};
