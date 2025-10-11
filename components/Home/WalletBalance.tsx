'use client'

import { publicClient } from '@/lib/viem'
import { useEffect, useState } from 'react'
import { formatEther, type Address } from 'viem'

interface WalletBalanceProps {
  address: Address
  refreshTrigger?: number
}

export function WalletBalance({ address, refreshTrigger }: WalletBalanceProps) {
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return

      setIsLoading(true)

      try {
        const bal = await publicClient.getBalance({ address })
        setBalance(formatEther(bal))
      } catch (err) {
        console.error('Failed to fetch balance:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [address, refreshTrigger])

  return (
    <div className="text-center space-y-2 py-6">
      <p className="text-gray-400 text-sm uppercase tracking-wider">Balance</p>
      {isLoading ? (
        <p className="text-4xl font-bold text-white">Loading...</p>
      ) : (
        <p className="text-5xl font-bold text-white font-mono">
          {Number.parseFloat(balance).toFixed(6)} MON
        </p>
      )}
    </div>
  )
}

