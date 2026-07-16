# 🪐 VaultLock (StellarVault) — Solo On-Chain Savings Vault

[![Stellar Soroban](https://img.shields.io/badge/Stellar-Soroban%20Smart%20Contracts-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Rust](https://img.shields.io/badge/Rust-1.80+-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **One-Line Pitch:** A personal savings smart contract on Stellar Soroban that locks your deposits until a target goal date or goal target amount is reached — protecting you from your own impulse to withdraw early, with zero third parties holding your funds.

---

## 📖 1. Problem Statement

Saving money consistently is hard because funds are *too easy* to access. People set ambitious savings goals—whether for an emergency buffer, a vacation, or new hardware—but frequently dip into their savings the moment a "small emergency" or impulse buying temptation arises. Traditional savings accounts offer no meaningful barrier to early withdrawal, and most existing crypto tools either require trusting a centralized app company or locking funds in rigid staking protocols with no flexibility.

**VaultLock (StellarVault)** solves this by providing a self-custodial, trustless time-lock and goal-lock smart contract powered by **Stellar Soroban**. Your commitment is enforced entirely by immutable on-chain code: you cannot withdraw your funds until either your **Target Date** arrives or your **Goal Amount** is fully achieved.

---

## ⚡ 2. Why Stellar & Soroban?

- **Low Transaction Fees (Fractions of a Cent):** Weekly or monthly micro-deposits stay economically viable. Unlike Ethereum or Layer 1s where gas fees eat into small savings, Stellar enables $5 or $10 deposits with negligible cost.
- **Sub-Second Finality:** Deposits, vault creations, and withdrawals confirm almost instantly, delivering a responsive, app-like user experience without long confirmation times.
- **Soroban Rust Smart Contracts:** Provides robust, deterministic time-based and conditional enforcement (`env.ledger().timestamp()`) that a traditional bank app cannot offer without centralized trust.
- **Self-Custody:** Your funds live in a smart contract verifiable by your address (`owner.require_auth()`). No intermediary, bank, or startup holds your private keys or controls your savings.

---

## 🎯 3. Target Users

1. **Everyday Savers Building Discipline:** Individuals trying to build a recurring savings habit (e.g., saving for a trip, gadget, or tax reserve) who struggle with impulse spending.
2. **Crypto-Native Users:** Holders seeking a transparent, trustless mechanism to "diamond hand" or ring-fence assets without relying on centralized yield platforms.
3. **DeFi Pragmatists:** Users interested in practical, real-world utility tools built on Stellar rather than complex speculative derivatives.

---

## 🏗️ 4. Technical Architecture

```
+-----------------------------------------------------------------------+
|                       Next-Gen React Frontend                         |
|  +---------------------+  +--------------------+  +----------------+  |
|  | Freighter Wallet UI |  | Judge Sandbox Mode |  | Dashboard Grid |  |
|  +---------------------+  +--------------------+  +----------------+  |
+-----------------------------------+-+---------------------------------+
                                    | |
              RPC / SDK Queries     | | Transaction Invocation
                                    v v
+-----------------------------------------------------------------------+
|                  Soroban Smart Contract (Rust / Wasm)                 |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |  create_vault(owner, title, goal_amount, unlock_date, asset)    |  |
|  +-----------------------------------------------------------------+  |
|  |  deposit(vault_id, amount) -> updates balance & progress        |  |
|  +-----------------------------------------------------------------+  |
|  |  withdraw(vault_id) -> verifies time >= unlock OR bal >= goal   |  |
|  +-----------------------------------------------------------------+  |
|  |  early_withdraw(vault_id) -> applies 5% penalty as deterrent    |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

### Smart Contract Entry Points (`contracts/vaultlock/src/lib.rs`)
- `initialize(env, fee_recipient, penalty_bps)`: Configures administrative parameters such as the early withdrawal penalty rate (`500 bps` = `5.00%`).
- `create_vault(env, owner, title, goal_amount, unlock_timestamp, asset)`: Initializes a new isolated vault and returns a unique `u64` vault identifier.
- `deposit(env, depositor, vault_id, amount)`: Transfers ERC-20/SEP-41 tokens from the depositor to the contract and increments the vault balance.
- `withdraw(env, vault_id)`: Verifies that either the current ledger timestamp `env.ledger().timestamp()` is $\ge$ `unlock_timestamp` OR `balance` $\ge$ `goal_amount`. Transfers full balance to owner on success.
- `early_withdraw(env, vault_id)`: Allows an emergency exit before conditions are met, but deducts a **5% penalty fee** sent to a community fee pool (`fee_recipient`), deterring impulse withdrawals while preventing fund loss during genuine emergencies.
- `get_vault(env, vault_id)` & `get_user_vaults(env, owner)`: Read-only getters for UI synchronization.

### Frontend Application (`frontend/`)
- Built with **React 18**, **Vite**, **TypeScript**, and **Vanilla CSS**.
- Features a rich **Glassmorphic Dark Mode** aesthetic with neon progress indicators and dynamic micro-animations.
- Includes a dedicated **Judge Sandbox / Simulation Mode**, enabling evaluators and judges to fast-forward ledger time (`+7 Days`, `+30 Days`) or simulate instant deposits and conditional withdrawals directly inside their browser without needing testnet XLM.

---

## 🧠 5. Complexity Evaluation

### 1. Time-Based Enforcement & Ledger Clocks
Checking time on-chain requires querying `env.ledger().timestamp()` directly within Soroban. Unlike web servers where system clocks can be manipulated, Soroban guarantees that ledger timestamps are monotonically increasing and cryptographically agreed upon by validators. The contract ensures no withdrawal can bypass this check unless the secondary condition (`balance >= goal_amount`) is satisfied.

### 2. Multi-Condition Fund Release Logic
The `withdraw` function must safely evaluate dual conditions:
$$\text{CanWithdraw} = (\text{CurrentTime} \ge \text{UnlockDate}) \lor (\text{CurrentBalance} \ge \text{GoalAmount})$$
If neither condition holds, the transaction aborts cleanly (`Error::VaultLocked`), consuming minimal gas while keeping the user's funds protected.

### 3. Precision Penalty Calculation (`early_withdraw`)
To deter impulse withdrawals, an optional stretch feature allows early withdrawals subject to a **5% penalty fee**. In Soroban's fixed-point integer environment (`i128`), we compute the exact penalty without precision loss using basis points (`bps`):
$$\text{PenaltyAmount} = \frac{\text{Balance} \times \text{PenaltyBPS}}{10,000}$$
$$\text{NetAmount} = \text{Balance} - \text{PenaltyAmount}$$
The contract performs two atomic token transfers: `PenaltyAmount` to the designated `fee_recipient` (community treasury) and `NetAmount` back to the vault owner.

### 4. Per-User Multi-Vault State Isolation
Instead of a single global balance per address, VaultLock assigns a unique `u64` ID to every vault created (`DataKey::VaultCounter`). Each vault maintains an independent `Vault` struct (`DataKey::VaultInfo(vault_id)`), while user ownership lists (`DataKey::UserVaults(owner)`) track all active and archived goals for instant UI rendering.

---

## 🗺️ 6. Roadmap

| Phase | Milestone | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Level 4** | **Core MVP** | ✅ **Completed** | Single & multi-vault creation, deposit logic, time-lock/goal-lock withdrawal verification, comprehensive Rust test suite (`src/test.rs`), and interactive frontend app. |
| **Level 5** | **User Acquisition & Stretch Features** | ✅ **Completed** | Added `early_withdraw` penalty mechanism (`5%` fee pool), multi-vault categorization (`Vacation`, `Hardware`, `Emergency`), and Judge Sandbox time-travel simulator. |
| **Level 6+** | **Mainnet Deployment & Stablecoins** | 🔄 **Next Phase** | Security audit of locking math, full integration with Soroban SEP-41 USDC stablecoins so savings don't fluctuate with market volatility, and automated recurring deposits via Soroban cron keepers. |

---

## 💻 7. Getting Started & Verification

### Prerequisites
- **Rust (`1.80+`)** & `cargo`
- **Stellar CLI (`stellar --version >= 26.0.0`)**
- **Node.js (`v20+`)** & `npm`

---

### Step 1: Run Soroban Smart Contract Tests (`cargo test`)
The contract includes a comprehensive suite of unit tests simulating the exact ledger environments and edge cases:

```bash
cd contracts/vaultlock
cargo test -- --nocapture
```

**What the tests verify:**
- `test_create_and_deposit`: Verifies vault creation, ID incrementing, and balance tracking.
- `test_withdraw_when_goal_reached`: Confirms successful unlock when `balance >= goal_amount` before target time.
- `test_withdraw_when_time_reached`: Confirms successful unlock when `env.ledger().set_timestamp(...)` exceeds target time.
- `test_withdraw_locked_fails`: Asserts that `withdraw()` panics with `Error::VaultLocked` when locked.
- `test_early_withdraw_with_penalty`: Verifies the exact `5.00%` penalty deduction and token split between owner and fee recipient.

---

### Step 2: Launch the Frontend Web Application

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173/` (or the port shown in your terminal).

#### Testing with the Built-in Judge Sandbox Mode:
1. **Explore Default Vaults:** View preset vaults such as *"RiseIn Stellar Hackathon Trip"*, *"MacBook Pro M4 Fund"*, and *"Emergency Reserve"*.
2. **Simulate Deposits:** Click **Deposit** on any locked vault and add `+50 XLM` or `+100 XLM` to see the live progress bar and completion percentage update instantly.
3. **Time Travel (+7 Days / +30 Days):** Use the top **Judge Sandbox Bar** to fast-forward the simulated ledger timestamp. Watch locked vaults dynamically transition to **🎉 Unlocked** as the target date is reached!
4. **Test Early Withdrawal Deterrent:** Click **Early Withdraw** on any locked vault to inspect the 5% penalty calculation breakdown and see how impulse withdrawals are deterred.

---

## 👤 Author & Repository
- **GitHub Username:** [rahul7686](https://github.com/rahul7686)
- **Repository:** [https://github.com/rahul7686/StellarVault](https://github.com/rahul7686/StellarVault)
