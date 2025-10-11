# MONSEND

A Farcaster Mini App for sending and receiving MON tokens on Monad Testnet.

## Features

✅ **View Balance** - Display your MON (Monad Testnet native token) balance in real-time
✅ **Send Tokens** - Send MON to any address directly from your Farcaster wallet
✅ **Auto-refresh** - Balance updates every 10 seconds automatically
✅ **Transaction History** - View your transactions on Monad Explorer
✅ **Mobile-First Design** - Optimized for Warpcast and other Farcaster clients

## Tech Stack

- **Farcaster Mini App SDK** - Wallet integration
- **Viem** - Blockchain interactions
- **Wagmi** - React Hooks for Ethereum
- **Next.js 14** - App Router
- **Tailwind CSS** - Styling
- **Monad Testnet** - Chain ID: 10143

## Files Created

### Core Files
- `lib/viem.ts` - Monad Testnet configuration and Viem clients
- `components/Home/Wallet.tsx` - Main wallet component with connection logic
- `components/Home/WalletBalance.tsx` - Balance display component
- `components/Home/SendTokens.tsx` - Send transaction component

### Updated Files
- `components/pages/app.tsx` - Now uses Wallet component
- `app/page.tsx` - Updated metadata for wallet app

## Environment Variables

You mentioned you already set these up in step 2:

```bash
NEXT_PUBLIC_URL=<your-url>
NEXT_PUBLIC_MONAD_RPC_URL=<your-monad-rpc-url>
NEXT_PUBLIC_MONAD_EXPLORER=<your-monad-explorer-url>
```

## How to Run

### 1. Install Dependencies (if not already done)
```bash
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

Your app will run on `http://localhost:5050`

### 3. Expose Localhost (for testing in Farcaster)
In a separate terminal:
```bash
cloudflared tunnel --url http://localhost:5050
```

### 4. Update Environment Variable
Copy the cloudflared URL and set it in `.env.local`:
```bash
NEXT_PUBLIC_URL=https://your-subdomain.trycloudflare.com
```

### 5. Test in Farcaster Embed Tool
Visit: https://farcaster.xyz/~/developers/mini-apps/embed

Enter your cloudflared URL and test your wallet app!

## User Flow

1. **Open the Mini App** → User sees splash screen
2. **Connect Wallet** → User connects their Farcaster wallet
3. **Switch to Monad Testnet** → App prompts to switch if on wrong network
4. **View Balance** → Displays MON balance with auto-refresh
5. **Send Tokens** → Enter recipient address and amount, then send
6. **View Transaction** → Click link to view transaction on Monad Explorer

## Features Breakdown

### WalletBalance Component
- Fetches balance using `publicClient.getBalance()`
- Auto-refreshes every 10 seconds
- Displays balance in ETH format (MON)
- Shows shortened address

### SendTokens Component
- Input validation for address and amount
- Checks if user is on correct chain
- Auto-switches to Monad Testnet if needed
- Shows transaction status (pending/success/error)
- Links to Monad Explorer for successful transactions

### Wallet Component
- Handles wallet connection states:
  - Not available (wrong client)
  - Not connected
  - Wrong network
  - Connected and ready
- Clean, mobile-first UI
- Disconnect functionality

## Customization

### Change Colors
Edit Tailwind classes in the component files:
- Primary button: `bg-blue-600 hover:bg-blue-700`
- Secondary button: `bg-gray-600 hover:bg-gray-700`
- Success: `bg-green-100 border-green-400`
- Error: `bg-red-100 border-red-400`

### Change Images
Replace these files in `public/images/`:
- `feed.png` - Embed image (3:2 ratio)
- `splash.png` - App icon (200x200px)
- `icon.png` - App icon

### Add ERC-20 Token Support
Extend `WalletBalance.tsx` to fetch ERC-20 balances using:
```typescript
const balance = await publicClient.readContract({
  address: tokenAddress,
  abi: erc20ABI,
  functionName: 'balanceOf',
  args: [userAddress],
})
```

## Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_URL` → Your Vercel deployment URL
- `NEXT_PUBLIC_MONAD_RPC_URL` → Your Monad RPC endpoint
- `NEXT_PUBLIC_MONAD_EXPLORER` → Monad Explorer URL

## Resources

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/)
- [Monad Documentation](https://docs.monad.xyz/)
- [Viem Documentation](https://viem.sh/)
- [Wagmi Documentation](https://wagmi.sh/)

## Next Steps

Consider adding:
- Transaction history display
- ERC-20 token support
- QR code scanner for addresses
- Address book functionality
- Gas estimation
- Transaction confirmation modals
- Multi-send functionality

Enjoy building! 🚀

