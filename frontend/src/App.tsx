import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { SimulationPanel } from './components/SimulationPanel';
import { VaultGrid } from './components/VaultGrid';
import { CreateVaultModal } from './components/CreateVaultModal';
import { DepositModal } from './components/DepositModal';
import { EarlyWithdrawModal } from './components/EarlyWithdrawModal';
import { Vault, SimulationState, CreateVaultInput } from './types/vault';
import { ShieldAlert, ExternalLink, Code2 } from 'lucide-react';

const INITIAL_VAULTS: Vault[] = [
  {
    id: 1,
    title: 'RiseIn Stellar Hackathon Trip',
    balance: 850,
    goalAmount: 1000,
    unlockTimestamp: Math.floor(Date.now() / 1000) + 86400 * 12, // +12 days
    assetSymbol: 'XLM',
    isActive: true,
    category: 'vacation',
  },
  {
    id: 2,
    title: 'MacBook Pro M4 Hardware Fund',
    balance: 320,
    goalAmount: 2500,
    unlockTimestamp: Math.floor(Date.now() / 1000) + 86400 * 45, // +45 days
    assetSymbol: 'USDC',
    isActive: true,
    category: 'hardware',
  },
  {
    id: 3,
    title: 'Solo On-Chain Emergency Buffer',
    balance: 5000,
    goalAmount: 5000,
    unlockTimestamp: Math.floor(Date.now() / 1000) + 86400 * 90, // +90 days (Goal Met!)
    assetSymbol: 'XLM',
    isActive: true,
    category: 'emergency',
  },
];

