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
