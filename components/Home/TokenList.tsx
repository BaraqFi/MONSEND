'use client'

import { publicClient } from '@/lib/viem'
import { useEffect, useState } from 'react'
import { formatUnits, formatEther, type Address } from 'viem'

interface Token {
  address: Address | 'native'
  symbol: string
  name: string
  decimals: number
  balance: string
  logo?: string
  isNative?: boolean
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

interface TokenListProps {
  address: Address
  refreshTrigger?: number
}

export function TokenList({ address, refreshTrigger }: TokenListProps) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true)

      const tokenData: Token[] = []

      // First, add MON (native token)
      try {
        const monBalance = await publicClient.getBalance({ address })
        tokenData.push({
          address: 'native',
          symbol: 'MON',
          name: 'MON',
          decimals: 18,
          balance: formatEther(monBalance),
          isNative: true,
        })
      } catch (error) {
        console.error('Failed to fetch MON balance:', error)
      }

      // Then add ERC-20 tokens
      const tokenAddresses: Address[] = [
        // Add known Monad Testnet token addresses here
        // Example: '0x...' as Address,
      ]

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

          tokenData.push({
            address: tokenAddress,
            symbol,
            name,
            decimals,
            balance: formatUnits(balance, decimals),
            isNative: false,
          })
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
  }, [address, refreshTrigger])

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <div
          key={token.address}
          className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {token.symbol.slice(0, 1)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{token.symbol}</p>
              <p className="text-sm text-gray-400">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-white text-xl">
              {Number.parseFloat(token.balance).toFixed(6)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

