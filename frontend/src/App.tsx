import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

type Asset = 'XLM' | 'USDC';
type VaultStatus = 'locked' | 'ready' | 'completed';

type Vault = {
  id: number;
  name: string;
  asset: Asset;
  saved: number;
  goal: number;
  unlockAt: string;
  status: VaultStatus;
};

type Activity = {
  id: number;
  title: string;
  detail: string;
  time: string;
};

const INITIAL_VAULTS: Vault[] = [
  { id: 1, name: 'Emergency fund', asset: 'XLM', saved: 420, goal: 1000, unlockAt: '2026-08-15', status: 'locked' },
  { id: 2, name: 'Device upgrade', asset: 'USDC', saved: 780, goal: 1200, unlockAt: '2026-09-05', status: 'locked' },
  { id: 3, name: 'Trip savings', asset: 'XLM', saved: 900, goal: 900, unlockAt: '2026-07-18', status: 'completed' },
];

const INITIAL_ACTIVITY: Activity[] = [
  { id: 1, title: 'Vault created', detail: 'Emergency fund locked on Soroban', time: 'Today' },
  { id: 2, title: 'Deposit confirmed', detail: '+120 XLM added to Emergency fund', time: 'Today' },
  { id: 3, title: 'Unlock reached', detail: 'Trip savings is now available to withdraw', time: 'Yesterday' },
];

const statCards = [
  { label: 'Total saved', value: '2,100', icon: CircleDollarSign },
  { label: 'Active vaults', value: '2', icon: LockKeyhole },
  { label: 'Unlocked', value: '1', icon: ShieldCheck },
  { label: 'Wallet proofs', value: '12+', icon: Wallet },
];

const statusLabel: Record<VaultStatus, string> = {
  locked: 'Locked',
  ready: 'Ready',
  completed: 'Completed',
};

const statusTone: Record<VaultStatus, string> = {
  locked: 'border-white/10 bg-white/5 text-[#d7deee]',
  ready: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  completed: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
};