export const App: React.FC = () => {
  const [vaults, setVaults] = useState<Vault[]>(INITIAL_VAULTS);
  const [simState, setSimState] = useState<SimulationState>({
    currentTimestamp: Math.floor(Date.now() / 1000),
    totalSaved: 6170,
    penaltiesCollected: 120,
    judgeMode: true,
    walletConnected: false,
    walletAddress: 'GDX7...4Y29',
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDepositVault, setSelectedDepositVault] = useState<Vault | null>(null);
  const [selectedEarlyWdVault, setSelectedEarlyWdVault] = useState<Vault | null>(null);

  // Trigger celebratory confetti when a goal is reached or unlocked
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#9b51e0', '#10b981'],
    });
  };

  const handleCreateVault = (input: CreateVaultInput) => {
    const newId = vaults.length ? Math.max(...vaults.map((v) => v.id)) + 1 : 1;
    const unlockTime = simState.currentTimestamp + input.unlockDays * 86400;

    const newVault: Vault = {
      id: newId,
      title: input.title,
      balance: 0,
      goalAmount: input.goalAmount,
      unlockTimestamp: unlockTime,
      assetSymbol: input.assetSymbol,
      isActive: true,
      category: input.category,
    };

    setVaults([newVault, ...vaults]);
    triggerConfetti();
  };

  const handleDeposit = (vault: Vault, amount: number) => {
    const updated = vaults.map((v) => {
      if (v.id === vault.id) {
        const newBal = v.balance + amount;
        if (newBal >= v.goalAmount && v.balance < v.goalAmount) {
          triggerConfetti();
        }
        return { ...v, balance: newBal };
      }
      return v;
    });

    setVaults(updated);
    setSimState((prev) => ({
      ...prev,
      totalSaved: prev.totalSaved + amount,
    }));
  };

  const handleNormalWithdraw = (vault: Vault) => {
    const payout = vault.balance;
    const updated = vaults.map((v) =>
      v.id === vault.id ? { ...v, balance: 0, isActive: false } : v
    );

    setVaults(updated);
    setSimState((prev) => ({
      ...prev,
      totalSaved: Math.max(0, prev.totalSaved - payout),
    }));
    triggerConfetti();
  };

  const handleEarlyWithdraw = (vault: Vault) => {
    const payout = vault.balance;
    const penalty = Number(((payout * 5) / 100).toFixed(2));

    const updated = vaults.map((v) =>
      v.id === vault.id ? { ...v, balance: 0, isActive: false } : v
    );

    setVaults(updated);
    setSimState((prev) => ({
      ...prev,
      totalSaved: Math.max(0, prev.totalSaved - payout),
      penaltiesCollected: prev.penaltiesCollected + penalty,
    }));
  };

  const handleAdvanceTime = (days: number) => {
    setSimState((prev) => ({
      ...prev,
      currentTimestamp: prev.currentTimestamp + days * 86400,
    }));
  };

  const handleResetTime = () => {
    setSimState((prev) => ({
      ...prev,
      currentTimestamp: Math.floor(Date.now() / 1000),
    }));
  };

  const totalSavedActive = vaults
    .filter((v) => v.isActive)
    .reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          state={simState}
          onToggleWallet={() =>
            setSimState((prev) => ({
              ...prev,
              walletConnected: !prev.walletConnected,
              walletAddress: prev.walletConnected ? '' : 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXFOOZ4PR6DSPB',
            }))
          }
          onToggleJudgeMode={() =>
            setSimState((prev) => ({ ...prev, judgeMode: !prev.judgeMode }))
          }
          onOpenCreateModal={() => setIsCreateOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-16">
          <SimulationPanel
            state={simState}
            onAdvanceTime={handleAdvanceTime}
            onResetTime={handleResetTime}
          />

          <DashboardStats
            vaults={vaults}
            totalSaved={totalSavedActive}
            penaltiesCollected={simState.penaltiesCollected}
          />

          <VaultGrid
            vaults={vaults}
            currentTimestamp={simState.currentTimestamp}
            onDeposit={(vault) => setSelectedDepositVault(vault)}
            onWithdraw={handleNormalWithdraw}
            onEarlyWithdraw={(vault) => setSelectedEarlyWdVault(vault)}
          />

          {/* Architecture Showcase Box */}
          <div className="glass-panel p-8 mt-12 bg-gradient-to-br from-[#1a2234] to-[#141a28] border border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-[#00f2fe]" />
                  <h3 className="text-xl font-bold font-heading text-white">
                    Self-Custodial Soroban Contract Enforcement
                  </h3>
                </div>
                <p className="text-xs text-[#a1a9bb] leading-relaxed">
                  When deployed on Stellar Mainnet/Testnet, VaultLock stores each vault as an isolated entry (<code>{'DataKey::VaultInfo(u64)'}</code>). Withdrawal transactions call <code>{'withdraw(vault_id)'}</code> where Soroban evaluates the condition <code>{'env.ledger().timestamp() >= unlock_timestamp || balance >= goal_amount'}</code>. If not met, <code>{'Error::VaultLocked (code 7)'}</code> is returned on-chain, keeping funds secure without intermediaries.
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <a
                  href="https://github.com/rahul7686/StellarVault"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary text-xs py-3 px-5 flex items-center justify-center gap-2 font-bold"
                >
                  <ExternalLink className="w-4 h-4" />
                  View GitHub Repository
                </a>
                <span className="text-[11px] text-center text-[#a1a9bb]">
                  Submission by <strong className="text-white">rahul7686</strong>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="glass-header py-6 px-6 md:px-12 text-center text-xs text-[#a1a9bb] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#00f2fe]" />
            <span>VaultLock (StellarVault) — RiseIn Stellar Journey to Mastery Hackathon Submission</span>
          </div>
          <div className="font-mono text-[11px]">
            Soroban SDK v21/v22 • Rust WebAssembly • Built by rahul7686
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateVaultModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateVault}
      />

      <DepositModal
        vault={selectedDepositVault}
        isOpen={!!selectedDepositVault}
        onClose={() => setSelectedDepositVault(null)}
        onSubmit={handleDeposit}
      />

      <EarlyWithdrawModal
        vault={selectedEarlyWdVault}
        isOpen={!!selectedEarlyWdVault}
        onClose={() => setSelectedEarlyWdVault(null)}
        onConfirm={handleEarlyWithdraw}
      />
    </div>
  );
};
