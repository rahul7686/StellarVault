# 📖 VaultLock Soroban Contract API Reference

This document provides complete documentation for the public methods, structures, error codes, and events exposed by the **VaultLock** smart contract deployed on the Stellar network.

---

## Data Structures

### `Vault`
```rust
pub struct Vault {
    pub vault_id: u64,
    pub owner: Address,
    pub title: String,
    pub balance: i128,
    pub goal_amount: i128,
    pub unlock_timestamp: u64,
    pub asset: Address,
    pub is_active: bool,
}
```

---

## Public Functions

### 1. `initialize`
Initializes the vault contract with a fee recipient address and early withdrawal penalty in basis points.

- **Parameters:**
  - `fee_recipient: Address` - Treasury account address that receives penalty fees.
  - `penalty_bps: u32` - Penalty fee in basis points (e.g., `500` = 5.00%). Max `10000`.
- **Returns:** `Result<(), Error>`

---

### 2. `create_vault`
Creates a new personal savings vault.

- **Parameters:**
  - `owner: Address` - Owner account (requires auth).
  - `title: String` - Name or description of the savings goal.
  - `goal_amount: i128` - Target balance in stroops (`1 XLM = 10,000,000 stroops`).
  - `unlock_timestamp: u64` - Unix timestamp when withdrawal becomes available.
  - `asset: Address` - Stellar token asset contract ID (e.g. Native XLM).
- **Returns:** `Result<u64, Error>` (Allocated `vault_id`)

---

### 3. `deposit`
Deposits tokens into an active vault.

- **Parameters:**
  - `depositor: Address` - Depositor account (requires auth).
  - `vault_id: u64` - ID of target vault.
  - `amount: i128` - Amount to deposit.
- **Returns:** `Result<i128, Error>` (Updated vault balance)

---

### 4. `withdraw`
Withdraws full vault funds when unlock conditions are met.

- **Conditions for Withdrawal:**
  - `ledger_timestamp >= unlock_timestamp` OR `balance >= goal_amount`.
- **Parameters:**
  - `vault_id: u64` - Target vault ID.
- **Returns:** `Result<i128, Error>` (Amount paid out to owner)

---

### 5. `early_withdraw`
Emergency early withdrawal path before conditions are met.

- **Effect:** Calculates `penalty_amount = (balance * penalty_bps) / 10000`. Transfers penalty to `fee_recipient` and net balance to `owner`. Marks vault `is_active = false`.
- **Parameters:**
  - `vault_id: u64` - Target vault ID.
- **Returns:** `Result<i128, Error>` (Gross amount withdrawn)

---

### 6. `extend_lock`
Extends the unlock timestamp of an active vault.

- **Parameters:**
  - `vault_id: u64` - Target vault ID.
  - `new_unlock_timestamp: u64` - Extended timestamp (must be strictly greater than current).
- **Returns:** `Result<u64, Error>`

---

### 7. `set_paused`
Toggles contract emergency pause state (Admin only).

- **Parameters:**
  - `admin: Address` - Administrative account (must equal `fee_recipient`).
  - `paused: bool` - `true` to pause contract, `false` to resume.
- **Returns:** `Result<(), Error>`

---

## On-Chain Error Codes

| Code | Variant | Description |
|---|---|---|
| 1 | `AlreadyInitialized` | Contract `initialize()` has already been called. |
| 2 | `NotInitialized` | Contract requires initialization before processing requests. |
| 3 | `InvalidGoalAmount` | Goal target must be strictly positive (`> 0`). |
| 4 | `InvalidPenaltyRate` | Penalty rate exceeds 10,000 basis points (100%). |
| 5 | `VaultNotFound` | Specified `vault_id` does not exist. |
| 6 | `VaultInactive` | Vault has already been completed or withdrawn. |
| 7 | `VaultLocked` | Neither time-lock timestamp nor goal target balance has been reached. |
| 8 | `InvalidDepositAmount` | Deposit amount must be strictly greater than zero (`> 0`). |
| 9 | `Unauthorized` | Caller fails `require_auth()` check. |
| 10 | `ArithmeticOverflow` | Numeric computation overflowed safe 128-bit boundaries. |
| 11 | `InvalidUnlockTimestamp` | New unlock timestamp must exceed existing unlock timestamp. |
| 12 | `ContractPaused` | Protocol operations currently paused by administration. |
