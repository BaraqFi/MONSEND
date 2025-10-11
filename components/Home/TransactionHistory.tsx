'use client'

import { publicClient, monadTestnet } from '@/lib/viem'
import { useEffect, useState } from 'react'
import { formatEther, type Address, type Hash } from 'viem'

interface Transaction {
  hash: Hash
  from: Address
  to: Address | null
  value: bigint
  timestamp: number
  status: 'success' | 'pending' | 'failed'
  blockNumber: bigint
}

export function TransactionHistory({ address }: { address: Address }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)

      try {
        // Get the latest block number
        const latestBlock = await publicClient.getBlockNumber()

        // Fetch recent blocks (last 100 blocks or so)
        const fromBlock =
          latestBlock - BigInt(100) > BigInt(0)
            ? latestBlock - BigInt(100)
            : BigInt(0)

        // Get transactions for this address
        const logs = await publicClient.getLogs({
          fromBlock,
          toBlock: latestBlock,
        })

        // Filter and format transactions
        // Note: This is a simplified approach
        // In production, you'd use an indexer or explorer API
        const txs: Transaction[] = []

        // For now, we'll show a placeholder message
        setTransactions(txs)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()

    // Refresh every 15 seconds
    const interval = setInterval(fetchTransactions, 15000)
    return () => clearInterval(interval)
  }, [address])

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">Loading transactions...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-sm">No transactions yet</p>
        <p className="text-gray-500 text-xs mt-2">
          Your transaction history will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.hash}
          className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg hover:bg-[#252541] transition-colors cursor-pointer"
          onClick={() =>
            window.open(
              `${monadTestnet.blockExplorers.default.url}/tx/${tx.hash}`,
              '_blank',
            )
          }
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.from.toLowerCase() === address.toLowerCase()
                  ? 'bg-red-500/20'
                  : 'bg-green-500/20'
              }`}
            >
              <span className="text-xl">
                {tx.from.toLowerCase() === address.toLowerCase() ? '↑' : '↓'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                {tx.from.toLowerCase() === address.toLowerCase()
                  ? 'Sent'
                  : 'Received'}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(tx.timestamp * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold ${
                tx.from.toLowerCase() === address.toLowerCase()
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}
            >
              {tx.from.toLowerCase() === address.toLowerCase() ? '-' : '+'}
              {formatEther(tx.value)} MON
            </p>
            <p className="text-xs text-gray-500">
              {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

