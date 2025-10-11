'use client'

import { publicClient } from '@/lib/viem'
import { useEffect, useState } from 'react'
import { formatUnits, type Address } from 'viem'

interface Token {
  address: Address
  symbol: string
  name: string
  decimals: number
  balance: string
  logo?: string
}

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function TokenList({ address }: { address: Address }) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true)

      // Common token addresses on Monad Testnet
      // You can expand this list with known token addresses
      const tokenAddresses: Address[] = [
        // Add known Monad Testnet token addresses here
        // Example: '0x...' as Address,
      ]

      const tokenData: Token[] = []

      for (const tokenAddress of tokenAddresses) {
        try {
          const [balance, decimals, symbol, name] = await Promise.all([
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'balanceOf',
              args: [address],
            }),
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'decimals',
            }),
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'symbol',
            }),
            publicClient.readContract({
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: 'name',
            }),
          ])

          if (balance > BigInt(0)) {
            tokenData.push({
              address: tokenAddress,
              symbol,
              name,
              decimals,
              balance: formatUnits(balance, decimals),
            })
          }
        } catch (error) {
          console.error(`Failed to fetch token ${tokenAddress}:`, error)
        }
      }

      setTokens(tokenData)
      setIsLoading(false)
    }

    fetchTokens()

    // Refresh tokens every 30 seconds
    const interval = setInterval(fetchTokens, 30000)
    return () => clearInterval(interval)
  }, [address])

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">Loading tokens...</p>
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">No tokens found</p>
        <p className="text-gray-500 text-xs mt-2">
          Your ERC-20 tokens will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tokens.map((token) => (
        <div
          key={token.address}
          className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg hover:bg-[#252541] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {token.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white">{token.symbol}</p>
              <p className="text-xs text-gray-400">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-white">{token.balance}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

