#!/usr/bin/env bash
set -e

echo "==========================================================="
echo "🪐 Deploying VaultLock Soroban Smart Contract to Testnet"
echo "==========================================================="

# 1. Build optimized Wasm contract
echo "-> Building Soroban Wasm target..."
cargo build --target wasm32-unknown-unknown --release

WASM_PATH="../../target/wasm32-unknown-unknown/release/vaultlock.wasm"

if [ ! -f "$WASM_PATH" ]; then
    echo "Error: Wasm file not found at $WASM_PATH. Did the build succeed?"
    exit 1
fi

echo "-> Optimizing Wasm file size..."
stellar contract optimize --wasm "$WASM_PATH"

# 2. Deploy to Stellar Testnet
echo "-> Deploying to Stellar Testnet via Stellar CLI..."
CONTRACT_ID=$(stellar contract deploy \
    --wasm "$WASM_PATH" \
    --source alice \
    --network testnet)

echo "✅ Contract successfully deployed to Testnet!"
echo "Contract ID: $CONTRACT_ID"

# 3. Save Contract ID for Frontend Environment
cat <<EOF > ../../frontend/.env.testnet
VITE_SOROBAN_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
VITE_CONTRACT_ID=$CONTRACT_ID
VITE_FEE_RECIPIENT_ADDRESS=GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXFOOZ4PR6DSPB
EOF

echo "-> Saved Testnet configuration to frontend/.env.testnet"
echo "Deployment complete! Run 'npm run dev' inside frontend/ to interact."
