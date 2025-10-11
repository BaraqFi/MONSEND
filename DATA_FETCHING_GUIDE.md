# MONSEND Data Fetching Guide

## 🔍 Current Status

### ✅ What's Working
- **MON Balance**: Always shows your native Monad token balance
- **Send/Receive**: Fully functional for MON tokens
- **Transaction History**: Scans last 50 blocks for your transactions

### ⚠️ What's Limited
- **ERC-20 Tokens**: Requires known contract addresses
- **NFTs**: Requires known NFT collection addresses  
- **Transaction History**: Limited to last 50 blocks (performance reasons)

## 📊 Why Are Tokens/NFTs Not Showing?

Without a blockchain indexer or API, we can only detect assets in two ways:

1. **Known Addresses**: You manually add token/NFT contract addresses
2. **Scanning Events**: Resource-intensive and slow

## 🚀 Best Solution: MonadScan API

Monad has **MonadScan** - their official blockchain explorer with an API!

### Get Free API Key:
1. Visit: https://info.monadscan.com/myapikey/
2. Create an account in ClientPortal
3. Generate free API key under "MyApiKey" section

### Add to `.env.local`:
```bash
NEXT_PUBLIC_MONADSCAN_API_KEY=your_api_key_here
```

### Benefits:
- ✅ Automatic token detection
- ✅ NFT discovery
- ✅ Complete transaction history
- ✅ Token prices and metadata
- ✅ Fast and efficient

## 🔧 Alternative: Manual Token Adding

### For Known Tokens:

Edit `components/Home/TokenList.tsx`:

```typescript
const tokenAddresses: Address[] = [
  '0x1234567890123456789012345678901234567890' as Address, // Your Token 1
  '0x0987654321098765432109876543210987654321' as Address, // Your Token 2
]
```

### For Known NFTs:

Edit `components/Home/NFTList.tsx`:

```typescript
const nftAddresses: Address[] = [
  '0xabcdef1234567890abcdef1234567890abcdef12' as Address, // NFT Collection 1
]
```

## 📈 Current Transaction History

**How it works:**
- Scans the last 50 blocks on Monad Testnet
- Finds all transactions to/from your address
- Shows sent (red) and received (green) transactions
- Auto-refreshes every 30 seconds

**Limitations:**
- Only sees recent transactions (last 50 blocks)
- May miss transactions if blocks scan is too limited
- Resource-intensive on the RPC

**Why 50 blocks?**
To avoid rate limiting and keep the app responsive. With MonadScan API, you can get complete history instantly.

## 🎯 Recommended Next Steps

### Option 1: For Simple Use (Current)
- ✅ Keep as-is for sending/receiving MON
- ✅ Transaction history shows recent activity
- ✅ No additional setup needed

### Option 2: Add MonadScan API (Recommended)
```bash
# Install axios for API calls
pnpm add axios

# Get API key from MonadScan
# Add to .env.local
```

Then update components to use MonadScan API endpoints:
- Tokens: `/api?module=account&action=tokentx`
- NFTs: `/api?module=account&action=tokennfttx`
- Transactions: `/api?module=account&action=txlist`

### Option 3: Use Third-Party Indexer
Monad supports these indexers:
- Alchemy
- Moralis
- QuickNode
- Goldsky
- SubQuery
- And more: https://docs.monad.xyz/tooling-and-infra/data-indexers

## 💡 Quick Example: Add Popular Tokens

If there are known popular tokens on Monad Testnet, you can add them:

```typescript
// Example: USDT, USDC, WETH equivalents on Monad
const tokenAddresses: Address[] = [
  '0x...' as Address, // Monad USDT
  '0x...' as Address, // Monad USDC
  '0x...' as Address, // Wrapped MON
]
```

## 🔄 Current Auto-Refresh Rates

- **Balance**: After every transaction
- **Tokens**: Every 30 seconds
- **NFTs**: Every 60 seconds
- **Transactions**: Every 30 seconds

All optimized to avoid rate limiting while staying responsive.

## 📝 Summary

Your MONSEND wallet works great for its main purpose: **sending and receiving MON tokens**!

For more advanced features (auto-detecting all tokens/NFTs), you'll want to:
1. Get a free MonadScan API key, OR
2. Manually add known token addresses

The current implementation prioritizes performance and simplicity while keeping core sending functionality perfect! 🚀

## 🆘 Need Help?

- MonadScan API Docs: https://info.monadscan.com/
- Monad Discord: https://discord.gg/monad
- Monad Docs: https://docs.monad.xyz/

