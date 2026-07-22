# VaultLock

VaultLock is a simple Stellar Soroban savings MVP that lets a user create a vault, deposit funds over time, and withdraw only when the unlock date or savings goal is reached.

## What it does

- Create a savings vault with a goal amount, unlock date, and asset
- Deposit XLM or USDC into the vault
- Lock withdrawals until the goal or time condition is met
- Support an optional early withdrawal path with a penalty
- Show a clean dashboard for vault progress and status

## Why Stellar

- Low fees make small recurring deposits practical
- Fast finality keeps the app responsive
- Soroban smart contracts enforce the lock on-chain

## Project Structure

- `contracts/vaultlock/` - Soroban smart contract and Rust tests
- `frontend/` - React + TypeScript dashboard
- `ARCHITECTURE.md` - design notes and storage model
- `RELEASE_NOTES.md` - release summary

## Contract API

- `initialize(fee_recipient, penalty_bps)`
- `create_vault(owner, title, goal_amount, unlock_timestamp, asset)`
- `deposit(depositor, vault_id, amount)`
- `withdraw(vault_id)`
- `early_withdraw(vault_id)`
- `get_vault(vault_id)`
- `get_user_vaults(owner)`

## MVP Goals

- Single-vault savings flow
- Goal or time based unlock
- Simple mobile-friendly UI
- Clear loading and status feedback
- Production-ready contract structure

## Local Development

### Contract

```bash
cd contracts/vaultlock
cargo test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Frontend Configuration

Copy `frontend/.env.example` to `frontend/.env` and fill in the values you want to use for the live contract.

Required variables:

- `VITE_VAULTLOCK_RPC_URL`
- `VITE_VAULTLOCK_NETWORK_PASSPHRASE`
- `VITE_VAULTLOCK_CONTRACT_ID`

The default example values point to the Stellar testnet setup used by this repo.

## Deployment Notes

- Deploy the Soroban contract to Stellar testnet
- Point the frontend to the deployed contract ID
- Add the final demo link, contract address, and user proof before submission

## Submission Checklist

- Public GitHub repository
- README documentation
- Minimum 15 meaningful commits
- Live demo link
- Contract deployment address
- Screenshots for UI and mobile layout
- Proof of 10+ wallet interactions
- Basic user feedback summary
