#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    TotalDeposits,
    TotalVaults,
    DepositCount,
    WithdrawalCount,
}

#[contract]
pub struct AnalyticsContract;

#[contractimpl]
impl AnalyticsContract {
    pub fn log_vault(env: Env, _owner: Address) {
        let mut count: u64 = env.storage().instance().get(&DataKey::TotalVaults).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::TotalVaults, &count);
        env.events().publish((symbol_short!("log"), symbol_short!("vault")), count);
    }

    pub fn log_dep(env: Env, _depositor: Address, amount: i128) {
        let mut total: i128 = env.storage().instance().get(&DataKey::TotalDeposits).unwrap_or(0);
        total += amount;
        env.storage().instance().set(&DataKey::TotalDeposits, &total);

        let mut count: u64 = env.storage().instance().get(&DataKey::DepositCount).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::DepositCount, &count);

        env.events().publish((symbol_short!("log"), symbol_short!("deposit")), total);
    }

    pub fn log_with(env: Env, _owner: Address, _amount: i128) {
        let mut count: u64 = env.storage().instance().get(&DataKey::WithdrawalCount).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::WithdrawalCount, &count);
        env.events().publish((symbol_short!("log"), symbol_short!("withdraw")), count);
    }

    pub fn get_stats(env: Env) -> (u64, i128) {
        let vaults: u64 = env.storage().instance().get(&DataKey::TotalVaults).unwrap_or(0);
        let deposits: i128 = env.storage().instance().get(&DataKey::TotalDeposits).unwrap_or(0);
        (vaults, deposits)
    }

    pub fn get_metrics(env: Env) -> (u64, i128, u64, u64) {
        let vaults: u64 = env.storage().instance().get(&DataKey::TotalVaults).unwrap_or(0);
        let deposits: i128 = env.storage().instance().get(&DataKey::TotalDeposits).unwrap_or(0);
        let dep_count: u64 = env.storage().instance().get(&DataKey::DepositCount).unwrap_or(0);
        let wd_count: u64 = env.storage().instance().get(&DataKey::WithdrawalCount).unwrap_or(0);
        (vaults, deposits, dep_count, wd_count)
    }
}
