import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import {
  isConnected,
  setAllowed,
  requestAccess,
  getAddress,
  signTransaction,
} from '@stellar/freighter-api';
import {
  BASE_FEE,
  Contract,
  Asset as StellarAsset,
  Networks,
  TransactionBuilder,
  nativeToScVal,
} from '@stellar/stellar-sdk';
import { Server } from '@stellar/stellar-sdk/rpc';

type Asset = 'XLM';
type VaultStatus = 'locked' | 'ready' | 'completed';

type Vault = {
  id: number;
  name: string;
  asset: Asset;
  saved: number;
  goal: number;
  unlockAt: string;
  status: VaultStatus;
  source?: 'onchain' | 'demo';
};

type Activity = {
  id: number;
  title: string;
  detail: string;
  time: string;
};

type Toast = { id: number; message: string; tone: 'info' | 'success' | 'error' };

const RPC_URL =
  import.meta.env.VITE_VAULTLOCK_RPC_URL ??
  import.meta.env.VITE_SOROBAN_RPC_URL ??
  'https://soroban-testnet.stellar.org:443';
const NETWORK_PASSPHRASE =
  import.meta.env.VITE_VAULTLOCK_NETWORK_PASSPHRASE ??
  import.meta.env.VITE_NETWORK_PASSPHRASE ??
  Networks.TESTNET;
const CONTRACT_ID =
  import.meta.env.VITE_VAULTLOCK_CONTRACT_ID ??
  import.meta.env.VITE_CONTRACT_ID ??
  'CBHKGKI3KKPS7FS2SZEUOSF6I432ZRMV7GUHE5NE4HHWXIVAGUVWGMO5';
const XLM_ASSET_CONTRACT_ID = StellarAsset.native().contractId(NETWORK_PASSPHRASE);

const server = new Server(RPC_URL);
const contract = new Contract(CONTRACT_ID);

const INITIAL_VAULTS: Vault[] = [
  { id: 1, name: 'Emergency fund', asset: 'XLM', saved: 420, goal: 1000, unlockAt: '2026-08-15', status: 'locked' },
  { id: 3, name: 'Trip savings', asset: 'XLM', saved: 900, goal: 900, unlockAt: '2026-07-18', status: 'completed' },
];

const INITIAL_ACTIVITY: Activity[] = [
  { id: 1, title: 'Vault created', detail: 'Emergency fund locked on Soroban', time: 'Today' },
  { id: 2, title: 'Deposit confirmed', detail: '+120 XLM added to Emergency fund', time: 'Today' },
  { id: 3, title: 'Unlock reached', detail: 'Trip savings is now available to withdraw', time: 'Yesterday' },
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

function asNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string') return Number(value);
  return 0;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : String(value ?? '');
}

export function normalizeStatus(saved: number, goal: number, unlockAt: string): VaultStatus {
  if (saved >= goal) return 'ready';
  if (new Date(unlockAt).getTime() <= Date.now()) return 'ready';
  return 'locked';
}

function vaultFromContract(rawInfo: any): Vault {
  const raw = rawInfo?.unwrap ? rawInfo.unwrap() : (rawInfo?.value || rawInfo);
  const unlockTimestamp = asNumber(raw.unlock_timestamp ?? raw.unlockAt);
  return {
    id: asNumber(raw.vault_id ?? raw.id ?? raw.vaultId),
    name: asString(raw.title ?? raw.name),
    asset: 'XLM',
    saved: asNumber(raw.balance ?? raw.saved),
    goal: asNumber(raw.goal_amount ?? raw.goal),
    unlockAt: new Date(unlockTimestamp * 1000).toISOString().slice(0, 10),
    source: 'onchain',
    status: raw.is_active === false 
      ? 'completed' 
      : normalizeStatus(
          asNumber(raw.balance ?? raw.saved),
          asNumber(raw.goal_amount ?? raw.goal),
          new Date(unlockTimestamp * 1000).toISOString().slice(0, 10)
        ),
  };
}

async function waitForTx(hash: string) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const tx = (await server.getTransaction(hash)) as any;
    if (tx.status === 'SUCCESS' || tx.status === 'FAILED') return tx;
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }
  throw new Error('Transaction timed out');
}

