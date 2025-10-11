'use client'

import { useEffect, useState } from 'react'
import { formatEther, type Address } from 'viem'

import { useTheme } from '@/components/theme-provider'
import { publicClient } from '@/lib/viem'

interface WalletBalanceProps {
  address: Address
  refreshTrigger?: number
}

export function WalletBalance({ address, refreshTrigger }: WalletBalanceProps) {
  const { theme } = useTheme()
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return

      setIsLoading(true)
      setError(null)

      try {
        const bal = await publicClient.getBalance({ address })
        setBalance(formatEther(bal))
      } catch (err) {
        console.error('Failed to fetch balance:', err)
        setError('Failed to fetch balance')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [address, refreshTrigger])

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textSecondary =
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className="space-y-2 py-6 text-center">
      <p
        className={`text-sm uppercase tracking-wider ${textSecondary}`}>
        Total Balance
      </p>
      {isLoading ? (
        <div className="animate-pulse">
          <div
            className={`mx-auto h-12 w-48 rounded-md ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          />
        </div>
      ) : error ? (
        <p className="text-lg font-semibold text-red-500">{error}</p>
      ) : (
        <p className={`font-mono text-5xl font-bold ${textPrimary}`}>
          {Number.parseFloat(balance ?? '0').toFixed(4)} MON
        </p>
      )}
    </div>
  )
}

