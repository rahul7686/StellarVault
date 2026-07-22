/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VAULTLOCK_RPC_URL?: string;
  readonly VITE_VAULTLOCK_NETWORK_PASSPHRASE?: string;
  readonly VITE_VAULTLOCK_CONTRACT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