export const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [currentVaults, setCurrentVaults] = useState<Vault[]>(INITIAL_VAULTS);
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', asset: 'XLM' as Asset, goal: 1000, days: 30 });
  const [depositAmount, setDepositAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (message: string, tone: Toast['tone'] = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const activeVaults = useMemo(() => currentVaults.filter((vault) => vault.status !== 'completed'), [currentVaults]);
  const completedVaults = useMemo(() => currentVaults.filter((vault) => vault.status === 'completed'), [currentVaults]);
  const totalSaved = useMemo(() => currentVaults.reduce((sum, vault) => sum + vault.saved, 0), [currentVaults]);

  const refreshVaults = async (owner: string) => {
    try {
      const { result } = await server.queryContract<number[]>(
        CONTRACT_ID,
        'get_user_vaults',
        { owner },
        NETWORK_PASSPHRASE
      );
      if (!Array.isArray(result) || result.length === 0) {
        setCurrentVaults([]);
        return;
      }

      const nextVaults: Vault[] = [];
      for (const id of result) {
        const vaultResult = await server.queryContract<any>(
          CONTRACT_ID,
          'get_vault',
          { vault_id: id },
          NETWORK_PASSPHRASE
        );
        nextVaults.push(vaultFromContract(vaultResult.result));
      }
      setCurrentVaults((prev) => {
        // Event streaming emulation: detect changes
        for (const next of nextVaults) {
          const old = prev.find(p => p.id === next.id);
          if (old && next.saved > old.saved) {
            pushToast(`Deposit of ${next.saved - old.saved} XLM confirmed in real-time!`, 'success');
          } else if (!old && prev.length > 0 && prev[0].source === 'onchain') {
            pushToast(`New vault "${next.name}" confirmed in real-time!`, 'success');
          } else if (old && old.status !== 'completed' && next.status === 'completed') {
            pushToast(`Vault "${next.name}" was completed in real-time!`, 'success');
          }
        }
        return nextVaults;
      });
    } catch (error) {
      pushToast('Could not load contract vaults. Showing demo data.', 'error');
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    void (async () => {
      try {
        const connected = await isConnected();
        if (connected.isConnected) {
          const addr = await getAddress();
          setWalletAddress(addr.address);
          setWalletConnected(true);
          await refreshVaults(addr.address);

          // Event streaming / real-time updates polling
          interval = window.setInterval(() => refreshVaults(addr.address), 8000);
        }
      } catch {
        // Keep the app usable even if Freighter is not available.
      }
    })();
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const connectWallet = async () => {
    if (walletConnecting) return;
    setWalletConnecting(true);
    try {
      const allowed = await requestAccess();
      if (allowed.error) {
        throw new Error(allowed.error.message ?? 'Freighter access was not approved');
      }
      const addr = await getAddress();
      if (addr.error) {
        throw new Error(addr.error.message ?? 'Freighter did not return an address');
      }
      if (!addr?.address) throw new Error('Wallet not approved');
      setWalletAddress(addr.address);
      setWalletConnected(true);
      pushToast('Freighter connected', 'success');
      await refreshVaults(addr.address);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connect Freighter to use the live contract.';
      pushToast(message, 'error');
    } finally {
      setWalletConnecting(false);
    }
  };

  const submitTx = async (method: string, args: any[]) => {
    if (!walletConnected || !walletAddress) {
      throw new Error('Connect Freighter first');
    }

    const account = await server.getAccount(walletAddress);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const prepared = await server.prepareTransaction(tx);
    const signed = await signTransaction(prepared.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
      address: walletAddress,
    });
    if (signed.error) {
      throw new Error(signed.error.message ?? 'Freighter signing failed');
    }

    const response = await server.sendTransaction(TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK_PASSPHRASE));
    if (response.status === 'ERROR') {
      throw new Error((response as any).errorResult?.toString?.() ?? 'Transaction failed');
    }
    await waitForTx(response.hash);
    await refreshVaults(walletAddress);
  };

  const createVault = async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const unlockTimestamp = Math.floor((Date.now() + createForm.days * 86400000) / 1000);
      await submitTx('create_vault', [
      nativeToScVal(walletAddress, { type: 'address' }) as any,
      nativeToScVal(createForm.name.trim() || 'New vault', { type: 'string' }) as any,
      nativeToScVal(BigInt(createForm.goal), { type: 'i128' }) as any,
      nativeToScVal(BigInt(unlockTimestamp), { type: 'u64' }) as any,
      nativeToScVal(XLM_ASSET_CONTRACT_ID, { type: 'address' }) as any,
      ]);
      pushToast('Vault created on chain', 'success');
      setShowCreate(false);
      setCreateForm({ name: '', asset: 'XLM', goal: 1000, days: 30 });
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'Create vault failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const depositToVault = async () => {
    if (!selectedVault) return;
    setLoading(true);
    try {
      await submitTx('deposit', [
        nativeToScVal(walletAddress, { type: 'address' }) as any,
        nativeToScVal(BigInt(selectedVault.id), { type: 'u64' }) as any,
        nativeToScVal(BigInt(depositAmount), { type: 'i128' }) as any,
      ]);
      setActivity((prev) => [
        { id: Date.now(), title: 'Deposit submitted', detail: `+${depositAmount} ${selectedVault.asset}`, time: 'Just now' },
        ...prev,
      ]);
      setSelectedVault(null);
      pushToast('Deposit confirmed on testnet', 'success');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'Deposit failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const withdrawVault = async (vault: Vault) => {
    setLoading(true);
    try {
      await submitTx('withdraw', [nativeToScVal(BigInt(vault.id), { type: 'u64' }) as any]);
      setActivity((prev) => [
        { id: Date.now(), title: 'Withdrawal submitted', detail: `${vault.name} released to wallet`, time: 'Just now' },
        ...prev,
      ]);
      pushToast('Vault withdrawn successfully', 'success');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'Withdraw failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const earlyWithdrawVault = async (vault: Vault) => {
    setLoading(true);
    try {
      await submitTx('early_withdraw', [nativeToScVal(BigInt(vault.id), { type: 'u64' }) as any]);
      setActivity((prev) => [
        { id: Date.now(), title: 'Early withdrawal submitted', detail: `${vault.name} closed with penalty`, time: 'Just now' },
        ...prev,
      ]);
      pushToast('Early withdrawal completed', 'info');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'Early withdrawal failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total saved', value: totalSaved.toLocaleString(), icon: CircleDollarSign },
    { label: 'Active vaults', value: activeVaults.length.toString(), icon: LockKeyhole },
    { label: 'Completed', value: completedVaults.length.toString(), icon: ShieldCheck },
    { label: 'Wallet', value: walletConnected ? 'Connected' : 'Not connected', icon: Wallet },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">VaultLock</div>
          <div className="subtitle">Simple Stellar savings vaults</div>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button" onClick={connectWallet}>
            <Wallet size={16} />
            {walletConnecting ? 'Opening Freighter...' : walletConnected ? 'Wallet connected' : 'Connect Freighter'}
          </button>
          <button className="ghost-button" onClick={() => window.open('https://github.com/rahul7686/StellarVault', '_blank')}>Proofs</button>
          <button className="primary-button" onClick={() => setShowCreate(true)} disabled={!walletConnected || loading}>
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
              VaultLock now talks to the live Soroban contract on testnet. Connect Freighter,
              create a vault, deposit funds, and withdraw when the contract allows it.
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={connectWallet}>
                <Wallet size={16} />
                {walletConnecting ? 'Opening Freighter...' : walletConnected ? 'Wallet ready' : 'Connect Freighter'}
              </button>
              <button className="ghost-button" onClick={() => window.open(`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`, '_blank')}>Contract ID</button>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-title">Contract</div>
            <div className="hero-panel-value">Soroban testnet</div>
            <div className="hero-panel-note">
              RPC: {RPC_URL}
              <br />
              Contract: {CONTRACT_ID.slice(0, 12)}...
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
              {currentVaults.map((vault) => {
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
                      <button className="secondary-button" onClick={() => setSelectedVault(vault)} disabled={!walletConnected}>
                        Deposit
                      </button>
                      {vault.status !== 'completed' && (
                        <button
                          className="secondary-button"
                          onClick={() => withdrawVault(vault)}
                          disabled={!walletConnected || vault.status === 'locked'}
                        >
                          <ArrowUpRight size={16} />
                          Withdraw
                        </button>
                      )}
                      {vault.status === 'locked' && vault.saved > 0 && (
                        <button className="secondary-button" onClick={() => earlyWithdrawVault(vault)} disabled={!walletConnected}>
                          Early withdraw
                        </button>
                      )}
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
                <li>Connect Freighter and load your vaults from Soroban.</li>
                <li>Create a vault with a savings goal and unlock date.</li>
                <li>Deposit or withdraw using the live contract rules.</li>
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
              <input className="input" value="XLM" disabled />
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
            <button className="primary-button" onClick={createVault} type="button" disabled={loading}>
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
            <button className="primary-button" onClick={depositToVault} type="button" disabled={loading}>
              Confirm deposit
            </button>
          </div>
        </Modal>
      )}

      <div className="toast-stack">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.tone}`}>
            {toast.message}
          </div>
        ))}
      </div>
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
