#!/bin/bash

# Script to setup Helius RPC for Trustplay
# Usage: ./setup-rpc.sh

echo "🚀 Trustplay RPC Setup Script"
echo "=============================="
echo ""
echo "This script will help you configure a better RPC endpoint for development."
echo ""
echo "Recommended: Helius (Free tier: 100 req/s, 3M credits/month)"
echo ""
echo "Steps:"
echo "1. Visit https://www.helius.dev/"
echo "2. Sign up for a free account"
echo "3. Create a new API key"
echo "4. Copy your API key"
echo ""
read -p "Have you created your Helius API key? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "Please create your API key first, then run this script again."
    echo "Visit: https://www.helius.dev/"
    exit 1
fi

echo ""
read -p "Enter your Helius API key: " api_key

if [ -z "$api_key" ]; then
    echo "Error: API key cannot be empty"
    exit 1
fi

# Backup existing .env.local
if [ -f "app/.env.local" ]; then
    cp app/.env.local app/.env.local.backup
    echo "✅ Backed up existing .env.local to .env.local.backup"
fi

# Update .env.local with Helius endpoint
cd app
cat > .env.local << EOF
# Solana RPC URL - Using Helius for better rate limits
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=${api_key}

# Frontend Base URL
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000

# Program ID (Your deployed Solana program)
NEXT_PUBLIC_PROGRAM_ID=5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe

# Solana Cluster (devnet, testnet, mainnet-beta)
NEXT_PUBLIC_SOLANA_CLUSTER=devnet

# Fallback RPC URLs (comma-separated)
NEXT_PUBLIC_FALLBACK_RPC_URLS=https://api.devnet.solana.com,https://rpc.ankr.com/solana_devnet
EOF

echo ""
echo "✅ Successfully updated app/.env.local with Helius RPC endpoint!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Test your application"
echo ""
echo "Your Helius endpoint: https://devnet.helius-rpc.com/?api-key=${api_key}"
echo ""
echo "Free tier limits:"
echo "- 100 requests per second"
echo "- 3,000,000 credits per month"
echo "- Perfect for development!"
echo ""
echo "🎉 Setup complete!"