export const App: React.FC = () => {
  const [vaults, setVaults] = useState<Vault[]>(INITIAL_VAULTS);
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    asset: 'XLM' as Asset,
    goal: 1000,
    days: 30,
  });
  const [depositAmount, setDepositAmount] = useState(100);

  const activeVaults = useMemo(() => vaults.filter((vault) => vault.status !== 'completed'), [vaults]);

  const createVault = () => {
    const unlockAt = new Date(Date.now() + createForm.days * 86400000).toISOString().slice(0, 10);
    const nextVault: Vault = {
      id: vaults.length + 1,
      name: createForm.name.trim() || 'New vault',
      asset: createForm.asset,
      saved: 0,
      goal: createForm.goal,
      unlockAt,
      status: 'locked',
    };

    setVaults((prev) => [nextVault, ...prev]);
    setActivity((prev) => [
      { id: Date.now(), title: 'Vault created', detail: `${nextVault.name} is ready`, time: 'Just now' },
      ...prev,
    ]);
    setShowCreate(false);
    setCreateForm({ name: '', asset: 'XLM', goal: 1000, days: 30 });
  };

  const depositToVault = () => {
    if (!selectedVault) return;

    setVaults((prev) =>
      prev.map((vault) => {
        if (vault.id !== selectedVault.id) return vault;
        const saved = vault.saved + depositAmount;
        const status: VaultStatus = saved >= vault.goal ? 'ready' : vault.status;
        return { ...vault, saved, status };
      })
    );

    setActivity((prev) => [
      {
        id: Date.now(),
        title: 'Deposit confirmed',
        detail: `+${depositAmount} ${selectedVault.asset} to ${selectedVault.name}`,
        time: 'Just now',
      },
      ...prev,
    ]);

    setSelectedVault(null);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">VaultLock</div>
          <div className="subtitle">Simple Stellar savings vaults</div>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button">Proofs</button>
          <button className="ghost-button">Feedback</button>
          <button className="primary-button" onClick={() => setShowCreate(true)}>
            <Plus size={16} />
            New vault
          </button>
        </div>
      </header>

      <main className="page">
        <section className="hero card">
          <div className="hero-copy">
            <p className="eyebrow">Stellar Soroban savings app</p>
            <h1>Save with a vault that only unlocks when your goal or date is reached.</h1>
            <p className="lede">
              VaultLock gives you a clear way to build a savings habit without relying on trust.
              Create a vault, add money over time, and keep funds locked until the rules say otherwise.
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={() => setShowCreate(true)}>
                <Plus size={16} />
                Create vault
              </button>
              <button className="ghost-button">View contract</button>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-title">Current overview</div>
            <div className="hero-panel-value">{activeVaults.length} active vaults</div>
            <div className="hero-panel-note">
              Designed for testnet deployment, simple onboarding, and a clean product demo.
            </div>
          </div>
        </section>

        <section className="stats-grid">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="card stat-card">
                <div className="stat-label">
                  <span>{card.label}</span>
                  <Icon size={16} />
                </div>
                <div className="stat-value">{card.value}</div>
              </article>
            );
          })}
        </section>

        <section className="content-grid">
          <section className="card">
            <div className="section-header">
              <div>
                <h2>Your vaults</h2>
                <p>Each vault keeps a goal, a lock date, and a simple status.</p>
              </div>
            </div>

            <div className="vault-list">
              {vaults.map((vault) => {
                const percent = Math.min(100, Math.round((vault.saved / vault.goal) * 100));
                return (
                  <article key={vault.id} className="vault-row">
                    <div className="vault-main">
                      <div className="vault-name">{vault.name}</div>
                      <div className="vault-meta">
                        {vault.asset} · unlocks {vault.unlockAt}
                      </div>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    <div className="vault-side">
                      <span className={`status-pill ${statusTone[vault.status]}`}>{statusLabel[vault.status]}</span>
                      <div className="vault-amount">
                        {vault.saved.toLocaleString()} / {vault.goal.toLocaleString()}
                      </div>
                      <button className="secondary-button" onClick={() => setSelectedVault(vault)}>
                        Deposit
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="side-column">
            <section className="card">
              <div className="section-header">
                <div>
                  <h2>How it works</h2>
                  <p>Keep the product simple for first-time users.</p>
                </div>
              </div>
              <ol className="steps">
                <li>Create a vault with a savings goal and unlock date.</li>
                <li>Deposit whenever you want using XLM or USDC.</li>
                <li>Withdraw only when the vault is unlocked.</li>
              </ol>
            </section>

            <section className="card">
              <div className="section-header">
                <div>
                  <h2>Recent activity</h2>
                  <p>Small proof log for the demo and onboarding story.</p>
                </div>
              </div>
              <div className="activity-list">
                {activity.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div>
                      <div className="activity-title">{item.title}</div>
                      <div className="activity-detail">{item.detail}</div>
                    </div>
                    <div className="activity-time">{item.time}</div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>

      {showCreate && (
        <Modal title="Create vault" onClose={() => setShowCreate(false)}>
          <div className="form-grid">
            <Field label="Vault name">
              <input
                className="input"
                value={createForm.name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Emergency fund"
              />
            </Field>
            <Field label="Asset">
              <select
                className="input"
                value={createForm.asset}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, asset: e.target.value as Asset }))}
              >
                <option value="XLM">XLM</option>
                <option value="USDC">USDC</option>
              </select>
            </Field>
            <Field label="Goal amount">
              <input
                className="input"
                type="number"
                min={1}
                value={createForm.goal}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, goal: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Unlock in days">
              <input
                className="input"
                type="number"
                min={1}
                value={createForm.days}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, days: Number(e.target.value) }))}
              />
            </Field>
          </div>

          <div className="modal-actions">
            <button className="ghost-button" onClick={() => setShowCreate(false)} type="button">
              Cancel
            </button>
            <button className="primary-button" onClick={createVault} type="button">
              Create vault
            </button>
          </div>
        </Modal>
      )}

      {selectedVault && (
        <Modal title={`Deposit to ${selectedVault.name}`} onClose={() => setSelectedVault(null)}>
          <div className="deposit-summary">
            <div>
              <div className="summary-label">Current balance</div>
              <div className="summary-value">
                {selectedVault.saved.toLocaleString()} {selectedVault.asset}
              </div>
            </div>
            <div>
              <div className="summary-label">Goal</div>
              <div className="summary-value">
                {selectedVault.goal.toLocaleString()} {selectedVault.asset}
              </div>
            </div>
          </div>

          <Field label="Deposit amount">
            <input
              className="input"
              type="number"
              min={1}
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
            />
          </Field>

          <div className="quick-amounts">
            {[25, 50, 100, 250].map((value) => (
              <button key={value} className="chip" type="button" onClick={() => setDepositAmount(value)}>
                {value}
              </button>
            ))}
          </div>

          <div className="modal-actions">
            <button className="ghost-button" onClick={() => setSelectedVault(null)} type="button">
              Cancel
            </button>
            <button className="primary-button" onClick={depositToVault} type="button">
              Confirm deposit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal card">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Close modal">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
