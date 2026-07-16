#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env, String,
};

fn setup_env<'a>() -> (Env, VaultLockContractClient<'a>, Address, Address, token::Client<'a>, token::StellarAssetClient<'a>) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, VaultLockContract);
    let client = VaultLockContractClient::new(&env, &contract_id);

    let fee_recipient = Address::generate(&env);
    let owner = Address::generate(&env);

    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(token_admin.clone());
    let token = token::Client::new(&env, &token_id);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_id);

    client.initialize(&fee_recipient, &500); // 500 bps = 5.00% penalty

    (env, client, owner, fee_recipient, token, token_admin_client)
}

#[test]
fn test_create_and_deposit() {
    let (env, client, owner, _fee_recipient, token, token_admin_client) = setup_env();

    // Mint tokens to owner
    token_admin_client.mint(&owner, &10_000);
    assert_eq!(token.balance(&owner), 10_000);

    let title = String::from_slice(&env, "Vacation Fund");
    let goal_amount = 5_000;
    let unlock_timestamp = 100_000;

    let vault_id = client.create_vault(&owner, &title, &goal_amount, &unlock_timestamp, &token.address);
    assert_eq!(vault_id, 1);

    let vault = client.get_vault(&vault_id);
    assert_eq!(vault.vault_id, 1);
    assert_eq!(vault.owner, owner);
    assert_eq!(vault.balance, 0);
    assert_eq!(vault.goal_amount, 5_000);
    assert!(vault.is_active);

    let user_vaults = client.get_user_vaults(&owner);
    assert_eq!(user_vaults.len(), 1);
    assert_eq!(user_vaults.get(0).unwrap(), 1);

    // Deposit 1_000 into vault
    let new_balance = client.deposit(&owner, &vault_id, &1_000);
    assert_eq!(new_balance, 1_000);
    assert_eq!(token.balance(&owner), 9_000);
    assert_eq!(token.balance(&client.address), 1_000);

    let updated_vault = client.get_vault(&vault_id);
    assert_eq!(updated_vault.balance, 1_000);
}

#[test]
fn test_withdraw_locked_fails() {
    let (env, client, owner, _fee_recipient, token, token_admin_client) = setup_env();

    env.ledger().set_timestamp(10);
    token_admin_client.mint(&owner, &1_000);

    let vault_id = client.create_vault(
        &owner,
        &String::from_slice(&env, "Emergency Reserve"),
        &5_000,
        &100_000,
        &token.address,
    );

    client.deposit(&owner, &vault_id, &1_000);

    // Time is 10 (< 100_000) and balance is 1_000 (< 5_000). Should fail!
    let res = client.try_withdraw(&vault_id);
    assert_eq!(res, Err(Ok(Error::VaultLocked)));
}

#[test]
fn test_withdraw_when_goal_reached() {
    let (env, client, owner, _fee_recipient, token, token_admin_client) = setup_env();

    env.ledger().set_timestamp(10);
    token_admin_client.mint(&owner, &10_000);

    let vault_id = client.create_vault(
        &owner,
        &String::from_slice(&env, "New Laptop"),
        &5_000,
        &100_000,
        &token.address,
    );

    client.deposit(&owner, &vault_id, &5_000);

    // Time is 10 (< 100_000), but balance is 5_000 (== goal_amount). Should succeed!
    let payout = client.withdraw(&vault_id);
    assert_eq!(payout, 5_000);
    assert_eq!(token.balance(&owner), 10_000);
    assert_eq!(token.balance(&client.address), 0);

    let vault = client.get_vault(&vault_id);
    assert_eq!(vault.balance, 0);
    assert!(!vault.is_active);
}

#[test]
fn test_withdraw_when_time_reached() {
    let (env, client, owner, _fee_recipient, token, token_admin_client) = setup_env();

    env.ledger().set_timestamp(10);
    token_admin_client.mint(&owner, &5_000);

    let vault_id = client.create_vault(
        &owner,
        &String::from_slice(&env, "Time Locked Savings"),
        &10_000,
        &100_000,
        &token.address,
    );

    client.deposit(&owner, &vault_id, &3_000);

    // Fast-forward ledger time past unlock_timestamp
    env.ledger().set_timestamp(100_001);

    // Balance is 3_000 (< 10_000 goal), but time >= unlock_timestamp. Should succeed!
    let payout = client.withdraw(&vault_id);
    assert_eq!(payout, 3_000);
    assert_eq!(token.balance(&owner), 5_000);

    let vault = client.get_vault(&vault_id);
    assert!(!vault.is_active);
}

#[test]
fn test_early_withdraw_with_penalty() {
    let (env, client, owner, fee_recipient, token, token_admin_client) = setup_env();

    env.ledger().set_timestamp(10);
    token_admin_client.mint(&owner, &10_000);

    let vault_id = client.create_vault(
        &owner,
        &String::from_slice(&env, "Locked Fund with Penalty"),
        &5_000,
        &100_000,
        &token.address,
    );

    // Deposit 2_000
    client.deposit(&owner, &vault_id, &2_000);
    assert_eq!(token.balance(&owner), 8_000);

    // Early withdraw while locked (before time and before goal)
    let payout = client.early_withdraw(&vault_id);
    assert_eq!(payout, 2_000);

    // 5% of 2_000 is 100 penalty amount. Payout net to owner is 1_900.
    assert_eq!(token.balance(&fee_recipient), 100);
    assert_eq!(token.balance(&owner), 8_000 + 1_900); // 9_900 total
    assert_eq!(token.balance(&client.address), 0);

    let vault = client.get_vault(&vault_id);
    assert_eq!(vault.balance, 0);
    assert!(!vault.is_active);
}
