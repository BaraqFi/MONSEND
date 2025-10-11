'use client'

import { publicClient } from '@/lib/viem'
import { useEffect, useState } from 'react'
import { formatEther, type Address } from 'viem'

export function WalletBalance({ address }: { address: Address }) {
  const [balance, setBalance] = useState<string>('0')
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

    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000)
    return () => clearInterval(interval)
  }, [address])

  return (
    <div className="space-y-2 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">MON Balance</h2>
      <div className="flex flex-col space-y-2">
        {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!isLoading && !error && (
          <div className="bg-white text-black rounded-md p-4">
            <p className="text-3xl font-bold font-mono">{balance}</p>
            <p className="text-sm text-gray-600 mt-1">MON</p>
          </div>
        )}
        <p className="text-xs text-gray-500">
          Address: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </div>
  )
}

