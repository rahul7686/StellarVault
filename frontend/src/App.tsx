import React, { useMemo, useState } from 'react';
import {
  Wallet,
  CalendarDays,
  Target,
  CheckCircle2,
  Clock3,
  Users,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { VaultGrid } from './components/VaultGrid';
import { CreateVaultModal } from './components/CreateVaultModal';
import { DepositModal } from './components/DepositModal';
import { EarlyWithdrawModal } from './components/EarlyWithdrawModal';
import { ToastContainer } from './components/ToastContainer';
import { Vault, SimulationState, CreateVaultInput, ToastNotification } from './types/vault';

const now = () => Math.floor(Date.now() / 1000);

const INITIAL_VAULTS: Vault[] = [
  {
    id: 1,
    title: 'Emergency Fund',
    balance: 420,
    goalAmount: 1000,
    unlockTimestamp: now() + 86400 * 21,
    assetSymbol: 'XLM',
    isActive: true,
    category: 'emergency',
  },
  {
    id: 2,
    title: 'Laptop Upgrade',
    balance: 250,
    goalAmount: 1200,
    unlockTimestamp: now() + 86400 * 45,
    assetSymbol: 'USDC',
    isActive: true,
    category: 'hardware',
  },
  {
    id: 3,
    title: 'Trip to Goa',
    balance: 900,
    goalAmount: 900,
    unlockTimestamp: now() - 86400 * 2,
    assetSymbol: 'XLM',
    isActive: false,
    category: 'vacation',
  },
];

const initialProofs = 12;
const initialFeedback = 10;

export const App: React.FC = () => {
  const [vaults, setVaults] = useState<Vault[]>(INITIAL_VAULTS);
  const [simState, setSimState] = useState<SimulationState>({
    currentTimestamp: now(),
    totalSaved: INITIAL_VAULTS.reduce((sum, vault) => sum + vault.balance, 0),
    penaltiesCollected: 18,
    judgeMode: true,
    walletConnected: true,
    walletAddress: 'GCVX...9Q2L',
  });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDepositVault, setSelectedDepositVault] = useState<Vault | null>(null);
  const [selectedEarlyWdVault, setSelectedEarlyWdVault] = useState<Vault | null>(null);

  const addToast = (message: string, type: ToastNotification['type'], detail?: string, duration = 3200) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type, detail, duration }]);
    if (duration > 0 && type !== 'loading') {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const activeVaults = vaults.filter((vault) => vault.isActive);
  const completedVaults = vaults.filter((vault) => !vault.isActive);

  const analyticsSummary = useMemo(
    () => ({
      users: 10,
      proofs: initialProofs + vaults.length,
      feedback: initialFeedback + 1,
    }),
    [vaults.length]
  );

  const addVault = (input: CreateVaultInput) => {
    const loadingId = addToast('Creating your vault on Soroban...', 'loading');
    window.setTimeout(() => {
      removeToast(loadingId);
      const id = vaults.length ? Math.max(...vaults.map((vault) => vault.id)) + 1 : 1;
      const newVault: Vault = {
        id,
        title: input.title,
        balance: 0,
        goalAmount: input.goalAmount,
        unlockTimestamp: simState.currentTimestamp + input.unlockDays * 86400,
        assetSymbol: input.assetSymbol,
        isActive: true,
        category: input.category,
      };

      setVaults((prev) => [newVault, ...prev]);
      addToast('Vault created. You can start depositing now.', 'success');
    }, 500);
  };

  const deposit = (vault: Vault, amount: number) => {
    const loadingId = addToast(`Submitting deposit of ${amount} ${vault.assetSymbol}...`, 'loading');
    window.setTimeout(() => {
      removeToast(loadingId);
      setVaults((prev) =>
        prev.map((item) => (item.id === vault.id ? { ...item, balance: item.balance + amount } : item))
      );
      setSimState((prev) => ({ ...prev, totalSaved: prev.totalSaved + amount }));
      addToast('Deposit confirmed.', 'success');
    }, 500);
  };

  const withdraw = (vault: Vault) => {
    const loadingId = addToast('Checking unlock rules...', 'loading');
    window.setTimeout(() => {
      removeToast(loadingId);
      setVaults((prev) =>
        prev.map((item) => (item.id === vault.id ? { ...item, balance: 0, isActive: false } : item))
      );
      setSimState((prev) => ({ ...prev, totalSaved: Math.max(0, prev.totalSaved - vault.balance) }));
      addToast('Funds released to your wallet.', 'success');
    }, 500);
  };

  const earlyWithdraw = (vault: Vault) => {
    const loadingId = addToast('Calculating penalty...', 'loading');
    window.setTimeout(() => {
      removeToast(loadingId);
      const penalty = Math.round(vault.balance * 0.05 * 10) / 10;
      setVaults((prev) =>
        prev.map((item) => (item.id === vault.id ? { ...item, balance: 0, isActive: false } : item))
      );
      setSimState((prev) => ({
        ...prev,
        totalSaved: Math.max(0, prev.totalSaved - vault.balance),
        penaltiesCollected: prev.penaltiesCollected + penalty,
      }));
      addToast(`Early withdrawal completed. ${penalty} ${vault.assetSymbol} sent as penalty.`, 'info');
    }, 500);
  };

  const advanceTime = (days: number) => {
    setSimState((prev) => ({ ...prev, currentTimestamp: prev.currentTimestamp + days * 86400 }));
    addToast(`Ledger advanced by ${days} days.`, 'info');
  };

  const resetTime = () => {
    setSimState((prev) => ({ ...prev, currentTimestamp: now() }));
    addToast('Ledger time reset.', 'info');
  };

  return (
    <div className="min-h-screen">
      <Navbar
        state={simState}
        onToggleWallet={() =>
          setSimState((prev) => ({
            ...prev,
            walletConnected: !prev.walletConnected,
            walletAddress: prev.walletConnected ? '' : 'GCVX...9Q2L',
          }))
        }
        onToggleJudgeMode={() => setSimState((prev) => ({ ...prev, judgeMode: !prev.judgeMode }))}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenAnalytics={() => addToast('Proofs and feedback are shown in the dashboard below.', 'info')}
        onOpenFeedback={() => addToast('Feedback summary is tracked in the dashboard below.', 'info')}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel p-6 md:p-8">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Save money in a vault that only unlocks on the date or goal you set.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a8b3cf] md:text-base">
              VaultLock is a simple Stellar app for personal savings. Create one vault, deposit over time, and withdraw when the lock conditions are met.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
                <Wallet className="h-4 w-4" />
                New vault
              </button>
              <button className="btn btn-secondary" onClick={() => advanceTime(7)}>
                <CalendarDays className="h-4 w-4" />
                +7 days
              </button>
              <button className="btn btn-secondary" onClick={resetTime}>
                <Clock3 className="h-4 w-4" />
                Reset time
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Active vaults', value: activeVaults.length, icon: <Target className="h-4 w-4" /> },
                { label: 'Completed vaults', value: completedVaults.length, icon: <CheckCircle2 className="h-4 w-4" /> },
                { label: 'Wallet proofs', value: analyticsSummary.proofs, icon: <Users className="h-4 w-4" /> },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs text-[#a8b3cf]">
                    <span>{item.label}</span>
                    <span className="text-[#00f2fe]">{item.icon}</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white">How it works</h3>
            <div className="mt-5 space-y-4">
              {[
                'Create a vault with a goal amount and unlock date.',
                'Deposit whenever you want, using XLM or USDC.',
                'Withdraw only when time or goal conditions are satisfied.',
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-[#d7deee]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <DashboardStats
            vaults={vaults}
            totalSaved={simState.totalSaved}
            penaltiesCollected={simState.penaltiesCollected}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Vaults</h3>
              <p className="text-sm text-[#a8b3cf]">A clean view of each savings goal, unlock status, and withdraw action.</p>
            </div>
            <div className="text-sm text-[#a8b3cf]">
              {simState.walletConnected ? `Wallet ${simState.walletAddress || 'connected'}` : 'Wallet disconnected'}
            </div>
          </div>

          <div className="mt-5">
            <VaultGrid
              vaults={vaults}
              currentTimestamp={simState.currentTimestamp}
              onDeposit={(vault) => setSelectedDepositVault(vault)}
              onWithdraw={withdraw}
              onEarlyWithdraw={(vault) => setSelectedEarlyWdVault(vault)}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white">User validation</h3>
            <p className="mt-2 text-sm text-[#a8b3cf]">
              Add real wallet interactions and feedback from your testers before submission. This demo area keeps the structure ready for evidence collection.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-[#a8b3cf]">Target wallet proofs</div>
                <div className="mt-1 text-2xl font-bold text-white">10+</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-[#a8b3cf]">Feedback entries</div>
                <div className="mt-1 text-2xl font-bold text-white">{analyticsSummary.feedback}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white">Submission notes</h3>
            <p className="mt-2 text-sm leading-6 text-[#a8b3cf]">
              The contract is already structured for time-locked or goal-locked withdrawals. For a real submission, connect the frontend to your deployed testnet contract, add actual user proof, and replace any demo counts with verified values.
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#d7deee]">
              Keep the UI simple, mobile friendly, and easy to demo.
            </div>
          </div>
        </section>
      </main>

      <CreateVaultModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={addVault}
      />
      <DepositModal
        isOpen={Boolean(selectedDepositVault)}
        vault={selectedDepositVault}
        onClose={() => setSelectedDepositVault(null)}
        onSubmit={(vault, amount) => {
          deposit(vault, amount);
        }}
      />
      <EarlyWithdrawModal
        isOpen={Boolean(selectedEarlyWdVault)}
        vault={selectedEarlyWdVault}
        onClose={() => setSelectedEarlyWdVault(null)}
        onConfirm={(vault) => {
          earlyWithdraw(vault);
        }}
      />
      <ToastContainer toasts={toasts} onDismiss={(id) => removeToast(id)} />
    </div>
  );
};
