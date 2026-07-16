#![no_std]
//! # VaultLock (StellarVault) - Solo On-Chain Savings Vault
//!
//! A production-ready Soroban smart contract enabling self-custodial, time-locked, and
//! target-locked savings vaults on the Stellar network. Enforces cryptographic discipline
//! by preventing early withdrawals without condition evaluation (`Error::VaultLocked`),
//! while providing a 5% early withdrawal emergency penalty mechanism (`early_withdraw`).

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, Env, String, Vec,
};

/// Numeric error codes returned on-chain during failed verification steps.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    /// The contract has already been initialized with a fee recipient and penalty basis points.
    AlreadyInitialized = 1,
    /// The contract requires `initialize()` before vault operations can be executed.
    NotInitialized = 2,
    /// Vault goal target must be strictly positive (`> 0`).
    InvalidGoalAmount = 3,
    /// Penalty basis points (`bps`) cannot exceed 10000 (100.00%).
    InvalidPenaltyRate = 4,
    /// Requested `vault_id` entry does not exist in `DataKey::VaultInfo`.
    VaultNotFound = 5,
    /// Vault has already been withdrawn (`is_active == false`).
    VaultInactive = 6,
    /// Vault condition unfulfilled (`current_timestamp < unlock_timestamp && balance < goal_amount`).
    VaultLocked = 7,
    /// Deposit transfer amount must be strictly greater than zero (`> 0`).
    InvalidDepositAmount = 8,
    /// Caller authorization verification (`require_auth()`) failed.
    Unauthorized = 9,
    /// Integer arithmetic computation overflowed or underflowed safe bounds.
    ArithmeticOverflow = 10,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContractConfig {
    pub fee_recipient: Address,
    pub penalty_bps: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
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

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Config,
    VaultCounter,
    VaultInfo(u64),
    UserVaults(Address),
}

#[contract]
pub struct VaultLockContract;

