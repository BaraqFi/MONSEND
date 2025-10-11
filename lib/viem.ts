import { defineChain } from 'viem'
import { createPublicClient, http } from 'viem'

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://testnet.monad.xyz',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url:
        process.env.NEXT_PUBLIC_MONAD_EXPLORER ||
        'https://testnet.monadexplorer.com',
    },
  },
})

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

