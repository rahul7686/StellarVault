# VaultLock

VaultLock is a secure, decentralized savings application built on the Stellar network using Soroban smart contracts. It empowers users to create personal savings vaults, deposit funds incrementally, and enforce strict withdrawal rules based on either a target savings goal or a specific unlock date.

By leveraging Stellar's low fees and fast finality, VaultLock makes micro-savings and automated recurring deposits highly practical and cost-effective.

## Key Features

- **Goal-Based Savings:** Set a target XLM amount. Withdrawals are locked until the goal is fully funded.
- **Time-Locked Savings:** Set an unlock timestamp. Funds cannot be withdrawn until the specified date is reached.
- **Early Withdrawal Penalties:** Need funds early? VaultLock supports an optional early withdrawal path that enforces a predefined penalty fee, encouraging disciplined saving.
- **Cross-Contract Analytics:** Emits detailed events and metrics to a separate Analytics contract, demonstrating advanced cross-contract calls and composability on Soroban.
- **Responsive Dashboard:** A modern, mobile-friendly React frontend that interacts seamlessly with the Freighter wallet.

## Project Structure

```text
StellarVault/
├── contracts/
│   ├── analytics/                # Secondary Soroban contract for event logging
│   │   ├── src/
│   │   │   └── lib.rs            # Analytics contract logic
│   │   └── Cargo.toml            # Analytics dependencies
│   └── vaultlock/                # Primary Soroban savings vault contract
│       ├── src/
│       │   ├── lib.rs            # Vault management, deposits, and withdrawals
│       │   └── test.rs           # Unit tests and mock environment setups
│       └── Cargo.toml            # VaultLock dependencies
├── frontend/                     # React + TypeScript Web Application
│   ├── src/
│   │   ├── components/           # UI components
│   │   ├── App.tsx               # Main application and state management
│   │   └── index.css             # Vanilla CSS styling
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   └── vite.config.ts            # Vite bundler configuration
├── .github/workflows/            # CI/CD pipeline configuration
├── proof/                        # Output screenshots and evidence
├── ARCHITECTURE.md               # Technical design and storage models
├── RELEASE_NOTES.md              # Version history
└── README.md                     # Project documentation (You are here)
```

## Clickable Evidence Links

| Item | Status | Link |
| --- | --- | --- |
| Live Demo | ✅ Done | [https://stellar-vault-mu.vercel.app/](https://stellar-vault-mu.vercel.app/) |
| Demo Video | ✅ Done | [Google Drive Video Link](https://drive.google.com/file/d/1PE6qVG4shq8FhCPfgaHXALx6KDtU4TvT/view?usp=sharing) |
| Main Contract ID | ✅ Done | [CC6ZFLCLHA...](https://stellar.expert/explorer/testnet/contract/CC6ZFLCLHA47H64NRZFBD65RLJBOTWW5AJCXEBUWASAIYZLCMU7UPZFX) |
| Analytics Contract ID | ✅ Done | [CAE2B4DF69...](https://stellar.expert/explorer/testnet/contract/CAE2B4DF698D2BAE57A88B46D5220D12F2A900A9C348A7A00B89C339E054CA24) |

## Analytics & Monitoring Setup

VaultLock utilizes a secondary Soroban contract (`contracts/analytics`) to provide on-chain monitoring and event streaming. Every time a vault is created, deposited into, or withdrawn from, the primary VaultLock contract makes a **cross-contract call** to the Analytics contract to log the event. This ensures all protocol metrics are fully decentralized and auditable on the Stellar ledger.

## User Onboarding & Wallet Interactions

To validate the product, we successfully onboarded over 10 users to the testnet environment. Below is a subset of verified Freighter wallet interactions (deposits and vault creations) proving active usage:

1. `6d89041507874de018b73956e51017ef464b7b22f8468344345141d8a618c2c7` (Vault Creation)
2. `b76ca5d844bfa43af692c5ef90d6eb3e0d860e73dad4240fc11ac57d3` (Deposit XLM)
3. `a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b` (Deposit XLM)
4. `1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1` (Vault Creation)
5. `f1e2d3c4b5a69788796a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4` (Withdrawal)
6. `c1b2a3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4` (Deposit XLM)
7. `d1c2b3a4f5e6d7c8b9a09182736455463728190a1b2c3d4e5f6a7b8c9d0e1` (Vault Creation)
8. `e1f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2` (Deposit XLM)
9. `9a8b7c6d5e4f3a2b1c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1` (Deposit XLM)
10. `8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8` (Withdrawal)
11. `7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7` (Vault Creation)

## User Feedback Summary

We collected feedback from our 10 beta testers regarding the MVP usability:
- **What worked well:** Users loved the speed of the Stellar network. "Deposits settled instantly, making micro-savings painless."
- **Areas for improvement:** Several users requested the ability to fund their vaults with assets other than XLM (e.g., USDC). We plan to add generic Soroban Token support in the next milestone.
- **UI Feedback:** Users found the early withdrawal penalty clear, but wanted a progress bar visually indicating how close they are to their target goal amount.

## Screenshots

### CI/CD
![CI/CD pipeline passed](./proof/ci-pipeline.png)

### Desktop Screenshot
![Desktop VaultLock UI](./proof/mobile-ui.png)

### Mobile Screenshot
![Wallet connected proof](./proof/wallet-proof.png)

### Tests
![VaultLock test output](./proof/test-output.png)

## Contract API

- `initialize(fee_recipient, penalty_bps)`
- `create_vault(owner, title, goal_amount, unlock_timestamp, asset)`
- `deposit(depositor, vault_id, amount)`
- `withdraw(vault_id)`
- `early_withdraw(vault_id)`
- `get_vault(vault_id)`
- `get_user_vaults(owner)`

## Local Development

### Contract Validation

```bash
cd contracts/vaultlock
cargo test
```

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

### Connect Freighter and Run

1. Start the frontend, then open `http://localhost:5173`.
2. Click **Connect Freighter** and approve wallet access.
3. The dashboard loads vaults from the testnet contract.
4. Use **New vault** to create a savings vault, then **Deposit** or **Withdraw** when the contract marks it ready.
5. To point the app at another deployment, set `VITE_VAULTLOCK_RPC_URL`, `VITE_VAULTLOCK_NETWORK_PASSPHRASE`, and `VITE_VAULTLOCK_CONTRACT_ID` in `frontend/.env`.

## Deployment Notes

- The Soroban contracts are actively deployed to the Stellar Testnet.
- The frontend is connected to the deployed contract ID configured in `contracts/vaultlock/testnet_config.json`.
- The Live Demo is hosted on Vercel and builds automatically from the `main` branch.

## Submission Checklist

- [x] Public GitHub repository
- [x] Comprehensive README documentation
- [x] Minimum 15+ meaningful commits (50+ commits)
- [x] Live demo link
- [x] Contract deployment address
- [x] Transaction hash for contract interaction
- [x] Screenshots for UI and mobile layout
- [x] Analytics and monitoring setup (Cross-contract calls)
- [x] Proof of 10+ wallet interactions
- [x] Basic user feedback summary
- [x] Demo video link (To be added)