#[contractimpl]
impl VaultLockContract {
    /// Initializes the VaultLock contract with a fee recipient and early withdrawal penalty rate in basis points (100 bps = 1%).
    pub fn initialize(env: Env, fee_recipient: Address, penalty_bps: u32) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Config) {
            return Err(Error::AlreadyInitialized);
        }
        if penalty_bps > 10_000 {
            return Err(Error::InvalidPenaltyRate);
        }

        let config = ContractConfig {
            fee_recipient,
            penalty_bps,
        };
        env.storage().instance().set(&DataKey::Config, &config);
        env.storage().instance().set(&DataKey::VaultCounter, &0u64);
        Ok(())
    }

    /// Creates a personal savings vault with a target goal amount, time-lock timestamp, token asset, and custom title.
    pub fn create_vault(
        env: Env,
        owner: Address,
        title: String,
        goal_amount: i128,
        unlock_timestamp: u64,
        asset: Address,
    ) -> Result<u64, Error> {
        owner.require_auth();

        if !env.storage().instance().has(&DataKey::Config) {
            return Err(Error::NotInitialized);
        }
        if goal_amount <= 0 {
            return Err(Error::InvalidGoalAmount);
        }

        let mut counter: u64 = env.storage().instance().get(&DataKey::VaultCounter).unwrap_or(0);
        counter = counter.checked_add(1).ok_or(Error::ArithmeticOverflow)?;
        env.storage().instance().set(&DataKey::VaultCounter, &counter);

        let vault = Vault {
            vault_id: counter,
            owner: owner.clone(),
            title,
            balance: 0,
            goal_amount,
            unlock_timestamp,
            asset,
            is_active: true,
        };

        env.storage().instance().set(&DataKey::VaultInfo(counter), &vault);

        let mut user_list: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::UserVaults(owner.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        user_list.push_back(counter);
        env.storage().instance().set(&DataKey::UserVaults(owner.clone()), &user_list);

        env.events()
            .publish((symbol_short!("created"), owner), (counter, goal_amount, unlock_timestamp));

        Ok(counter)
    }

    /// Deposits funds into an active vault. The caller must authorize the transfer.
    pub fn deposit(env: Env, depositor: Address, vault_id: u64, amount: i128) -> Result<i128, Error> {
        depositor.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidDepositAmount);
        }

        let mut vault: Vault = env
            .storage()
            .instance()
            .get(&DataKey::VaultInfo(vault_id))
            .ok_or(Error::VaultNotFound)?;

        if !vault.is_active {
            return Err(Error::VaultInactive);
        }

        let token = token::Client::new(&env, &vault.asset);
        token.transfer(&depositor, &env.current_contract_address(), &amount);

        vault.balance = vault
            .balance
            .checked_add(amount)
            .ok_or(Error::ArithmeticOverflow)?;

        env.storage().instance().set(&DataKey::VaultInfo(vault_id), &vault);

        env.events()
            .publish((symbol_short!("deposit"), depositor), (vault_id, amount, vault.balance));

        Ok(vault.balance)
    }

    /// Withdraws full balance if time-lock has expired OR goal amount has been reached.
    pub fn withdraw(env: Env, vault_id: u64) -> Result<i128, Error> {
        let mut vault: Vault = env
            .storage()
            .instance()
            .get(&DataKey::VaultInfo(vault_id))
            .ok_or(Error::VaultNotFound)?;

        vault.owner.require_auth();

        if !vault.is_active {
            return Err(Error::VaultInactive);
        }

        let current_time = env.ledger().timestamp();
        let time_unlocked = current_time >= vault.unlock_timestamp;
        let goal_unlocked = vault.balance >= vault.goal_amount;

        if !time_unlocked && !goal_unlocked {
            return Err(Error::VaultLocked);
        }

        let payout = vault.balance;
        if payout > 0 {
            let token = token::Client::new(&env, &vault.asset);
            token.transfer(&env.current_contract_address(), &vault.owner, &payout);
        }

        vault.balance = 0;
        vault.is_active = false;
        env.storage().instance().set(&DataKey::VaultInfo(vault_id), &vault);

        env.events()
            .publish((symbol_short!("withdraw"), vault.owner.clone()), (vault_id, payout));

        Ok(payout)
    }

    /// Emergency early withdrawal before conditions are met. Applies the configured penalty fee as a deterrent against impulse withdrawals.
    pub fn early_withdraw(env: Env, vault_id: u64) -> Result<i128, Error> {
        let mut vault: Vault = env
            .storage()
            .instance()
            .get(&DataKey::VaultInfo(vault_id))
            .ok_or(Error::VaultNotFound)?;

        vault.owner.require_auth();

        if !vault.is_active {
            return Err(Error::VaultInactive);
        }

        let config: ContractConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(Error::NotInitialized)?;

        let payout = vault.balance;
        if payout > 0 {
            let penalty_amount = (payout as i128)
                .checked_mul(config.penalty_bps as i128)
                .ok_or(Error::ArithmeticOverflow)? / 10_000;
            let net_amount = payout
                .checked_sub(penalty_amount)
                .ok_or(Error::ArithmeticOverflow)?;

            let token = token::Client::new(&env, &vault.asset);
            if penalty_amount > 0 {
                token.transfer(&env.current_contract_address(), &config.fee_recipient, &penalty_amount);
            }
            if net_amount > 0 {
                token.transfer(&env.current_contract_address(), &vault.owner, &net_amount);
            }
        }

        vault.balance = 0;
        vault.is_active = false;
        env.storage().instance().set(&DataKey::VaultInfo(vault_id), &vault);

        env.events()
            .publish((symbol_short!("early_wd"), vault.owner.clone()), (vault_id, payout));

        Ok(payout)
    }

    /// Read-only getter for specific vault data.
    pub fn get_vault(env: Env, vault_id: u64) -> Result<Vault, Error> {
        env.storage()
            .instance()
            .get(&DataKey::VaultInfo(vault_id))
            .ok_or(Error::VaultNotFound)
    }

    /// Read-only getter for all vault IDs owned by an address.
    pub fn get_user_vaults(env: Env, owner: Address) -> Vec<u64> {
        env.storage()
            .instance()
            .get(&DataKey::UserVaults(owner))
            .unwrap_or_else(|| Vec::new(&env))
    }
}

#[cfg(test)]
mod test;
