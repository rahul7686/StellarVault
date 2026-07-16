export interface Vault {
  id: number;
  title: string;
  balance: number; // in XLM or USDC
  goalAmount: number;
  unlockTimestamp: number; // Unix timestamp in seconds
  assetSymbol: 'XLM' | 'USDC';
  isActive: boolean;
  category: 'vacation' | 'hardware' | 'emergency' | 'general';
}

export interface SimulationState {
  currentTimestamp: number; // Simulated ledger timestamp in seconds
  totalSaved: number;
  penaltiesCollected: number;
  judgeMode: boolean;
  walletConnected: boolean;
  walletAddress: string;
}

export interface CreateVaultInput {
  title: string;
  goalAmount: number;
  unlockDays: number;
  assetSymbol: 'XLM' | 'USDC';
  category: 'vacation' | 'hardware' | 'emergency' | 'general';
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'error' | 'loading';
  message: string;
  detail?: string;
  duration?: number;
}

export interface WalletInteractionProof {
  txHash: string;
  timestamp: string;
  walletAddress: string;
  action: 'CREATE_VAULT' | 'DEPOSIT' | 'WITHDRAW' | 'EARLY_WITHDRAW' | 'CONNECT_WALLET';
  amount?: number;
  status: 'CONFIRMED' | 'FAILED' | 'PENDING';
}

export interface UserFeedbackEntry {
  id: string;
  userName: string;
  walletAddress: string;
  rating: number; // 1 to 5 stars
  comment: string;
  date: string;
}

export interface AnalyticsMetrics {
  totalUsersOnboarded: number;
  activeTestnetWallets: number;
  totalTransactionsExecuted: number;
  testnetGasSavedPercent: number;
  interactionProofs: WalletInteractionProof[];
  feedbacks: UserFeedbackEntry[];
}
