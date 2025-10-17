'use client'

import { CircleDollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatEther, formatUnits, type Address } from 'viem'

import { useTheme } from '@/components/theme-provider'
import { publicClient } from '@/lib/viem'

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
  const { theme } = useTheme()
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

    // Refresh tokens every 10 seconds (faster than before)
    const interval = setInterval(fetchTokens, 10000)
    return () => clearInterval(interval)
  }, [address, refreshTrigger])

  const cardBg = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-lg p-4 ${cardBg}`}
          >
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-700" />
              <div>
                <div className="h-5 w-20 animate-pulse rounded bg-gray-700" />
                <div className="mt-1 h-4 w-12 animate-pulse rounded bg-gray-700" />
              </div>
            </div>
            <div className="h-6 w-24 animate-pulse rounded bg-gray-700" />
          </div>
        ))}
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className={`text-sm ${textSecondary}`}>No tokens found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <div
          key={token.address}
          className={`flex items-center justify-between rounded-lg p-4 ${cardBg}`}
        >
          <div className="flex items-center space-x-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: '#9333ea' }}
            >
              <CircleDollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-lg font-semibold ${textPrimary}`}>
                {token.symbol}
              </p>
              <p className={`text-sm ${textSecondary}`}>{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl font-semibold ${textPrimary}`}>
              {Number.parseFloat(token.balance).toFixed(6)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

